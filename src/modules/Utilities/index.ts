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
