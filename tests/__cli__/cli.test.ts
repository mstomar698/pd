import { expect, test } from 'vitest';
import shell from 'shelljs';
import boxen from 'boxen';
import {
  args,
  getHelpText,
  getStringHelpText,
  script,
  printArgs,
  console,
  wordChecker,
} from '../../src/cli/cli';
import {
  git,
  gitDefaultBranchCommit,
  gitDefaultCommit,
  gitDefaultPush,
  mern,
  mernTailwind,
  next,
  nextTaiwind,
  react,
  reactTailwind,
  tailwind,
  webpack,
} from '../../src/cli/script-loader';
import { template, display, exitScript } from '../../src/utils';

test('cli must have exports', () => {
  expect(args).toBeDefined();
  expect(getHelpText).toBeDefined();
  expect(getStringHelpText).toBeDefined();
  expect(script).toBeDefined();
  expect(printArgs).toBeDefined();
  expect(console).toBeDefined();
  expect(wordChecker).toBeDefined();
});
test('cli must have imports', () => {
  expect(shell).toBeDefined();
  expect(boxen).toBeDefined();
  expect(git).toBeDefined();
  expect(gitDefaultBranchCommit).toBeDefined();
  expect(gitDefaultCommit).toBeDefined();
  expect(gitDefaultPush).toBeDefined();
  expect(mern).toBeDefined();
  expect(mernTailwind).toBeDefined();
  expect(next).toBeDefined();
  expect(nextTaiwind).toBeDefined();
  expect(react).toBeDefined();
  expect(reactTailwind).toBeDefined();
  expect(tailwind).toBeDefined();
  expect(webpack).toBeDefined();
  expect(template).toBeDefined();
  expect(display).toBeDefined();
  expect(exitScript).toBeDefined();
});
