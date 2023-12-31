import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';

import { ProfileService } from '../../../services/profile.service';
import { ChangePasswordRequest } from '../../../models/auth';
import { AuthService } from 'app/shared';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePassword = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private translate: TranslateService,
    private profileService: ProfileService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    const oldPassword = this.authService.getOldPassword();;

    this.changePassword.oldPassword = oldPassword || '';
  }

  /**
   * if passwords mismatch it sets an error
   */
  validateConfirmPassword(form: NgForm) {
    const { newPassword, confirmPassword } = form.controls;

    if (newPassword.value === confirmPassword.value) {
      const prevErrors = confirmPassword.errors;

      if (prevErrors) {
        delete prevErrors.pattern;

        confirmPassword.setErrors(
          Object.keys(prevErrors).length === 0 ? null : prevErrors
        );
      } else {
        confirmPassword.setErrors(null);
      }
    } else {
      confirmPassword.setErrors({
        pattern: 'Confirm password does not match to new password'
      });
    }
  }

  async onSubmit() {
    const data: ChangePasswordRequest = {
      oldPassword: this.changePassword.oldPassword,
      newPassword: this.changePassword.newPassword
    };

    try {
      await this.profileService.changePassword(data);
      this.authService.clearOldPassword();
      this.toastr.success(
        this.translate.instant(
          'settings-change-password.ChangePasswordSuccess'
        )
      );
      this.router.navigate(['/']);
    } catch (error: any) {
      this.toastr.error(error.error.message);
    }
  }
}
