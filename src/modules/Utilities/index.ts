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
  object1: object,
  object2: object,
  ignoreKeys: string[] = []
): boolean {
  let hasChange = false;
  for (const key in object1) {
    if (!ignoreKeys.includes(key) && object2[key] !== object1[key]) {
      hasChange = true;
    }
  }
  return !hasChange;
}
