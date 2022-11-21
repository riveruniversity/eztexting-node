"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sleep = exports.logStatus = exports.getTimestamp = exports.getDateTime = exports.log = exports.color = void 0;
const tslib_1 = require("tslib");
// Save log
const path_1 = tslib_1.__importDefault(require("path"));
const fs = require("fs");
exports.color = {
    'black': 30,
    'red': 31,
    'green': 32,
    'yellow': 33,
    'dark blue': 34,
    'purple': 35,
    'turquoise': 36,
    'white': 37
};
function log(location, msg, color1 = exports.color.turquoise, textColor = exports.color.white) {
    console.info(`\x1b[${color1}m[%s] \x1b[${textColor}m%s\x1b[0m`, location, msg);
}
exports.log = log;
function getDateTime() {
    const now = new Date();
    const year = now.getFullYear();
    const month = ("0" + (now.getMonth() + 1)).slice(-2);
    const day = ("0" + now.getDate()).slice(-2);
    const hour = ("0" + now.getHours()).slice(-2);
    const minute = ("0" + now.getMinutes()).slice(-2);
    const second = ("0" + now.getSeconds()).slice(-2);
    // YYYY-MM-DD hh:mm:ss
    const formatted = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    return formatted;
}
exports.getDateTime = getDateTime;
function getTimestamp(stringTime) {
    if (!stringTime)
        return ''.toString();
    const dateTime = new Date(stringTime);
    const timestamp = dateTime.getTime() / 1000;
    return timestamp.toString();
}
exports.getTimestamp = getTimestamp;
function logStatus(log) {
    return tslib_1.__awaiter(this, void 0, void 0, function* () {
        try {
            //_console.log("🗒️  logging " + log.location);
            const msg = `${getDateTime()} | ${log.status}: ${log.id ? log.id : ''} | ${log.phone ? log.phone + ' | ' : ''}${log.message} \n`;
            const file = path_1.default.resolve(process.cwd(), 'logs', `${log.location}.log`);
            fs.writeFileSync(file, msg, { flag: 'a+' }); //r w+
        }
        catch (error) {
            console.error(error);
        }
    });
}
exports.logStatus = logStatus;
function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
exports.sleep = sleep;
;
