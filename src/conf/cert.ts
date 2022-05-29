import path from 'path';

//const rootPath =  process.cwd()

export const certificate = process.env.CRT_PATH ? process.env.CRT_PATH : path.join(__dirname, 'cacert.pem');