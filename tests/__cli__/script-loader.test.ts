import * as path from 'path';
import * as readline from 'readline';
import { execSync } from 'child_process';
import fs, { writeFileSync } from 'fs';
import { expect, test } from 'vitest';
import { close, display, exitScript } from '../../src/utils';
import {
  git,
  gitBranch,
  gitDefaultBranchCommit,
  gitDefaultCommit,
  gitDefaultPush,
  mern,
  mernTailwind,
  react,
  reactTailwind,
  next,
  nextTaiwind,
  tailwind,
  webpack,
} from '../../src/cli/script-loader';

test('script-loader must have exports', () => {
  expect(git).toBeDefined();
  expect(gitBranch).toBeDefined();
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
});

test('script-loader must have imports', () => {
  expect(close).toBeDefined();
  expect(display).toBeDefined();
  expect(exitScript).toBeDefined();
  expect(readline).toBeDefined();
  expect(fs).toBeDefined();
  expect(path).toBeDefined();
  expect(execSync).toBeDefined();
  expect(writeFileSync).toBeDefined();
});
