import clc from "cli-color";

let refTime = Date.now();

export const resetTime = () => {
    refTime = Date.now();
}

export const log = (color, msg, offset = '') => {
    const time = Date.now() - refTime;
    const timeText = time < 1000 ? `${time}ms` : `${Math.round(time / 100) / 10}s`;
    console.log(clc[color](`${clc.italic(`${timeText} :`)} ${clc.bgWhite(offset)}${msg}`));
};

export const line = () =>
    console.log(clc.bgWhite('                                                                                                           |'));

export const showResults = results => {
    if (!results) {
        console.log(clc.bgGreen('No result'));
    } else if (Array.isArray(results)) {
        const concat = results.map(({color, result}) => clc[color](`'${result}'`)).join(', ') || 'empty';
        console.log(clc.bgGreen('Results: [') + concat + clc.bgGreen(']'));
    } else {
        console.log(clc.bgGreen('Result is: "["') + results + clc.bgGreen('"]"'));
    }
}
