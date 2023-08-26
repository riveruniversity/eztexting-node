/// <reference types="node" />
import { Easy, Multi } from "node-libcurl";
import { MultiCurlConf } from "../types/EZTexting";
import { Contact } from "../types/Contacts";
export declare class MediaFilesCreate implements MultiCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: string;
    verbose: boolean;
    contacts: Contact[];
    multi: Multi;
    handles: Easy[];
    handlesData: Buffer[] | any;
    waitBeforeClose: number;
    finished: number;
    callbacks: Function[];
    callback: boolean;
    constructor(verbose?: boolean);
    createMediaFile(contact: Contact, url: string, callback?: Function): void;
    private responseHandler;
    private setCurlOptions;
    private onDataHandler;
    private createPostData;
    get activeHandles(): number;
}
