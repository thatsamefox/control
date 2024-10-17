import { secondsToHumanReadableFormat } from './utils.js';
import { currentlyRunningTask } from './task.js';
import process from 'node:process';
import chalk from 'chalk';
let spinner;
let startedAt;
let status = '';
let disable = false;
export function progressMessage(message) {
    status = remoteNonAscii(getLastNonEmptyLine(message));
    if (/investigate|error/i.test(status)) {
        status = 'compiling...';
    }
}
export function disableSpinner() {
    disable = true;
}
export function startSpinner() {
    if (disable)
        return;
    startedAt = new Date();
    continueSpinner();
}
export function continueSpinner() {
    if (disable)
        return;
    startedAt = startedAt || new Date();
    let s = 0;
    const spin = () => {
        const time = secondsToHumanReadableFormat((new Date().getTime() - startedAt.getTime()) / 1000);
        const display = `  ${'⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'[s++ % 10]} ${time} → ${currentlyRunningTask} `;
        const log = status.substring(0, width(display)).toLowerCase();
        process.stderr.write(`${display}${chalk.grey(log)}${' '.repeat(width(display, log))}\r`);
    };
    spinner = setInterval(spin, 100);
}
export function stopSpinner() {
    if (disable)
        return;
    clearInterval(spinner);
    process.stderr.write(' '.repeat(process.stderr.columns - 1) + '\r');
}
function getLastNonEmptyLine(text) {
    const lines = text.split('\n');
    for (let i = lines.length - 1; i >= 0; i--) {
        const line = lines[i].trim();
        if (line !== '') {
            return line;
        }
    }
    return '';
}
function width(...xs) {
    return Math.max(0, process.stderr.columns - 1 - xs.reduce((a, b) => a + b.length, 0));
}
function remoteNonAscii(text) {
    return text.replace(/[^\x00-\x7F]/g, '');
}
