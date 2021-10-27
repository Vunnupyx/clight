export class LoginRequest {
  userName!: string;
  password!: string;
}

export class LoginResponse {
  accessToken!: string;
  passwordChangeRequired!: boolean;
}

export class ForgotPasswordRequest {
  email!: string;
}

export class ResetPasswordRequest {
  resetToken!: string;
  newPassword!: string;
}

export class ChangePasswordRequest {
  oldPassword!: string;
  newPassword!: string;
}
