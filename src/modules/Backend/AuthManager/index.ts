import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from 'express';
import { hash, compare } from 'bcryptjs';

import { ConfigManager } from '../../ConfigManager';
import { IAuthUser } from '../../ConfigManager/interfaces';
import winston from 'winston';
import { System } from '../../System';

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
  private readonly EMPTY_MAC_ADDRESS = '00:00:00:00:00:00';

  constructor(private configManager: ConfigManager) {}

  /**
   * @async
   * @param  {string} username
   * @param  {string} password
   * @returns {Promise<LoginDto>} Promise<LoginDto>
   */
  async login(username: string, password: string): Promise<LoginDto> {
    const logPrefix = `${AuthManager.className}::login`;
    const serializedUsername = username.trim();

    winston.debug(`${logPrefix} User ${username} attempting to login`);

    let loggedUser = this.configManager.authUsers.find(
      (user) => user.userName === serializedUsername
    );

    const macAddress = (await this.readDeviceLabelMacAddress())
      .split(':')
      .join('');
    const defaultUsername = 'User';
    const defaultPassword = macAddress;

    if (!loggedUser && username !== defaultUsername) {
      winston.warn(`${logPrefix} User ${username} could not be found!`);
      throw new Error('User with these credentials could not be found!');
    }

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

    const accessToken = jwt.sign(
      userTokenPayload,
      { key: authConfig.secret, passphrase: '' },
      {
        expiresIn: this.configManager.runtimeConfig.auth.expiresIn,
        algorithm: 'RS256'
      }
    );

    const passwordChangeRequired = loggedUser.passwordChangeRequired;

    return Promise.resolve({ accessToken, passwordChangeRequired });
  }

  /**
   * @param  {{withPasswordChangeDetection:boolean,withBooleanResponse:(boolean|undefined)}} options
   * @returns {Function} callback
   */
  verifyJWTAuth({
    withPasswordChangeDetection,
    withBooleanResponse
  }: {
    withPasswordChangeDetection: boolean;
    withBooleanResponse?: boolean;
  }) {
    const logPrefix = `${AuthManager.className}::verifyJWTAuth`;

    return (request: Request, response: Response, next?: NextFunction) => {
      const header = request.headers['authorization'];

      if (!header) {
        response
          .status(403)
          .json({ message: 'Authorization token is required!' });
        return;
      }

      try {
        const token = header.substring('Bearer '.length);

        const user = jwt.verify(token, this.configManager.authConfig.public, {
          algorithms: ['RS256']
        }) as UserTokenPayload;

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
        if (withBooleanResponse) {
          return true;
        } else {
          next();
        }
      } catch (err) {
        winston.error(
          `${logPrefix} jwt vaidation failed. ${JSON.stringify(err)}`
        );
        response.status(401).json({ message: 'Unauthorized!' });
        if (withBooleanResponse) {
          return false;
        }
      }
    };
  }

  /**
   * @async
   * @param  {string} username
   * @param  {string} oldPassword
   * @param  {string} newPassword
   * @returns {Promise<boolean>} boolean
   */
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

  /**
   * @async
   * @param  {string} username
   * @param  {string} password
   * @returns {Promise<IAuthUser>} Promise<IAuthUser>
   */
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

  /**
   * @async
   * @returns {Promise<string>} Mac Address
   */
  private async readDeviceLabelMacAddress(): Promise<string> {
    const address = await new System().readMacAddress('eth0');
    return address === null ? this.EMPTY_MAC_ADDRESS : address;
  }
}
