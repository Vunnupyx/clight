export class LoginRequest {
  userName!: string;
  password!: string;
}

export class LoginResponse {
  accessToken!: string;
}

export class ForgotPasswordRequest {
  email!: string;
}

export class ResetPasswordRequest {
  resetToken!: string;
  newPassword!: string;
}
