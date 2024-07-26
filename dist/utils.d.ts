import { RemoteShell } from './ssh.js';
export declare function isWritable(path: string): boolean;
export declare function controlPath(host: string): string;
export declare function escapeshellarg(arg: string): string;
export declare function commandSupportsOption($: RemoteShell, command: string, option: string): Promise<boolean>;
export declare function addr(host: {
    remoteUser?: string;
    hostname?: string;
}): string;
interface Result extends String {
    pid: number;
    stdout: string;
    stderr: string;
    status: number | null;
    signal: string | null;
    error?: Error;
}
type Bin = (...args: string[]) => Result;
export declare const exec: {
    [bin: string]: Bin;
};
export declare function str(pieces: TemplateStringsArray, ...args: string[]): string;
export declare function readDir(rootPath: string, dirPath?: string): string[];
export declare function secondsToHumanReadableFormat(seconds: number): string;
export declare function humanPath(...parts: string[]): string;
export declare function randomString(): string;
export declare function sleep(ms: number): Promise<void>;
export {};
