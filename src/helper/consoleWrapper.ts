import chalk from "chalk";

function error(message: string) {
    return console.error(chalk.red(message));
}

function info(message: string) {
    return console.info(message);
}

function warn(message: string) {
    return console.warn(chalk.yellow(`${message}`));
}

export { error };