export const color = {
    'black': 30,
    'red': 31,
    'green': 32,
    'yellow': 33,
    'dark blue': 34,
    'purple': 35,
    'turquoise': 36,
    'white': 37
}

export function log(location: string, msg: string | any, color: number) {

    console.info(`\x1b[${color}m[%s] \x1b[36m%s\x1b[0m`, location, msg);
}