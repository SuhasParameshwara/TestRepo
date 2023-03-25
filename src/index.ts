
import path from 'path';

import cliArgs from 'command-line-args';


const directory = process.env.NODE_CONFIG_DIR;
process.env.NODE_CONFIG_DIR = path.join(__dirname, '../config');
console.log(process.env.NODE_CONFIG_DIR);

import { getApiHubUrl, getAPIKey } from './api/getConfig';
import BaseCommand from './commands/baseCommand';
import { load, loadGlobalHelpCommand, loadHelpCommand } from './commands/mainCommand';
import { DefaultMainArgs } from './constants';
process.env.NODE_CONFIG_DIR = directory;
// Uncomment below while running via localhost api
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export default function d360clitest(processArgs: NodeJS.Process['argv']) {
    const argsFromCli = cliArgs(DefaultMainArgs, { partial: true, argv: processArgs });
    const argsCommand = argsFromCli.command || false;
    let command = argsCommand || '';
    if (!command) {
        command = "help";
    }
    if (command == "help") {
        argsFromCli.help = true;
    }
    try {
        if (command == "help") {
            return Promise.resolve(loadGlobalHelpCommand());
        }
        let currentCommand: BaseCommand = load(command);
        if (argsFromCli.help) {
            return Promise.resolve(loadHelpCommand(currentCommand));
        }
        let currentCommandArgs = cliArgs(currentCommand.args, { argv: argsFromCli._unknown || [] });
        if (!currentCommandArgs.apiKey)
            currentCommandArgs.apiKey = getAPIKey();
        if (!currentCommandArgs.apihubUrl)
            currentCommandArgs.apihubUrl = getApiHubUrl();
        return currentCommand.run(currentCommandArgs).then((currentCommandArgs: string) => {
            return currentCommandArgs;
        });
    }
    catch (exception) {
        return Promise.reject(exception);
    }

}