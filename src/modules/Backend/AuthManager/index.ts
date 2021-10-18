import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";

import { ConfigManager } from '../../ConfigManager';

interface LoginDto {
    accessToken: string;
}

interface UserTokenPayload {
    userName: string;
}

declare module "express" {
    export interface Request {
        user: UserTokenPayload
    }
}

export class AuthManager {
    constructor(private configManager: ConfigManager) {}

    async login(username: string, password: string): Promise<LoginDto> {
        const loggedUser = this.configManager.runtimeConfig.users.find((user) => user.userName === username && user.password === password);

        if (!loggedUser) {
            throw new Error('User with these credentials could not be found!');
        }

        const authConfig = this.configManager.authConfig;
        const userTokenPayload = { userName: username } as UserTokenPayload;

        const accessToken = jwt.sign(userTokenPayload, authConfig.secret, { expiresIn: authConfig.expiresIn });

        const passwordChangeRequired = true;

        return Promise.resolve({ accessToken, passwordChangeRequired });
    }

    verifyJWTAuth(request: Request, response: Response, next: NextFunction) {
        const header = request.headers['authorization'];

        if (!header) {
            response.status(403).json({ message: 'Authorization token is required!' });
            return;
        }

        try {
            const token = header.substring('Bearer '.length);

            const user = jwt.verify(token, this.configManager.authConfig.secret);

            request.user = user as UserTokenPayload;

            next();
        } catch (err) {
            response.status(401).json({ message: 'Unauthorized!' });
        }
    }
}
