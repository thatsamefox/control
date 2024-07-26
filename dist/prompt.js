import inquirer from 'inquirer';
import { continueSpinner, stopSpinner } from './spinner.js';
let skip = false;
export function skipPrompts(yes) {
    skip = yes;
}
export async function ask(message, defaultValue) {
    if (skip)
        return defaultValue ?? '';
    stopSpinner();
    const answers = await inquirer.prompt({
        name: 'out',
        type: 'input',
        message,
        default: defaultValue,
    });
    continueSpinner();
    return answers.out;
}
export async function confirm(message, defaultValue = true) {
    if (skip)
        return defaultValue;
    stopSpinner();
    const answers = await inquirer.prompt({
        name: 'out',
        type: 'confirm',
        message,
        default: defaultValue,
    });
    continueSpinner();
    return answers.out;
}
export async function choose(message, choices) {
    if (skip)
        return '';
    stopSpinner();
    const answers = await inquirer.prompt({
        name: 'out',
        type: 'list',
        message,
        choices,
        default: choices[0],
    });
    continueSpinner();
    return answers.out;
}
//# sourceMappingURL=prompt.js.map