import path from 'path';
import boxen from 'boxen';
import fs from 'fs';
import readline from 'readline';
import { template, display, close } from '../utils';
import type { DisplayValue } from '../types/static-types';
import axios from 'axios';

export const args: string[] = process.argv.slice(2);

export const getHelpText = (): string => template.helpText;
export const filesDirectory = process.cwd();

export function printArgs(...arg: string[]): void {
  if (arg.length > 0) {
    display.log(...arg);
  }
}

export function console(Value: DisplayValue) {
  const consoleDisplay = display.log(
    boxen(Value, {
      padding: 1,
      borderColor: 'green',
      margin: 1,
    }),
  );
  return consoleDisplay;
}
export function consoleBox(Value: DisplayValue, color: string) {
  const consoleDisplay = display.log(
    boxen(Value, {
      padding: 1,
      borderColor: color,
      margin: 1,
    }),
  );
  return consoleDisplay;
}

export const wordChecker = async (argString: string[]) => {
  for (let i = 0; i < argString.length; i++) {
    if (argString[i]?.toLowerCase() === 'help') {
      display.log(getHelpText());
    } else if (typeof argString[i] === 'string') {
      getAllFilesByFileName(argString[i]);
    } else {
      display.error(
        `The argument ${argString[i]} is not valid to see passable arguments use --help or -h`,
      );
      close(1);
    }
  }
};

export const getAllFilesByFileName = async (fileName: string) => {
  try {
    display.log('Looking for all files with the name: ', fileName);
    axios
      .post('http://localhost:8000/pd/search/', { name: fileName })
      .then(async (response) => {
        if (response.status === 200) {
          const files = response.data.files;

          if (files.length === 0) {
            display.info('No files found in the directory.');
          } else {
            files.sort(
              (a: any, b: any) =>
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime(),
            );
            display.info(`FileName     Location    Timestamp`);

            files.forEach((file: any, index: any) => {
              let time = new Date(file.timestamp);
              display.log(
                `  ${index + 1}.    ${file.name}   ${file.location}   ${time}`,
              );
            });

            const selectedFileIndex = await promptForFileSelectionInSearch(
              files.length,
            );
            if (selectedFileIndex >= 1 && selectedFileIndex <= files.length) {
              const selectedFile = files[selectedFileIndex - 1];

              const selectedFileName = selectedFile.name;
              const selectedFileLocation = selectedFile.location;

              display.info(
                `Selected file is:  ${selectedFileName} from Location: ${selectedFileLocation}`,
              );

              const retrieveFileRequest = {
                name: selectedFileName,
                location: selectedFileLocation,
              };
              const retrieveResponse = await axios.post(
                'http://localhost:8000/pd/retrieveFile/',
                retrieveFileRequest,
              );

              if (retrieveResponse.status === 200) {
                display.info(`File "${selectedFileName}" has been retrieved.`);
                const retrievedContent = retrieveResponse.data;
                const filePath = `${selectedFileLocation}/${selectedFileName}`;

                if (fs.existsSync(filePath)) {
                  const rl = readline.createInterface({
                    input: process.stdin,
                    output: process.stdout,
                  });

                  rl.question(
                    `File "${selectedFileName}" already exists. Do you want to create a copy of it? (y/n) `,
                    (answer) => {
                      if (answer.toLowerCase() === 'y') {
                        getCopyOfFile(selectedFileName);
                      } else {
                        consoleBox('File retrieval aborted.', 'red');
                      }
                      rl.close();
                    },
                  );
                } else {
                  fs.writeFile(filePath, retrievedContent, (err) => {
                    if (err) {
                      consoleBox(`Error writing file: ${err.message}`, 'red');
                    } else {
                      consoleBox(
                        `File "${selectedFileName}" has been retrieved.`,
                        'green',
                      );
                    }
                  });
                }
              } else {
                consoleBox(retrieveResponse.data.message, 'red');
              }
            } else {
              consoleBox('Invalid selection. Aborting.', 'red');
            }
          }
        }
      });
  } catch (error: any) {
    display.error(`Error sending file to the API: ${error.message}`);
  }
};

export function getCopyOfFile(fileDetails: string) {
  const sourceFilePath = path.join(filesDirectory, fileDetails);

  if (fs.existsSync(sourceFilePath)) {
    const destinationFilePath = path.join(
      filesDirectory,
      `copy_${fileDetails}`,
    );

    if (fs.existsSync(destinationFilePath)) {
      consoleBox(`A copy of ${fileDetails} already exists.`, 'yellow');
    } else {
      try {
        const fileContent = fs.readFileSync(sourceFilePath);

        fs.writeFileSync(destinationFilePath, fileContent);

        consoleBox(
          `A copy of ${fileDetails} has been created: ${destinationFilePath}`,
          'green',
        );
      } catch (error: any) {
        display.error(
          `Error while creating a copy of the file: ${error.message}`,
        );
      }
    }
  } else {
    display.error(`File not found: ${fileDetails}`);
  }
}

