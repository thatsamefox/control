import { Callback, Context } from './host.js';
export declare class Task {
    name: string;
    callback?: Callback<void>;
    group?: string[];
    become?: string;
    constructor(name: string, callback: Callback<void> | string[]);
    as(name: string): void;
}
export declare const allTasks: Map<string, Task>;
export declare function task(name: string, callback: Callback<void> | string[]): Task;
export declare let currentlyRunningTask: string;
export declare function runTask(taskName: string, context: Context): Promise<void>;
