// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable no-console */
import chalk from 'chalk';

interface Display {
  info: (...message: string[]) => void;
  warn: (...message: string[]) => void;
  error: (...message: string[]) => void;
  log: typeof console.log;
}

const info: Display['info'] = (...message: string[]) => {
  console.info(chalk.cyanBright.bold(' INFO |'), ...message);
};

const warn: Display['warn'] = (...message: string[]) => {
  console.warn(chalk.bgYellowBright.bold(' WARN |'), ...message);
};

const error: Display['error'] = (...message: string[]) => {
  console.error(chalk.bgRedBright.bold(' ERROR |'), ...message);
};

const log: Display['log'] = console.log;

export const display: Display = { info, warn, error, log };
