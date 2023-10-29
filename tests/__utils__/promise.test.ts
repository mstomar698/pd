import { expect, test } from 'vitest';
import { promise } from '../../src/utils';

test('promise resolves with value when passed a resolved promise', async () => {
  const expectedValue = 'resolved value';
  const promisedValue = Promise.resolve(expectedValue);
  const [error, data] = await promise(promisedValue);
  expect(error).toBeUndefined();
  expect(data).toBe(expectedValue);
});

test('promise rejects with error when passed a rejected promise', async () => {
  const expectedError = new Error('rejected promise');
  const promisedValue = Promise.reject(expectedError);
  const [error, data] = await promise(promisedValue);
  expect(error).toBe(expectedError);
  expect(data).toBeUndefined();
});

test('promise resolves with value when passed a non-promise value', async () => {
  const expectedValue = 'non-promise value';
  const [error, data] = await promise(expectedValue);
  expect(error).toBeUndefined();
  expect(data).toBe(expectedValue);
});
