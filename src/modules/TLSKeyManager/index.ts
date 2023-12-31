import fs from 'fs';
import { spawn } from 'child_process';
import winston from 'winston';
import path from 'path';
import { mdcLightFolder } from '../ConfigManager';

export class TLSKeyManager {
  private PATH = path.join(mdcLightFolder, 'sslkeys');

  public async generateKeys(): Promise<void> {
    return new Promise((resolve, reject) => {
      const logPrefix = 'TLSKeyManager::generateKeys';
      winston.debug(`${logPrefix} no SSL keys found. Generating...`);
      if (
        !fs.existsSync(`${this.PATH}/ssl_private.key`) ||
        !fs.existsSync(`${this.PATH}/ssl.crt`)
      ) {
        this.opensslWrapper(
          `openssl req -x509 -nodes -days 10950 -newkey rsa:4096 -keyout ${this.PATH}/ssl_private.key -out ${this.PATH}/ssl.crt -subj "/C=DE/L=Bielefeld/O=DMG MORI Digital GmbH/CN=IOT2050/emailAddress=info@dmgmori.com"`,
          (err, stderr, stdout) => {
            if (err) {
              winston.debug(`${logPrefix} failed to generate SSL keys`);
              winston.error(JSON.stringify(err));
              reject(err);
              return undefined;
            }
            resolve();
            return undefined;
          }
        );
      } else {
        resolve();
        return;
      }
    });
  }

  private opensslWrapper(
    params: string | Array<string>,
    callback = (
      err: Error | string | null,
      stderr: string | null,
      stdout: string | null
    ) => undefined
  ): void {
    const stdout: any[] = [];
    const stderr: any[] = [];

    let parameters =
      typeof params === 'string'
        ? params.match(/(?:[^\s"]+|"[^"]*")+/g) ?? [] //Regex preserves the quoted substring.
        : params;

    if (parameters[0] === 'openssl') {
      parameters.shift();
    }

    for (let i = 0; i <= parameters.length - 1; i++) {
      // Filter out quotation mark in case of quoted parameter
      const characterToFilterOut = '"';
      if (parameters[i].includes(characterToFilterOut)) {
        parameters[i] = parameters[i].replace(
          new RegExp(characterToFilterOut, 'g'),
          ''
        );
      }
    }

    const openSSLProcess = spawn('openssl', parameters);

    openSSLProcess.stdout.on('data', (data) => {
      stdout.push(data);
    });

    openSSLProcess.stderr.on('data', (data) => {
      stderr.push(data);
    });

    openSSLProcess.on('error', (error) => {
      winston.error(error);
      callback(new Error(error.message), null, null);
    });

    openSSLProcess.on('close', (closeStatusCode, closeSignal) => {
      if (closeStatusCode === 0) {
        callback(null, stderr.toString(), stdout.toString());
      } else {
        callback(
          new Error(closeSignal as string),
          stderr.toString(),
          stdout.toString()
        );
      }
    });
  }
}
