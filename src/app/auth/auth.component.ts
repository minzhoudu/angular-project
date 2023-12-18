import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthService } from './auth.service';
import { AuthResponseData } from './auth.interface';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit, OnDestroy {
  authForm: FormGroup;
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  successMsg: string = null;

  removeSuccessMessageSub: Subscription;

  private formInit() {
    this.authForm = new FormGroup({
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.removeSuccessMessageSub =
      this.authService.removeSuccessMessage.subscribe(() => {
        this.successMsg = null;
      });

    this.formInit();
  }

  ngOnDestroy(): void {
    this.removeSuccessMessageSub.unsubscribe();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onCloseModal() {
    this.error = null;
  }

  onSubmit() {
    this.error = null;
    this.successMsg = null;

    if (!this.authForm.valid) return;

    const email = this.authForm.get('email').value;
    const password = this.authForm.get('password').value;

    let authObs: Observable<AuthResponseData>;

    this.isLoading = true;

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password);
    } else {
      authObs = this.authService.signup(email, password);
    }

    authObs.subscribe(
      (resData) => {
        resData.registered
          ? (this.successMsg = "You've successfully logged in!")
          : (this.successMsg = "You've successfully registered!");

        this.isLoading = false;

        this.authForm.reset();

        setTimeout(() => {
          this.router.navigate(['/recipes']);
        }, 1000);
      },
      (errorMsg: string) => {
        this.error = errorMsg;
        this.isLoading = false;

        this.authForm.get('password').reset();
      }
    );
  }
}
