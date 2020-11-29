import { logger } from './logger';

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

/**
 * When running certain tasks we need to continuously call the API to retrieve
 * new information and to see if the task is completed. This process can be
 * kinda flaky, so to make it more robust we:
 * 1. Retry failing requests up to 5 times to make sure a few sporadic network
 *    errors don't cause the entire task to fail.
 * 2. Poll at varying intervals, starting from 250ms up to 10,000ms, to reduce
 *    the amount of requests being made while still delivering results swiftly
 *    if the task is done quickly.
 */
export async function poll<T>(
  makeRequest: () => Promise<T>,
  isDone: (data: T) => boolean,
  shouldIgnoreError: (error: Error) => boolean = () => false,
): Promise<T> {
  let retryCounter = 0;
  const maxRetries = 5;

  // [<interval>, <amount of times to use the interval>]
  // The comments below assume the API call is instant to make the chosen intervals more clear
  const intervals: [number, number][] = [
    // 4 requests per second for the first second
    [250, 4],
    // 1 request per second for the following 9 seconds
    [1000, 9],
    // 1 request per 2 seconds for the following 20 seconds
    [2000, 10],
    // 1 request per 5 seconds for the following 4.5 minutes
    [5000, 54],
    // 1 request per 10 seconds for the rest of the task
    [10000, 1e9],
  ];

  let pollCounter = 0;
  let currentIntervalIndex = 0;

  let data: T = null;

  while (true) {
    let skipIsDone = false;

    try {
      data = await makeRequest();
      retryCounter = 0;
    } catch (err) {
      if (!shouldIgnoreError(err)) {
        retryCounter++;

        logger.debug(`Request failed while polling for new information (attempt ${retryCounter}/${maxRetries})`);

        if (retryCounter === maxRetries) {
          throw err;
        }
      }

      skipIsDone = true;
    }

    if (!skipIsDone && isDone(data)) {
      return data;
    }

    await sleep(intervals[currentIntervalIndex][0]);

    pollCounter++;
    if (pollCounter === intervals[currentIntervalIndex][1]) {
      currentIntervalIndex++;
      pollCounter = 0;
    }
  }
}
