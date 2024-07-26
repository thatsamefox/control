export declare class StopError extends Error {
    explanation?: string | undefined;
    constructor(message: string, explanation?: string | undefined);
}
export declare function handleError(error: any): void;
