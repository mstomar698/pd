// code exiting the cli

import { exit } from 'shelljs';
import { console } from '../cli/cli';
import { display } from './display';

export function close(exitCode: number) {
  if (exitCode === 0) {
    display.info('Gracefully shutting down. Please wait...');
    exit(1);
  } else {
    display.warn('Force-closing...');
    exit(0);
  }
}

export function exitScript(exitCode: number) {
  if (exitCode === 0) {
    console('Script executed successfully! 🎉');
    exit(1);
  } else {
    console('Script ran into some issue 😥');
    exit(0);
  }
}
