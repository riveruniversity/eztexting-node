/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { MultiCurlConf } from "../types/EZTexting";
import { MediaFileOptions } from "../types/MediaFiles";
import { Contact } from "../types/Contacts";
export declare class MediaFilesCreate implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: string;
    contacts: Contact[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor();
    createMediaFile(attendee: Contact, params: MediaFileOptions, callback?: Function): void;
    private responseHandler;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
}
