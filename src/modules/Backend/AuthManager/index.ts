import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { hash, compare } from 'bcrypt';

import { ConfigManager } from '../../ConfigManager';
import {IAuthUser} from "../../ConfigManager/interfaces";

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
        const regex = /[^A-Za-z0-9]/g;
        const serializedUsername = username.substring(0, 3) + username.substring(3).replace(regex, "");

        let loggedUser = this.configManager.authUsers.find((user) => user.userName === serializedUsername);

        if (!loggedUser && !username.startsWith('DM_')) {
            throw new Error('User with these credentials could not be found!');
        }

        const defaultPassword = this.configManager.runtimeConfig.auth.defaultPassword;

        if (!loggedUser) {
            if (defaultPassword === password) {
                loggedUser = await this.createUser(serializedUsername, password);
            } else {
                throw new Error('User with these credentials could not be found!');
            }
        } else {
            const isValid = await compare(password, loggedUser.password);

            if (!isValid) {
                throw new Error('User with these credentials could not be found!');
            }
        }

        const authConfig = this.configManager.authConfig;
        const userTokenPayload = { userName: serializedUsername } as UserTokenPayload;

        const accessToken = jwt.sign(userTokenPayload, authConfig.secret, { expiresIn: this.configManager.runtimeConfig.auth.expiresIn });

        const passwordChangeRequired = loggedUser.passwordChangeRequired;

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

    async changePassword(username: string, oldPassword: string, newPassword: string): Promise<boolean> {
        let loggedUser = this.configManager.authUsers.find((user) => user.userName === username);

        if (!loggedUser) {
            throw new Error('User with these credentials could not be found!');
        }

        if (!(await compare(oldPassword, loggedUser.password))) {
            throw new Error('Old password is incorrect!');
        }

        loggedUser.password = await hash(newPassword, 10);
        loggedUser.passwordChangeRequired = false;

        await this.configManager.saveAuthConfig();

        return true;
    }

    private async createUser(username: string, password: string): Promise<IAuthUser> {
        const user = {
            userName: username,
            password: await hash(password, 10),
            passwordChangeRequired: true,
        };

        this.configManager.authUsers.push(user);
        await this.configManager.saveAuthConfig();

        return user;
    }
}