export function getMoveOfFile(fileDetails: string) {
  const sourceFilePath = path.join(filesDirectory, fileDetails);
  display.log('sourceFilePath', sourceFilePath, 'is ready to be moved.');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.question('Select an option:\n1. Move to Local Directory\n2. Move to Storage (delete from local)\n', (answer) => {
    switch (answer) {
      case '1':
        rl.question('Enter the path for local directory: ', (localDirectory) => {
          const destinationPath = path.join(localDirectory, fileDetails);
          moveFile(sourceFilePath, destinationPath, fileDetails);
          rl.close();
        });
        break;
      case '2':
        getArrestFileOnMove(fileDetails);
        rl.close();
        break;
      default:
        display.info('Invalid selection. Aborting.');
        rl.close();
        break;
    }
  });
}

export function moveFile(sourcePath: string, destinationPath: string, fileName: string) {
  fs.copyFile(sourcePath, destinationPath, (err) => {
    if (err) {
      display.error(`Error moving file: ${err.message}`);
    } else {
      console(`File "${fileName}" has been moved.`);
    }
  });
}

export const getStoreWholeFolder = async (folderName: string) => {
  const folderPath = path.join(filesDirectory, folderName);

  try {
    const filesInFolder = fs.readdirSync(folderPath);
    const fileData = [];
    
    for (const file of filesInFolder) {
      const filePath = path.join(folderPath, file);
      const fileContent = fs.readFileSync(filePath);
      fileData.push({
        name: file,
        content: fileContent.toString(),
      });
    }

    const folderDetails = {
      name: folderName,
      address: folderPath,
      numFiles: filesInFolder.length,
      files: fileData,
    };

    const response = await axios.post('http://localhost:8000/pd/storeFolder/', folderDetails);

    if (response.status === 201) {
      consoleBox(response.data.message, 'green');
    } else if (response.status === 200) {
      consoleBox(response.data.message, 'yellow');
    } else {
      consoleBox(response.data.message, 'red');
    }
  } catch (error: any) {
    display.error(`Error sending folder to the API: ${error.message}`);
  }
};

export function getArrestFile(fileDetails: string) {
  const sourceFilePath = path.join(filesDirectory, fileDetails);
  try {
    const fileContent = fs.readFileSync(sourceFilePath);

    const fileData = {
      name: fileDetails,
      content: fileContent.toString(),
      location: filesDirectory,
    };

    axios
      .post('http://localhost:8000/pd/storage/', fileData)
      .then((response) => {
        if (response.status === 200) {
          consoleBox(response.data.message, 'yellow');
        } else if (response.status === 201) {
          consoleBox(response.data.message, 'green');
        } else {
          consoleBox(response.data.message, 'red');
        }
      })
      .catch((error) => {
        display.error(`Error sending file to the API: ${error.message}`);
      });
  } catch (error: any) {
    console(error);
  }
}

export function getArrestFileOnMove(fileDetails: string) {
  const sourceFilePath = path.join(filesDirectory, fileDetails);
  try {
    const fileContent = fs.readFileSync(sourceFilePath);

    const fileData = {
      name: fileDetails,
      content: fileContent.toString(),
      location: filesDirectory,
    };

    axios
      .post('http://localhost:8000/pd/storage/', fileData)
      .then((response) => {
        if (response.status === 200) {
          consoleBox(response.data.message, 'yellow');
          const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
          });
          rl.question('Do you wish to create a copy in Storage? (y/n) ', (answer) => {
            switch(answer) {
              case 'y':
                const sourceFilePath = path.join(filesDirectory, fileDetails);
                try {
                  const fileContent = fs.readFileSync(sourceFilePath);

                  const fileData = {
                    name: `copy_${fileDetails}`,
                    content: fileContent.toString(),
                    location: filesDirectory,
                  };

                  axios
                    .post('http://localhost:8000/pd/storage/', fileData)
                    .then((response) => {
                      if (response.status === 200) {
                        consoleBox('Copy of selected file is already in Storage', 'yellow');
                      } else if (response.status === 201) {
                        fs.unlinkSync(sourceFilePath);
                        consoleBox(`File "${fileDetails}" has been moved to storage and deleted from the local directory.`, 'green');
                      } else {
                        consoleBox(response.data.message, 'red');
                      }
                    })
                    .catch((error) => {
                      display.error(`Error sending file to the API: ${error.message}`);
                    });
                } catch (error: any) {
                  console(error);
                }
                rl.close();
                break;
              case 'n':
                consoleBox('File move aborted', 'red')
                break;
            }
          })
        } else if (response.status === 201) {
          fs.unlinkSync(sourceFilePath);
          consoleBox(`File "${fileDetails}" has been moved to storage and deleted from the local directory.`, 'green');
        } else {
          consoleBox(response.data.message, 'red');
        }
      })
      .catch((error) => {
        display.error(`Error sending file to the API: ${error.message}`);
      });
  } catch (error: any) {
    console(error);
  }
}

