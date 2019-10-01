import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginModule } from 'app/main/authentication/login/login.module';
import { RegisterModule } from 'app/main/authentication/register/register.module';
import { ForgotPasswordModule } from 'app/main/authentication/forgot-password/forgot-password.module';
import { ResetPasswordModule } from 'app/main/authentication/reset-password/reset-password.module';
import { LockModule } from 'app/main/authentication/lock/lock.module';
import { MailConfirmModule } from 'app/main/authentication/mail-confirm/mail-confirm.module';
import { VerifyConfirmModule } from './verify-confirm/verify-confirm.module';


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // Authentication
    LoginModule,
    RegisterModule,
    ForgotPasswordModule,
    ResetPasswordModule,
    LockModule,
    MailConfirmModule,
    VerifyConfirmModule,
  ]
})
export class AuthenticationModule { }
