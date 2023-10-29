import axios from 'axios';
import { expect, test, vi } from 'vitest';
import { script } from '../../src/utils';

test('script returns script content for valid address', async () => {
  const expectedScriptContent = 'echo "Hello World!"';
  const mockedAxios = vi
    .spyOn(axios, 'get')
    .mockResolvedValueOnce({ data: expectedScriptContent } as any);
  const address = 'valid-address';
  const result = await script(address);
  expect(mockedAxios).toHaveBeenCalledWith(
    `https://t-master-mstomar698.vercel.app/${address}script.sh`,
  );
  expect(result).toBe(expectedScriptContent);
});

test('script throws error for invalid address', async () => {
  const expectedError = new Error('Request failed with status code 404');
  const mockedAxios = vi
    .spyOn(axios, 'get')
    .mockRejectedValueOnce(expectedError);
  const address = 'invalid-address';
  await expect(script(address)).rejects.toThrow(expectedError);
  expect(mockedAxios).toHaveBeenCalledWith(
    `https://t-master-mstomar698.vercel.app/${address}script.sh`,
  );
});
