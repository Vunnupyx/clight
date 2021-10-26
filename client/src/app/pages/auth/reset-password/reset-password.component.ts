import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../shared';
import { ResetPasswordRequest } from '../../../models/auth';


@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent {
  resetPassword = {
    newPassword: '',
    confirmPassword: '',
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private auth: AuthService,
  ) {}

  validateConfirmPassword(form: NgForm) {
    const { newPassword, confirmPassword } = form.controls;

    if (newPassword.value === confirmPassword.value) {
      const prevErrors = confirmPassword.errors;

      if (prevErrors) {
        delete prevErrors.pattern;

        confirmPassword.setErrors(Object.keys(prevErrors).length === 0 ? null : prevErrors);
      } else {
        confirmPassword.setErrors(null);
      }
    } else {
      confirmPassword.setErrors({ pattern: 'Confirm password does not match to new password' });
    }
  }

  onSubmit() {
    const data: ResetPasswordRequest = {
      newPassword: this.resetPassword.newPassword,
      resetToken: this.route.snapshot.params.resetToken,
    };

    return this.auth.resetPassword(data)
      .then(() => {
        this.toastr.success(this.translate.instant('auth-reset-password.ResetPasswordSuccess'));
        return this.router.navigate(['/login']);
      })
      .catch((error) => this.toastr.error(error.error.message));
  }
}
