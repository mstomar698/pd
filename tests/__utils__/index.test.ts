import { expect, test } from 'vitest';
import * as util from '../../src/utils';

test('file importing', () => {
  const close = util.close;
  const display = util.display;
  const exitScript = util.exitScript;
  const promise = util.promise;
  const script = util.script;
  const template = util.template;
  expect(close).toBeDefined();
  expect(display).toBeDefined();
  expect(exitScript).toBeDefined();
  expect(promise).toBeDefined();
  expect(script).toBeDefined();
  expect(template).toBeDefined();
});

test('template must have exports', () => {
  const template = util.template;
  const message = template.message;
  const helpText = template.helpText;
  const stringHelpText = template.stringHelpText;
  expect(message).toBeDefined();
  expect(helpText).toBeDefined();
  expect(stringHelpText).toBeDefined();
});
