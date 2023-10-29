// Chalk-templates to diplay in console

import chalk from 'chalk';
import chalkTemplate from 'chalk-template';

const message = chalk.red('Welcome 👋 to "Private Data Storage Tool"');

const helpText = chalkTemplate`
{bold.red pdst} - CLI tool to help other tools
  {bold USAGE}
    {bold $} {red pdst} --help
    {bold $} {red pdst} --version
    {bold $} {red pdst} -a, --arrest, --store 
    {bold $} {red pdst} -c, --copy  
    {bold $} {red pdst} -r, --retrieve, --get 
    {bold $} {red pdst} -s, --search 
    
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
