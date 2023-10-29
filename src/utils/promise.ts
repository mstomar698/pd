//  promise

/**
 * wait for promise and resolve it or pass error
 *
 * @param promisedValue - promise to wait for
 *
 * @returns - promise with resolved value or error
 */

export const promise = async <T = unknown, E = Error>(
  promisedValue: Promise<T> | T,
): Promise<[E, undefined] | [undefined, T]> => {
  try {
    const data = await promisedValue;
    return [undefined, data]; // undefined for error and data for resolved value
  } catch (error: unknown) {
    return [error as E, undefined]; // error as E and undefined resolved value
  }
};

// promisify exported function to async work
export { promisify } from 'node:util';
