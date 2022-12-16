// Dependencies
import dotenv from 'dotenv';

// Modules
import { certificate } from "../conf/cert";


export function checkLoginInfo() {
	
	if (!process.env.USR || !process.env.PASS)
		throw new Error("Missing parameter: 'Username' or 'Password'! Please add environment variables.");

	return { User: process.env.USR, Password: process.env.PASS };
}


export function getCertificate() {
    if(process.env.CRT_PATH) return process.env.CRT_PATH
    else return certificate
}

export function initDotenv () {
    dotenv.config();
}