/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { MultiCurlConf } from "../types/EZTexting";
import { Message, MessageWithFile } from "../types/Messages";
export declare class MediaFilesDelete implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: string;
    messages: Message[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor();
    deleteMediaFile(message: MessageWithFile, callback?: Function): void;
    private responseHandler;
    private setCurlOptions;
    private onDataHandler;
}
