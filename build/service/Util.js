"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.log = exports.color = void 0;
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
function log(location, msg, color) {
    console.info("\u001B[".concat(color, "m[%s] \u001B[36m%s\u001B[0m"), location, msg);
}
exports.log = log;
