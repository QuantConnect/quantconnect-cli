import * as ProgressBar from 'progress';
import { logger } from './logger';

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

interface PollOptions<T> {
  makeRequest: () => Promise<T>;
  isDone: (data: T) => boolean;
  shouldIgnoreError?: (error: Error) => boolean;
  getProgress?: (data: T) => number;
}

let progressBar: ProgressBar = null;

function updateProgressBar(ratio: number): void {
  if (progressBar === null || progressBar.complete) {
    return;
  }

  progressBar.update(ratio);
}

export function terminateProgressBar(): void {
  if (progressBar !== null && !progressBar.complete) {
    progressBar.terminate();
  }

  progressBar = null;
}

/**
 * When running certain tasks we need to continuously call the API to retrieve
 * new information and to see if the task is completed. To prevent making
 * thousands of requests when waiting for long-running tasks to complete we
 * poll at varying intervals, starting from 250ms up to 10,000ms. This reduces
 * the amount of requests being made while still delivering results swiftly if
 * the task is done quickly.
 */
export async function poll<T>({ makeRequest, isDone, shouldIgnoreError, getProgress }: PollOptions<T>): Promise<T> {
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
  progressBar = getProgress !== undefined ? logger.progress() : null;

  while (true) {
    let dataUpdated = true;

    try {
      data = await makeRequest();
    } catch (err) {
      if (shouldIgnoreError === undefined || !shouldIgnoreError(err)) {
        throw err;
      }

      dataUpdated = false;
    }

    if (dataUpdated && getProgress !== undefined) {
      updateProgressBar(getProgress(data));
    }

    if (dataUpdated && isDone(data)) {
      terminateProgressBar();
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
