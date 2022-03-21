import clc from "cli-color"
import {log} from "./log.js"

const OFFSET = '  ';
export const fewSeconds = delay => new Promise((resolve, reject) => setTimeout(() =>
    resolve(), delay * 1000));

export const longTimeFunc = async (color, delay, id, fail = false) => {
    log(color, `${clc.bold(id)} will ${!fail ? 'success' : 'fail'} in ${clc.bold(delay)}s`, OFFSET);
    await fewSeconds(delay)
    log(color, `${clc.bold(id)} finishes its task`, OFFSET);
    if (fail) {
        throw `the call of ${clc.bold(id)} failed`;
    }
    return `the call of ${clc.bold(id)} succeed`;
};
