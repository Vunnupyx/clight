import { Request, Response } from 'express';
import * as uuid from 'uuid';

import { AuthManager } from '../../../../AuthManager';

let authManager: AuthManager;

export function setAuthManager(auth: AuthManager) {
    authManager = auth;
}

function loginPostHandler(request: Request, response: Response) {
    if (!request.body.userName || !request.body.password) {
        response.status(400).json({ message: 'Wrong Data!' });
        return;
    }

    authManager.login(request.body.userName, request.body.password)
        .then((payload) => response.status(200).json(payload))
        .catch((error) => response.status(400).json({ message: error.message }));
}

function sendResetLinkPostHandler(request: Request, response: Response) {
    const passwordResetToken = uuid.v4();

    // TODO: implement reset link post handler
    response.status(200).send();
}

function verifyResetPasswordTokenPostHandler(request: Request, response: Response) {
    // TODO: implement verify reset token post handler

    response.status(200).send();
}

function resetPasswordPostHandler(request: Request, response: Response) {
    // TODO: implement reset password post handler

    response.status(200).send();
}

export const authHandlers = {
    loginPost: loginPostHandler,
    sendResetLinkPost: sendResetLinkPostHandler,
    verifyResetPasswordTokenPost: verifyResetPasswordTokenPostHandler,
    resetPasswordPost: resetPasswordPostHandler,
}
