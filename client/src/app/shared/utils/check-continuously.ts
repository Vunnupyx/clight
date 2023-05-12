import { sleep } from './async';

/**
 * Periodically checks given Promise with given delay until it resolves
 *
 * @param fn function that returns a Promise to check periodically
 * @param msDelayBetweenCalls delay between checks
 * @param maxRetryCount max retries until the function returns the last result
 * @returns
 */
export async function checkContinuously(
  fn: () => Promise<any>,
  msDelayBetweenCalls: number,
  maxRetryCount: number = null
) {
  return fn()
    .then(async (result) => {
      if (result || (maxRetryCount !== null && maxRetryCount <= 0)) {
        return result;
      } else {
        await sleep(msDelayBetweenCalls);
        return checkContinuously(
          fn,
          msDelayBetweenCalls,
          maxRetryCount !== null ? maxRetryCount - 1 : null
        );
      }
    })
    .catch((err) => {
      // When server is down response is 502, so it will come here as expected
      return 'ERROR';
    });
}
