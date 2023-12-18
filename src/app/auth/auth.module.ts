import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthComponent } from './auth.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [AuthComponent],
  imports: [
      ReactiveFormsModule,
      RouterModule.forChild([{ path: 'auth', component: AuthComponent }]),
      SharedModule,
  ],
  exports: [],
})
export class AuthModule {}
