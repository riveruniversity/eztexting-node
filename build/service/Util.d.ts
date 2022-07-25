export declare const color: {
    black: number;
    red: number;
    green: number;
    yellow: number;
    'dark blue': number;
    purple: number;
    turquoise: number;
    white: number;
};
export declare function log(location: string, msg: any, color1?: number, textColor?: number): void;
export declare function getDateTime(): string;
export declare function getTimestamp(stringTime: string | undefined): string;
export interface Log {
    location: string;
    status: 'Error' | 'Success' | 'Curl Error' | 'Log';
    message: string;
    phone?: string;
    params?: object;
}
export declare function logStatus(log: Log): Promise<void>;
export declare function sleep(milliseconds: number): Promise<unknown>;
