import { expect, test } from 'vitest';
import { display, close, template, exitScript } from '../../src/utils';
import {
  args,
  console,
  getHelpText,
  getStringHelpText,
  printArgs,
  script,
  wordChecker,
} from '../../src/cli/cli';
import { argChecker } from '../../src/cli/argument';

test('arguments must have exports', () => {
  expect(argChecker).toBeDefined();
});

test('arguments must have imports', () => {
  expect(args).toBeDefined();
  expect(console).toBeDefined();
  expect(getHelpText).toBeDefined();
  expect(getStringHelpText).toBeDefined();
  expect(script).toBeDefined();
  expect(printArgs).toBeDefined();
  expect(wordChecker).toBeDefined();
  expect(display).toBeDefined();
  expect(close).toBeDefined();
  expect(template).toBeDefined();
  expect(exitScript).toBeDefined();
});
