'use strict';

const tracer = require('tracer');
const chalk = require('chalk');

module.exports = tracer.console({
    filters: {
        log: chalk.black.bgWhite,
        trace: chalk.magenta,
        debug: chalk.cyan,
        info: chalk.green,
        warn: chalk.yellow,
        error: chalk.red.bold
    },
    format: [
        "{{timestamp}} [{{title}}] [{{file}}:{{line}}] : {{message}}", //default format
        {
            error: "{{timestamp}} [{{title}}] [{{file}}:{{line}}] : {{message}} \nCall Stack:\n{{stack}}" // error format
        }
    ],
    dateformat: "HH:MM:ss.L",
    preprocess :  function(data){
        data.title = data.title.toUpperCase();
    },
    methods: ['trace', 'debug', 'info', 'warn', 'error', 'stack']
});
