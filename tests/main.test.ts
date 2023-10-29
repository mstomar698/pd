// main.ts
import { ok } from 'assert';
import { readFileSync } from 'fs';
import { it, test } from 'vitest';
import { argChecker } from '../src/cli/argument';

test('argChecker', () => {
  it('should exist', () => {
    ok(typeof argChecker === 'function');
  });
});

test('scripting', () => {
  it('should contain expected line', () => {
    const fileContents = readFileSync('../src/main.ts', 'utf8');
    ok(fileContents.includes('#!/usr/bin/env node'));
  });
});