export const getArrrestedFiles = async () => {
  const requestData = {
    directory: filesDirectory,
  };
  try {
    const response = await axios.post(
      'http://localhost:8000/pd/retrieve/',
      requestData,
    );
    if (response.status === 200) {
      const files = response.data.files;

      if (files.length === 0) {
        display.info('No files found in the directory.');
      } else {
        files.forEach((file: any, index: any) => {
          display.info(`${index + 1}. ${file}`);
        });

        const selectedFileIndex = await promptForFileSelection(files.length);
        if (selectedFileIndex >= 1 && selectedFileIndex <= files.length) {
          const selectedFileName = files[selectedFileIndex - 1];
          const selectedFileLocation = filesDirectory;

          const retrieveFileRequest = {
            name: selectedFileName,
            location: selectedFileLocation,
          };
          const retrieveResponse = await axios.post(
            'http://localhost:8000/pd/retrieveFile/',
            retrieveFileRequest,
          );

          if (retrieveResponse.status === 200) {
            display.info(`File "${selectedFileName}" has been retrieved.`);
            const retrievedContent = retrieveResponse.data;
            const filePath = `${selectedFileLocation}/${selectedFileName}`;

            if (fs.existsSync(filePath)) {
              const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout,
              });

              rl.question(
                `File "${selectedFileName}" already exists. Do you want to create a copy of it? (y/n) `,
                (answer) => {
                  if (answer.toLowerCase() === 'y') {
                    getCopyOfFile(selectedFileName);
                  } else {
                    consoleBox('File retrieval aborted.', 'red');
                  }
                  rl.close();
                },
              );
            } else {
              fs.writeFile(filePath, retrievedContent, (err) => {
                if (err) {
                  consoleBox(`Error writing file: ${err.message}`, 'red');
                } else {
                  consoleBox(
                    `File "${selectedFileName}" has been retrieved.`,
                    'green',
                  );
                }
              });
            }
          } else {
            consoleBox(retrieveResponse.data.message, 'red');
          }
        } else {
          consoleBox('Invalid selection. Aborting.', 'red');
        }
      }
    } else {
      consoleBox(response.data.message, 'red');
    }
  } catch (error: any) {
    display.error(`Error sending file to the API: ${error.message}`);
  }
};

export const getArrrestedSpecificFile = async (
  fileName: string,
  fileLocation: string,
) => {
  try {
    const retrieveFileRequest = {
      name: fileName,
      location: fileLocation,
    };
    const retrieveResponse = await axios.post(
      'http://localhost:8000/pd/retrieveFile/',
      retrieveFileRequest,
    );

    if (retrieveResponse.status === 200) {
      display.info(`File "${fileName}" has been retrieved.`);
      const retrievedContent = retrieveResponse.data;
      const filePath = `${fileLocation}/${fileName}`;

      if (fs.existsSync(filePath)) {
        const rl = readline.createInterface({
          input: process.stdin,
          output: process.stdout,
        });

        rl.question(
          `File "${fileName}" already exists. Do you want to create a copy of it? (y/n) `,
          (answer) => {
            if (answer.toLowerCase() === 'y') {
              getCopyOfFile(fileName);
            } else {
              consoleBox('File retrieval aborted.', 'red');
            }
            rl.close();
          },
        );
      } else {
        fs.writeFile(filePath, retrievedContent, (err) => {
          if (err) {
            consoleBox(`Error writing file: ${err.message}`, 'red');
          } else {
            consoleBox(`File "${fileName}" has been retrieved.`, 'green');
          }
        });
      }
    } else {
      consoleBox(retrieveResponse.data.message, 'red');
    }
  } catch (error: any) {
    display.error(`Error retreiving file from Storage: ${error.message}`);
  }
};

export async function getAllAvailableFiles(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(filesDirectory, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const availableFiles = files.filter((file) =>
          fs.statSync(`${filesDirectory}/${file}`).isFile(),
        );
        resolve(availableFiles);
      }
    });
  });
}

export async function getAllAvailableFolders(): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.readdir(filesDirectory, (error, files) => {
      if (error) {
        reject(error);
      } else {
        const availableFolders = files.filter((file) =>
          fs.statSync(path.join(filesDirectory, file)).isDirectory()
        );
        resolve(availableFolders);
      }
    });
  });
}

export async function promptForFileSelection(
  maxSelection: number,
): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Select a file (1-${maxSelection}): `, (input) => {
      rl.close();
      const selection = parseInt(input);
      resolve(selection);
    });
  });
}

export async function promptForFileSelectionInSearch(
  maxSelection: number,
): Promise<number> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(`Select a file (1-${maxSelection}): `, (input) => {
      rl.close();
      const selection = parseInt(input);
      resolve(selection);
    });
  });
}
