/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { EZLogin, MultiCurlConf, ResponseFormat } from "../types/EZTexting";
import { MediaFileOptions } from "../types/MediaFiles";
import { Attendee } from "../rmi/Types";
export declare class MediaFilesCreate implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    format: ResponseFormat;
    login: EZLogin;
    attendees: Attendee[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor(format?: ResponseFormat);
    createMediaFile(attendee: Attendee, params: MediaFileOptions, callback?: Function): void;
    private responseHandler;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
}
