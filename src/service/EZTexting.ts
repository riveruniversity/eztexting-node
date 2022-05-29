// Dependencies
import dotenv from 'dotenv';

// Modules
import { certificate } from "../conf/cert";


export function getTimestamp (stringTime: string | undefined) {

    if(!stringTime) return ''.toString();
    
    const dateTime = new Date(stringTime);
    const timestamp = dateTime.getTime() / 1000;
    console.log(timestamp)
    return timestamp.toString();
}

export function checkLoginInfo() {
	
	if (!process.env.USR || !process.env.PWD)
		throw new Error("Missing parameter: 'Username' or 'Password'! Please add environment variables.");

	return { User: process.env.USR, Password: process.env.PWD };
}


export function getCertificate() {
    if(process.env.CRT_PATH) return process.env.CRT_PATH
    else return certificate
}

export function initDotenv () {
    dotenv.config();
}