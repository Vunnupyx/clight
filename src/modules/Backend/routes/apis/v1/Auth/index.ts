import { Request, Response } from 'express';

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


export const authHandlers = {
    loginPost: loginPostHandler,
}
