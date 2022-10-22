// Dependencies
import { Curl, Easy, Multi, CurlOptionName, CurlOptionValueType } from 'node-libcurl';

export interface EZLogin {
    User: string;
    Password: string;
}


export interface BaseCurlConf {
	baseUrl: string;
    apiUrl: string;
	login: EZLogin;
    format: ResponseFormat;
}

export interface MultiCurlConf extends BaseCurlConf {
    multi: Multi;
    handles: Easy [];
}

export interface SingleCurlConf extends BaseCurlConf {
    curl: Curl;
}

export type ResponseFormat = 'json' | 'xml';