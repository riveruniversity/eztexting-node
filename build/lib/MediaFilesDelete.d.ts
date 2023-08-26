/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { MultiCurlConf } from "../types/EZTexting";
import { Message, MessageWithFile } from "../types/Messages";
export declare class MediaFilesDelete implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: string;
    verbose: boolean;
    messages: Message[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    waitBeforeClose: number;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor(verbose?: boolean);
    deleteMediaFile(message: MessageWithFile, callback?: Function): void;
    private responseHandler;
    private setCurlOptions;
    private onDataHandler;
}
