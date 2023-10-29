// Chalk-templates to diplay in console

import chalk from 'chalk';
import chalkTemplate from 'chalk-template';

const message = chalk.red('Welcome 👋 to "Private Data"');

const helpText = chalkTemplate`
{bold.red pd} - CLI tool to help other tools
  {bold USAGE}
    {bold $} {red pd} --help
    {bold $} {red pd} --version
    {bold $} {red pd} -a, --arrest, --store 
    {bold $} {red pd} -c, --copy  
    {bold $} {red pd} -r, --retrieve, --get 
    {bold $} {red pd} -s, --search 
    
  {bold OPTIONS}
    -h, --help                          Shows this help message
    -v, --version                       Shows the version of the tool 
    -a, --arrest, --store               store a file in Storage
    -c, --copy                          copy a file local to current directory
    -r, --retrieve, --get               retrieve a file from Storage
    -s, --search, find                  search for a file in Storage
    <File Name>                         all files with same name will be listed
    -a <File Name>                      all files within the same directory will be listed
    -r <File Name>                      retrieve a file from Storage                             
`;

export const template = { message, helpText };
