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
function log(location, msg, color1, textColor) {
    if (color1 === void 0) { color1 = exports.color.turquoise; }
    if (textColor === void 0) { textColor = exports.color.white; }
    console.info("\u001B[".concat(color1, "m[%s] \u001B[").concat(textColor, "m%s\u001B[0m"), location, msg);
}
exports.log = log;
