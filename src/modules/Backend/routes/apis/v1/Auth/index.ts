import { Response } from 'express';
import { Request } from '../../../../AuthManager';
import * as uuid from 'uuid';

import { AuthManager } from '../../../../AuthManager';

let authManager: AuthManager;

export function setAuthManager(auth: AuthManager) {
  authManager = auth;
}

/**
 * Login POST Handler
 * @param  {Request} request
 * @param  {Response} response
 */
function loginPostHandler(request: Request, response: Response) {
  if (!request.body.userName || !request.body.password) {
    response.status(400).json({ message: 'Wrong Data!' });
    return;
  }

  authManager
    .login(request.body.userName, request.body.password)
    .then((payload) => response.status(200).json(payload))
    .catch((error) => response.status(400).json({ message: error.message }));
}

/**
 * Send Reset Link POST Handler
 * @param  {Request} request
 * @param  {Response} response
 */
function sendResetLinkPostHandler(request: Request, response: Response) {
  const passwordResetToken = uuid.v4();

  // TODO: implement reset link post handler
  response.status(200).send();
}

/**
 * Verify Reset Password Token POST Handler
 * @param  {Request} request
 * @param  {Response} response
 */
function verifyResetPasswordTokenPostHandler(
  request: Request,
  response: Response
) {
  // TODO: implement verify reset token post handler

  response.status(200).send();
}

/**
 * Reset Password POST Handler
 * @param  {Request} request
 * @param  {Response} response
 */
function resetPasswordPostHandler(request: Request, response: Response) {
  // TODO: implement reset password post handler

  response.status(200).send();
}

/**
 * Change Password POST Handler
 * @param  {Request} request
 * @param  {Response} response
 */
async function changePasswordPostHandler(request: Request, response: Response) {
  authManager
    .changePassword(
      request.user?.userName!,
      request.body.oldPassword,
      request.body.newPassword
    )
    .then((payload) => response.status(200).json(payload))
    .catch((error) => response.status(400).json({ message: error.message }));
}

export const authHandlers = {
  loginPost: loginPostHandler,
  sendResetLinkPost: sendResetLinkPostHandler,
  verifyResetPasswordTokenPost: verifyResetPasswordTokenPostHandler,
  resetPasswordPost: resetPasswordPostHandler,
  changePasswordPost: changePasswordPostHandler
};
