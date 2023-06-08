import { Response } from 'express';
import { AuthManager, Request } from '../../../../AuthManager';

let authManager: AuthManager;

export function setAuthManager(auth: AuthManager): void {
  authManager = auth;
}

/**
 * Login POST Handler
 */
function loginPostHandler(
  request: Request,
  response: Response
): Promise<Response> {
  if (!request.body.userName || !request.body.password) {
    return Promise.resolve(
      response.status(400).json({ message: 'Wrong Data!' })
    );
  }

  return authManager
    .login(request.body.userName, request.body.password)
    .then((payload) => response.status(200).json(payload))
    .catch((error) => response.status(400).json({ message: error.message }));
}

/**
 * Change Password POST Handler
 */
async function changePasswordPostHandler(
  request: Request,
  response: Response
): Promise<void> {
  authManager
    .changePassword(
      request.user.userName,
      request.body.oldPassword,
      request.body.newPassword
    )
    .then((payload) => response.status(200).json(payload))
    .catch((error) => response.status(400).json({ message: error.message }));
}

export const authHandlers = {
  loginPostHandler,
  changePasswordPostHandler
};
