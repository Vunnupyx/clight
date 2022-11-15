import fs from 'fs';
import { ChildProcessWithoutNullStreams, spawn } from 'child_process';
import winston from 'winston';

export class TLSKeyManager {
  private PATH = process.env.TLS_KEY_PATH || '/etc/MDCLight/config';

  public async generateKeys(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!fs.existsSync(`${this.PATH}/ssl_private.key`)) {
        this.opensslWrapper(
          `openssl req -x509 -nodes -days 10950 -newkey rsa:4096 -keyout ${this.PATH}/ssl_private.key -out ${this.PATH}/ssl.crt -subj "/C=DE/L=Bielefeld/O=DMG MORI Digital GmbH/CN=IOT2050/emailAddress=info@dmgmori.com"`,
          (err, stderr, stdout) => {
            if (err) {
              winston.error(err.toString());
              reject();
              return;
            }
            resolve();
            return;
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
    callback = (err: Error, stderr: Array<unknown>, stdout: Array<unknown>) =>
      undefined
  ): ChildProcessWithoutNullStreams {
    const stdout = [];
    const stderr = [];

    let parameters =
      typeof params === 'string'
        ? params.match(/(?:[^\s"]+|"[^"]*")+/g) //Regex preserves the quoted substring.
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
      callback.call(error);
    });

    openSSLProcess.on('close', (closeStatusCode, closeSignal) => {
      if (closeStatusCode === 0) {
        callback.call(null, stderr.toString(), stdout.toString());
      } else {
        callback.call(closeSignal, stderr.toString(), stdout.toString());
      }
    });

    return openSSLProcess;
  }
}
