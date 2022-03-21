import {fewSeconds, longTimeFunc} from "./longTimeFunc.js";
import {line, log, resetTime, showResults} from "./log.js"
import clc from "cli-color";
import readline from 'readline-sync';

const firstCallDetails = {color: 'red', delay: 2, id: 'first', fail: false};
const callsDetails = (withFail = false) => [
    firstCallDetails,
    {color: 'blue', delay: 3, id: 'second', fail: withFail},
    {color: 'yellow', delay: 1, id: 'third', fail: false},
    {color: 'cyan', delay: 4, id: 'fourth', fail: withFail}
];

const processes = [
    () => {
        log('bgGreen', 'call one function');
        const {color, delay, id, fail} = firstCallDetails;
        log(color, `calling the ${clc.bold(id)} function`);
        const result = longTimeFunc(color, delay, id, fail);
        log(color, `waiting result of the ${clc.bold(id)}`);
        return result;
    },
    async () => {
        const {color, delay, id, fail} = firstCallDetails;
        log('bgGreen', 'call one function');
        log(color, `calling the ${clc.bold(id)} function`);
        const promisingResult = longTimeFunc(color, delay, id, fail);
        log(color, `waiting result of the ${clc.bold(id)}`);
        const result = await promisingResult;
        log(color, `then get the "${result}"`);
        return result;
    },
    () => {
        log('bgGreen', 'call all the functions then push each result');
        const results = [];
        callsDetails().forEach(async ({color, delay, id, fail}) => {
            log(color, `calling the ${clc.bold(id)} function`);
            const promisingResult = longTimeFunc(color, delay, id, fail);
            log(color, `waiting result of the ${clc.bold(id)}`);
            const result = await promisingResult;
            log(color, `then push the "${result}"`);
            results.push({color, result});
        });
        return results;
    },
    async () => {
        log('bgGreen', 'call all the functions then get the results after the last one will finish');
        return await Promise.all(callsDetails().map(async ({color, delay, id, fail}) => {
            log(color, `calling the ${clc.bold(id)} function`);
            const promisingResult = longTimeFunc(color, delay, id, fail);
            log(color, `waiting result of the ${clc.bold(id)}`);
            const result = await promisingResult;
            log(color, `then return the "${result}"`);
            return {color, result};
        }));
    },
    async () => await Promise.all(
        callsDetails().map(
            async ({color, delay, id, fail}) =>
                ({color, result: await longTimeFunc(color, delay, id, fail)})
        )
    ),
    async () => {
        log('bgGreen', 'call all the functions then get the results after the last one will finish');
        return await Promise.all(callsDetails().map(async ({color, delay, id, fail}) => {
            try {
                log(color, `calling the ${clc.bold(id)} function`);
                const promisingResult = longTimeFunc(color, delay, id, fail);
                log(color, `waiting result of the ${clc.bold(id)}`);
                const result = await promisingResult;
                log(color, `then return the "${result}"`);
                return {color, result: await promisingResult};
            } catch (e) {
                log(color, `then error is "${e}"`);
                return {color, result: e};
            }
        }));
    },
    async () => {
        log('bgGreen', 'call all the functions then get the results or the error after the last one will finish');
        try {
            return await Promise.all(callsDetails().map(async ({color, delay, id, fail}) => {
                log(color, `calling the ${clc.bold(id)} function`);
                const promisingResult = longTimeFunc(color, delay, id, fail);
                log(color, `waiting result of the ${clc.bold(id)}`);
                const result = await promisingResult;
                log(color, `then return the "${result}"`);
                return {color, result: await promisingResult};
            }));
        } catch (e) {
            log('bgGreen', `the global error is "${e}"`);
        }
    },
];

const labels = [
    'simple call without await',
    'simple call',
    'detailed wrong implementation',
    'detailed right implementation',
    'simplified right implementation',
    'detailed implementation with fail handled at function call level',
    'detailed implementation with fail handled at main call level'
];
for (; ;) {
    const choice = readline.keyInSelect(labels, 'Which test?');
    if (choice === -1) break;

    resetTime();
    line();
    const funcText = processes[choice].toString();
    log('magenta', funcText.replaceAll(/\s*log\(.*\);$/gm, ''));
    const results = processes[choice].toString().startsWith('async')? await processes[choice]() : processes[choice]();
    showResults(results);
    line();

    log('bgGreen', `Waiting few more seconds`);
    await fewSeconds(5)
    log('bgGreen', `after few seconds the result is`);
    showResults(results);
    line();
}
