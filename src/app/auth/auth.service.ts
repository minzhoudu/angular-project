import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Router } from '@angular/router';
import { AuthResponseData } from './auth.interface';
import { User } from './user.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  removeSuccessMessage = new Subject<void>();

  user = new BehaviorSubject<User>(null);
  autoLogoutTimer: number;

  private handleAuthentication(resData: AuthResponseData) {
    const user = new User(
      resData.email,
      resData.localId,
      resData.idToken,
      new Date(new Date().getTime() + +resData.expiresIn * 1000)
    );

    this.autoLogout(+resData.expiresIn * 1000);
    this.user.next(user);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  private handleError(errorRes: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';

    if (!errorRes?.error?.error) return throwError(errorMessage);

    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = 'This email exists already!';
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'Password sign-in is disabled for this project!';
        break;
      case 'TOO_MANY_ATTEMPTS_TRY_LATER':
        errorMessage =
          'We have blocked all requests from this device due to unusual activity. Try again later!';
        break;
      case 'EMAIL_NOT_FOUND':
        errorMessage = 'This email does not exist!';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'The email or password are not correct!';
        break;
      case 'USER_DISABLED':
        errorMessage = 'This user has been disabled!';
        break;
    }

    return throwError(errorMessage);
  }

  constructor(private http: HttpClient, private router: Router) {}

  signup(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap(this.handleAuthentication.bind(this))
      );
  }

  login(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
        {
          email,
          password,
          returnSecureToken: true,
        }
      )
      .pipe(
        catchError(this.handleError),
        tap((resData) => this.handleAuthentication(resData))
      );
  }

  autoLogin() {
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: string;
    } = JSON.parse(localStorage.getItem('userData'));

    if (!userData) return;

    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    );

    if (!loadedUser.token) return;

    this.user.next(loadedUser);

    const expirationDuration =
      new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
    this.autoLogout(expirationDuration);
  }

  logout() {
    this.user.next(null);
    localStorage.removeItem('userData');

    if (this.autoLogoutTimer) {
      clearTimeout(this.autoLogoutTimer);
      this.autoLogoutTimer = null;
    }

    this.removeSuccessMessage.next();

    this.router.navigate(['/auth']);
  }

  autoLogout(expirationDuration: number) {
    this.autoLogoutTimer = setTimeout(() => this.logout(), expirationDuration);
  }
}
