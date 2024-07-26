export declare function skipPrompts(yes: boolean): void;
export declare function ask(message: string, defaultValue?: string): Promise<string>;
export declare function confirm(message: string, defaultValue?: boolean): Promise<boolean>;
export declare function choose(message: string, choices: string[]): Promise<string>;
