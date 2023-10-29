/* eslint-disable eslint-comments/disable-enable-pair */
import chalk from 'chalk';
import { expect, test, vi } from 'vitest';
import { display } from '../../src/utils';

test('display.info logs an info message', () => {
  const spy = vi.spyOn(console, 'info');
  display.info('This is an info message');
  expect(spy).toHaveBeenCalledWith(
    chalk.cyanBright.bold(' INFO '),
    'This is an info message',
  );
  spy.mockRestore();
});

test('display.warn logs a warning message', () => {
  const spy = vi.spyOn(console, 'warn');
  display.warn('This is a warning message');
  expect(spy).toHaveBeenCalledWith(
    chalk.bgYellowBright.bold(' WARN '),
    'This is a warning message',
  );
  spy.mockRestore();
});

test('display.error logs an error message', () => {
  const spy = vi.spyOn(console, 'error');
  display.error('This is an error message');
  expect(spy).toHaveBeenCalledWith(
    chalk.bgRedBright.bold(' ERROR '),
    'This is an error message',
  );
  spy.mockRestore();
});
