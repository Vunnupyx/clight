import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { promises as fs } from 'fs';

import { ConfigManager } from '../../ConfigManager';
import { IAuthUser } from '../../ConfigManager/interfaces';
import winston from 'winston';

interface LoginDto {
  accessToken: string;
}

interface UserTokenPayload {
  userName: string;
}

declare module 'express' {
  export interface Request {
    user: UserTokenPayload;
  }
}

export class AuthManager {
  private static className: string = AuthManager.name;
  private readonly EMPTY_MAC_ADDRESS = '00:00:00:00:00:00\n';

  constructor(private configManager: ConfigManager) {}

  async login(username: string, password: string): Promise<LoginDto> {
    const logPrefix = `${AuthManager.className}::login`;
    const regex = /[^A-Za-z0-9]/g;
    const serializedUsername =
      username.substring(0, 2) + username.substring(2).replace(regex, '');

    winston.debug(`${logPrefix} User ${username} attempting to login`);

    let loggedUser = this.configManager.authUsers.find(
      (user) => user.userName === serializedUsername
    );

    if (!loggedUser && !username.startsWith('DM')) {
      winston.warn(`${logPrefix} User ${username} could not be found!`);
      throw new Error('User with these credentials could not be found!');
    }

    const macAddress = await this.readDeviceLabelMacAddress();

    if (macAddress !== serializedUsername.substring(2)) {
      winston.warn(
        `${logPrefix} Mac address ${macAddress} is not matching the username ${username}!`
      );
      throw new Error('User with these credentials could not be found!');
    }

    const defaultPassword =
      this.configManager.runtimeConfig.auth.defaultPassword;

    if (!loggedUser) {
      if (defaultPassword === password) {
        loggedUser = await this.createUser(serializedUsername, password);
      } else {
        winston.warn(`${logPrefix} Invalid default password!`);
        throw new Error('User with these credentials could not be found!');
      }
    } else {
      const isValid = await compare(password, loggedUser.password);

      if (!isValid) {
        winston.warn(`${logPrefix} Invalid password!`);
        throw new Error('User with these credentials could not be found!');
      }
    }

    const authConfig = this.configManager.authConfig;
    const userTokenPayload = {
      userName: serializedUsername
    } as UserTokenPayload;

    const accessToken = jwt.sign(userTokenPayload, authConfig.secret, {
      expiresIn: this.configManager.runtimeConfig.auth.expiresIn
    });

    const passwordChangeRequired = loggedUser.passwordChangeRequired;

    return Promise.resolve({ accessToken, passwordChangeRequired });
  }

  verifyJWTAuth({
    withPasswordChangeDetection
  }: {
    withPasswordChangeDetection: boolean;
  }) {
    return (request: Request, response: Response, next: NextFunction) => {
      const header = request.headers['authorization'];

      if (!header) {
        response
          .status(403)
          .json({ message: 'Authorization token is required!' });
        return;
      }

      try {
        const token = header.substring('Bearer '.length);

        const user = jwt.verify(
          token,
          this.configManager.authConfig.secret
        ) as UserTokenPayload;

        const loggedUser = this.configManager.authUsers.find(
          (auth) => auth.userName === user.userName
        );

        if (withPasswordChangeDetection && loggedUser.passwordChangeRequired) {
          response
            .status(403)
            .json({ message: 'Change default password is required!' });
          return;
        }

        request.user = user;

        next();
      } catch (err) {
        response.status(401).json({ message: 'Unauthorized!' });
      }
    };
  }

  async changePassword(
    username: string,
    oldPassword: string,
    newPassword: string
  ): Promise<boolean> {
    const logPrefix = `${AuthManager.className}::changePassword`;
    winston.debug(
      `${logPrefix} User ${username} attempting to change password.`
    );

    let loggedUser = this.configManager.authUsers.find(
      (user) => user.userName === username
    );

    if (!loggedUser) {
      winston.warn(
        `${logPrefix} Failed to change password. User ${username} not found.`
      );
      throw new Error('User with these credentials could not be found!');
    }

    if (!(await compare(oldPassword, loggedUser.password))) {
      winston.warn(
        `${logPrefix} Failed to change password. Incorrect password.`
      );
      throw new Error('Old password is incorrect!');
    }

    loggedUser.password = await hash(newPassword, 10);
    loggedUser.passwordChangeRequired = false;

    winston.info(`${logPrefix} Password changed successfully.`);
    await this.configManager.saveAuthConfig();

    return true;
  }

  private async createUser(
    username: string,
    password: string
  ): Promise<IAuthUser> {
    const user = {
      userName: username,
      password: await hash(password, 10),
      passwordChangeRequired: true
    };

    this.configManager.authUsers.push(user);
    await this.configManager.saveAuthConfig();

    return user;
  }

  private async readDeviceLabelMacAddress() {
    let address;

    try {
      address = await fs.readFile('/sys/class/net/eth1/address', {
        encoding: 'utf-8'
      });
    } catch (err) {
      address = this.EMPTY_MAC_ADDRESS;
    }

    return address.split(':').join('').split('\n').join('').toUpperCase();
  }
}
