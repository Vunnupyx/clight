import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { NgForm } from '@angular/forms';

import { AuthService, LocalStorageService } from '../../../shared';
import { ForgotPasswordRequest, LoginRequest } from '../../../models/auth';
import { EMAIL_REGEX } from '../../../shared/utils/regex';
import { TimeSyncCheckService } from '../../../services/time-sync-check.service';

enum LoginPageMode {
  Login = 'Login',
  ForgotPassword = 'ForgotPassword'
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  mode: LoginPageMode = LoginPageMode.Login;
  LoginPageMode = LoginPageMode;

  EMAIL_REGEX = EMAIL_REGEX;

  loginRequest: LoginRequest = {
    userName: 'User',
    password: ''
  };

  forgotPasswordRequest: ForgotPasswordRequest = {
    email: ''
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private auth: AuthService,
    private localStorageService: LocalStorageService,
    private timeSyncCheckService: TimeSyncCheckService
  ) {}

  ngOnInit(): void {}

  onSubmit() {
    return this.auth
      .login(this.loginRequest)
      .then((response) => {
        if (response.passwordChangeRequired) {
          this.auth.setOldPassword(this.loginRequest.password);
          return this.router.navigate(['/reset-password']);
        }
        this.timeSyncCheckService.checkTimeDifference();
        return this.router.navigate(['/']);
      })
      .catch(() =>
        this.toastr.error(this.translate.instant('auth-login.AuthError'))
      );
  }

  onForgotPasswordSubmit(form: NgForm) {
    return this.auth
      .sendResetToken(this.forgotPasswordRequest)
      .then(() => {
        this.mode = LoginPageMode.Login;
        form.resetForm({ email: '' });
        this.toastr.success(
          this.translate.instant('auth-login.ResetEmailSentSuccess')
        );
      })
      .catch((error) => this.toastr.error(error.error.message));
  }

  openForgotPassword() {
    window.open(
      `/help${this.translate.instant(
        'common.LanguageDocumentationPath'
      )}/docs/FactoryReset`,
      '_blank'
    );
  }
}
