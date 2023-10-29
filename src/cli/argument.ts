import { display, close, template, exitScript } from '../utils';
import manifest from '../../package.json';
import readline from 'readline';
import {
  args,
  console,
  filesDirectory,
  getAllAvailableFiles,
  getAllFilesByFileName,
  getArrestFile,
  getArrrestedFiles,
  getArrrestedSpecificFile,
  getCopyOfFile,
  getHelpText,
  promptForFileSelection,
  wordChecker,
} from './cli';

export const argChecker = async () => {
  if (args.length === 0) {
    console(template.message);
    display.info('To see passable arguments use --help or -h');
  } else if (args.length === 1) {
    if (args[0] === '--help' || args[0] === '-h') {
      display.log(getHelpText());
      close(0);
    } else if (args[0] === '--version' || args[0] === '-v') {
      display.log(manifest.version);
      close(0);
    } else if (
      args[0] === '--arrest' ||
      args[0] === '-a' ||
      args[0] === 'arrest' ||
      args[0] === 'store'
    ) {
      display.log('Listing all available files...');
      try {
        const availableFiles: string[] = await getAllAvailableFiles();
        if (availableFiles.length === 0) {
          display.info('No available files found.');
          close(0);
        } else {
          display.log('Available files:');
          availableFiles.forEach((file, index) => {
            display.log(`${index + 1}. ${file}`);
          });
          const selectedFileIndex: number = await promptForFileSelection(
            availableFiles.length,
          );
          if (
            selectedFileIndex >= 1 &&
            selectedFileIndex <= availableFiles.length
          ) {
            const selectedFileName = availableFiles[selectedFileIndex - 1];
            display.log(`Selected file: ${selectedFileName}`);
            const fileDetails: string = selectedFileName;
            getArrestFile(fileDetails);
          } else {
            display.log('Invalid selection. Aborting.');
          }
        }
      } catch (error: any) {
        display.error(`Error while reading files: ${error.message}`);
        close(1);
      }
    } else if (
      args[0] === '--retrieve' ||
      args[0] === '-r' ||
      args[0] === 'retrieve' ||
      args[0] === 'get'
    ) {
      display.info(`Showing all availble file for ${filesDirectory} directory`);
      getArrrestedFiles();
    } else if (args[0] === '--copy' || args[0] === '-c' || args[0] === 'copy') {
      display.log('Listing all available files...');
      try {
        const availableFiles: string[] = await getAllAvailableFiles();
        if (availableFiles.length === 0) {
          display.info('No available files found.');
          close(0);
        } else {
          display.log('Available files:');
          availableFiles.forEach((file, index) => {
            display.log(`${index + 1}. ${file}`);
          });
          const selectedFileIndex: number = await promptForFileSelection(
            availableFiles.length,
          );
          if (
            selectedFileIndex >= 1 &&
            selectedFileIndex <= availableFiles.length
          ) {
            const selectedFileName = availableFiles[selectedFileIndex - 1];
            const fileDetails: string = selectedFileName;
            getCopyOfFile(fileDetails);
          } else {
            display.log('Invalid selection. Aborting.');
          }
        }
      } catch (error: any) {
        display.error(`Error while reading files: ${error.message}`);
        close(1);
      }
    } else if (
      args[0] === '--search' ||
      args[0] === '-s' ||
      args[0] === 'find' ||
      args[0] === 'search'
    ) {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      return new Promise((resolve) => {
        rl.question(`Enter the File you are looking for:   `, (input) => {
          rl.close();
          const selection = parseInt(input);
          getAllFilesByFileName(input);
          resolve(selection);
        });
      });
    } else {
      const parsedStringArray: string[] = args[0].split(' ');
      wordChecker(parsedStringArray);
    }
  } else if (args.length === 2) {
    if (args[0] === '--arrest' || args[0] === '-a' || args[0] === 'arrest') {
      display.log('adding file to the storage...');
      try {
        const fileDetails: string = args[1];
        getArrestFile(fileDetails);
      } catch (error: any) {
        display.error(`Error while reading files: ${error.message}`);
        close(1);
      }
    } else if (
      args[0] === '--search' ||
      args[0] === '-s' ||
      args[0] === 'find' ||
      args[0] === 'search'
    ) {
      getAllFilesByFileName(args[1]);
    } else if (
      args[0] === '--retrieve' ||
      args[0] === '-r' ||
      args[0] === 'retrieve'
    ) {
      display.info(
        `Retreiving ${args[1]} file for ${filesDirectory} directory`,
      );
      getArrrestedSpecificFile(args[1], filesDirectory);
    } else if (args[0] === '--copy' || args[0] === '-c' || args[0] === 'copy') {
      display.log(`Copying file ${args[1]}...`);
      try {
        getCopyOfFile(args[1]);
      } catch (error: any) {
        display.error(`Error while reading files: ${error.message}`);
        close(1);
      }
    } else {
      display.log(args);
      const parsedStringArray: string[] = args[0].split(' ');
      wordChecker(parsedStringArray);
    }
  } else {
    display.error(
      'Invalid number of arguments or too many arguments. To see possible arguments, use --help or -h',
    );
    exitScript(1);
  }
};
