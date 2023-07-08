import { Curl, Easy, Multi } from 'node-libcurl';
export interface EZLogin {
    User: string;
    Password: string;
}
export interface BaseCurlConf {
    baseUrl: string;
    apiUrl: string;
    login: string;
}
export interface MultiCurlConf extends BaseCurlConf {
    multi: Multi;
    handles: Easy[];
}
export interface SingleCurlConf extends BaseCurlConf {
    curl: Curl;
}
