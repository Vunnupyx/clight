import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { ToastrService}  from "ngx-toastr";
import { TranslateService } from "@ngx-translate/core";

import { AuthService } from '../../../shared';
import { ForgotPasswordRequest, LoginRequest } from "../../../models/auth";
import { EMAIL_REGEX } from "../../../shared/utils/regex";
import {NgForm} from "@angular/forms";

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
    userName: '',
    password: '',
  };

  forgotPasswordRequest: ForgotPasswordRequest = {
    email: '',
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private auth: AuthService
  ) { }

  ngOnInit(): void {}

  onSubmit() {
    return this.auth.login(this.loginRequest)
      .then((response) => {
        if (response.passwordChangeRequired) {
          return this.router.navigate(['/settings', 'change-password']);
        }

        return this.router.navigate(['/']);
      })
      .catch((error) => this.toastr.error(error.error.message));
  }

  onForgotPasswordSubmit(form: NgForm) {
    return this.auth.sendResetToken(this.forgotPasswordRequest)
      .then(() => {
        this.mode = LoginPageMode.Login;
        form.resetForm({ email: '' });
        this.toastr.success(this.translate.instant('auth-login.ResetEmailSentSuccess'));
      })
      .catch((error) => this.toastr.error(error.error.message));
  }
}