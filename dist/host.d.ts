import { RemoteShell, SshConfig as SshConfig } from './ssh.js';
export type Config = SshConfig & {
    [key: `str:${string}`]: string;
    binSymlink: string[];
    uploadDir: string;
    cleanupUseSudo: boolean;
    currentPath: string;
    defaultTimeout: string;
    deployPath: string;
    domain: string;
    env: {
        [key: string]: string;
    };
    keepReleases: number;
    monotonicallyIncreasingReleaseNames: boolean;
    nodeVersion: string;
    previousReleasePath: string;
    publicDir: string;
    releaseName: string;
    releaseOrCurrentPath: string;
    releasePath: string;
    releaseRevision: string;
    releasesList: string[];
    sharedDirs: string[];
    sharedFiles: string[];
    sudoPassword: string;
    symlinkArgs: string[];
    target: string;
    useAtomicSymlink: boolean;
    useRelativeSymlink: boolean;
    userStartedDeploy: string;
    nodePath: string;
    fnmPath: string;
    scripts: string[];
    apps: App[];
    caddyfile: string;
    static: boolean;
    fallback: string;
};
export type App = {
    name: string;
    script: string;
    args: string;
    cwd: string;
    interpreter: string;
    instances: 'max' | number;
    exec_mode: 'cluster' | null;
    env: {
        PORT: string;
        [key: string]: string;
    };
};
export type Host = {
    [key in keyof Config]: Promise<Config[key]>;
};
export declare const defaults: {
    [key in keyof Partial<Config>]: Callback<Config[key]> | Config[key];
};
export type Callback<T> = (context: Context) => Promise<T>;
export type Context = {
    config: Partial<Config>;
    host: Host;
    $: RemoteShell;
};
export type Value = number | boolean | string | string[] | {
    [key: string]: string;
};
export declare function update(host: Host, key: keyof Config, value: Value): void;
export declare function createHost(config: Partial<Config>): Context;
