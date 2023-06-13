import nodeNet from 'node:net';

/**
 * Returns a promise that is rejected after the specified number of milliseconds
 * (Intended for use with Promise.race())
 * @param ms timeout length
 * @returns
 */
export const timeoutError = (ms: number): Promise<void> => {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout Error (${ms})`)), ms);
  });
};

/**
 * Async timeout
 * @param ms timeout length
 * @returns
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve, _) => {
    setTimeout(resolve, ms);
  });
};

/**
 * Make unique array
 * @param array input array with duplication
 * @param selector key to filter array
 * @returns
 */
export function unique<T>(array: T[], selector: (item: T) => any): T[] {
  return [...new Map(array.map((item) => [selector(item), item])).values()];
}

/**
 * Compares whether contents of two objects are same
 * @param object1
 * @param object2
 * @param ignoreKeys array of keys to ignore, optional
 * @returns boolean
 */
export function areObjectsEqual(
  object1: any,
  object2: any,
  ignoreKeys: string[] = []
): boolean {
  if (
    typeof object1 !== 'object' ||
    typeof object2 !== 'object' ||
    Object.keys(object1 ?? {}).length !== Object.keys(object2 ?? {}).length
  ) {
    return false;
  }
  let hasChange = false;
  for (const key in object1) {
    if (!ignoreKeys.includes(key) && object2[key] !== object1[key]) {
      hasChange = true;
    }
  }
  return !hasChange;
}

/**
 * Validates the input to be valid ip or hostname
 *
 * @see https://www.rfc-editor.org/rfc/rfc1123
 * "The DNS defines domain name syntax very generally
 * -- a string of labels each containing up to 63 8-bit octets,
 * separated by dots, and with a maximum total of 255
 * octets." See the link for remainder of the specification
 * @see https://www.rfc-editor.org/rfc/rfc952
 * "A "name" (Net, Host, Gateway, or Domain name) is a text string up
 * to 24 characters drawn from the alphabet (A-Z), digits (0-9), minus
 * sign (-), and period (.)" See the link for remainder of the specification
 * @see https://stackoverflow.com/a/3824105
 * The link for Regex, which conforms above specifications.
 * Regex used below is an extended version of this to also allow
 * http:// or https:// in the beginning of hostname,
 * as user can paste the hostname together with http
 */
export function isValidIpOrHostname(textInput: any): boolean {
  if (!textInput || typeof textInput !== 'string') {
    return false;
  }
  const isValidIP = nodeNet.isIP(textInput) > 0; // returns 4 for IPv4 or 6 for IPv6, otherwise 0
  const validHostnameRegex =
    /^(http([s]){0,1}:\/\/){0,1}([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])(\.([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]{0,61}[a-zA-Z0-9]))*$/;

  const isValidHostname = validHostnameRegex.test(textInput);
  return isValidIP || isValidHostname;
}

/**
 * Pings a given host and port
 */
export function pingSocketPromise(
  port: number,
  host: string,
  timeout: number
): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const tcpClient = new nodeNet.Socket();
    tcpClient.setTimeout(timeout);
    tcpClient.once('close', () => {
      tcpClient.destroy();
      reject('close');
    });
    tcpClient.once('timeout', () => {
      tcpClient.destroy();
      reject('timeout');
    });
    tcpClient.once('error', () => {
      tcpClient.destroy();
      reject('error');
    });
    try {
      tcpClient.connect(port, host, () => {
        // Success
        tcpClient.destroy();
        resolve();
      });
    } catch (e) {
      tcpClient.destroy();
      reject(e);
    }
  });
}

export function insertToArrayIfNotExists<EntryType>(
  array: EntryType[],
  entry: EntryType,
  validatorFn?: (arg0: EntryType) => boolean
): void {
  const index = array.findIndex((item) =>
    validatorFn ? validatorFn(item) : item === entry
  );
  if (index < 0) {
    //inserts entry if not exists
    array.push(entry);
  }
}

export function deleteFromArray<EntryType>(
  array: EntryType[],
  validatorFn: (arg0: EntryType) => boolean
): void {
  const index = array.findIndex((item) => validatorFn(item));
  if (index < 0) {
    throw Error(`No Entry found`);
  } else {
    // Removes entry
    array.splice(index, 1);
  }
}

export function updateItemInArray<EntryType>(
  array: EntryType[],
  entry: EntryType,
  validatorFn: (arg0: EntryType) => boolean
): void {
  const index = array.findIndex((item) => validatorFn(item));
  if (index < 0) {
    throw Error(`No Entry found`);
  } else {
    //Replaces entry
    array.splice(index, 1, entry);
  }
}
