import { spawn, spawnSync } from 'node:child_process';
import process from 'node:process';
import { addr, controlPath, escapeshellarg } from './utils.js';
import chalk from 'chalk';
import { progressMessage } from './spinner.js';
export function ssh(partial) {
    const config = {
        remoteUser: partial.remoteUser ?? 'root',
        hostname: partial.hostname ?? 'localhost',
        port: partial.port,
        shell: partial.shell ?? 'bash -s',
        prefix: partial.prefix ?? 'set -euo pipefail; ',
        cwd: partial.cwd,
        nothrow: partial.nothrow ?? false,
        multiplexing: partial.multiplexing ?? true,
        verbose: partial.verbose ?? false,
        become: partial.become,
        env: partial.env ?? {},
        ssh: partial.ssh ?? {},
    };
    const $ = async function (pieces, ...values) {
        const location = new Error().stack.split(/^\s*at\s/m)[2].trim();
        const debug = process.env['WEBPOD_DEBUG'] ?? '';
        if (pieces.some(p => p == undefined)) {
            throw new Error(`Malformed command at ${location}`);
        }
        let resolve, reject;
        const promise = new Promise((...args) => ([resolve, reject] = args));
        const args = sshArgs(config);
        const id = 'id$' + Math.random().toString(36).slice(2);
        args.push(`: ${id}; ` +
            (config.become ? `sudo -H -u ${escapeshellarg(config.become)} ` : '') +
            env(config.env) +
            config.shell);
        const cmd = await composeCmd(pieces, values);
        const cmdFull = config.prefix + workingDir(config.cwd) + cmd;
        if (debug !== '') {
            if (debug.includes('ssh'))
                args.unshift('-vvv');
            console.error(chalk.grey(`ssh ${args.map(escapeshellarg).join(' ')} <<< ${escapeshellarg(cmdFull)}`));
        }
        if (config.verbose) {
            console.error(`${chalk.green.bold(`${config.become ?? config.remoteUser}@${config.hostname}`)}${chalk.magenta.bold(`:${config.cwd ?? ''}`)}${chalk.bold.blue(`$`)} ${chalk.bold(cmd)}`);
        }
        const child = spawn('ssh', args, {
            stdio: ['pipe', 'pipe', 'pipe'],
            windowsHide: true,
        });
        let stdout = '', stderr = '';
        child.stdout.on('data', data => {
            if (config.verbose)
                process.stdout.write(data);
            stdout += data;
            progressMessage(data.toString());
        });
        child.stderr.on('data', data => {
            if (debug.includes('ssh') && /^debug\d:/.test(data)) {
                process.stderr.write(data);
                return;
            }
            if (config.verbose)
                process.stderr.write(data);
            stderr += data;
            progressMessage(data.toString());
        });
        child.on('close', (code) => {
            if (code === 0 || config.nothrow)
                resolve(new Response(cmd, location, code, stdout, stderr));
            else
                reject(new Response(cmd, location, code, stdout, stderr));
        });
        child.on('error', err => {
            reject(new Response(cmd, location, null, stdout, stderr, err));
        });
        child.stdin.write(cmdFull);
        child.stdin.end();
        return promise;
    };
    $.with = (override) => ssh({
        ...config, ...override,
        ssh: { ...config.ssh, ...override.ssh ?? {} }
    });
    $.exit = () => spawnSync('ssh', [addr(config),
        '-o', `ControlPath=${controlPath(addr(config))}`,
        '-O', 'exit',
    ]);
    $.check = () => spawnSync('ssh', [addr(config),
        '-o', `ControlPath=${controlPath(addr(config))}`,
        '-O', 'check',
    ]).status == 0;
    $.test = async (pieces, ...values) => {
        try {
            await $(pieces, ...values);
            return true;
        }
        catch {
            return false;
        }
    };
    $.cd = (path) => {
        config.cwd = path;
    };
    return $;
}
export function sshArgs(config) {
    let options = {
        ControlMaster: 'auto',
        ControlPath: controlPath(addr(config)),
        ControlPersist: '5m',
        ConnectTimeout: '5s',
        StrictHostKeyChecking: 'accept-new',
    };
    if (config.port != undefined) {
        options.Port = config.port.toString();
    }
    if (config.multiplexing === false) {
        delete options.ControlMaster;
        delete options.ControlPath;
        delete options.ControlPersist;
    }
    options = { ...options, ...config.ssh };
    return [
        addr(config),
        ...Object.entries(options).flatMap(([key, value]) => ['-o', `${key}=${value}`]),
    ];
}
function workingDir(cwd) {
    if (cwd == undefined || cwd == '') {
        return ``;
    }
    return `cd ${escapeshellarg(cwd)}; `;
}
function env(env) {
    return Object.entries(env)
        .map(([key, value]) => {
        if (key.endsWith('++')) {
            return `${key.replace(/\++$/, '')}=$PATH:${escapeshellarg(value)} `;
        }
        else {
            return `${key}=${escapeshellarg(value)} `;
        }
    })
        .join('');
}
export class Response extends String {
    command;
    location;
    exitCode;
    stdout;
    stderr;
    error;
    constructor(command, location, exitCode, stdout, stderr, error) {
        super(stdout.trim());
        this.command = command;
        this.location = location;
        this.exitCode = exitCode;
        this.stdout = stdout;
        this.stderr = stderr;
        this.error = error;
    }
}
export async function composeCmd(pieces, values) {
    let cmd = pieces[0], i = 0;
    while (i < values.length) {
        const v = await values[i];
        let s = '';
        if (Array.isArray(v)) {
            s = v.map(escapeshellarg).join(' ');
        }
        else {
            s = escapeshellarg(v.toString());
        }
        cmd += s + pieces[++i];
    }
    return cmd;
}
