// Dependencies
import { Curl, Easy, Multi, CurlOptionName, CurlOptionValueType } from 'node-libcurl';

export interface CurlConf {
	baseUrl: string;
    apiUrl: string;
    multi: Multi;
    handles: Easy [];
	login: EZLogin;
}


export interface EZLogin {
    User: string;
    Password: string;
}