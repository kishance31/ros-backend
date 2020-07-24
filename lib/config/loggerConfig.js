'use strict';

const winston = require('winston');
const path = require('path');
const { format } = winston;

//
// Logger levels & colors
//
const config = {
    levels: {
        error: 0,
        debug: 1,
        warn: 2,
        data: 3,
        info: 4,
    },
    colors: {
        error: 'red',
        debug: 'blue',
        warn: 'yellow',
        data: 'grey',
        info: 'green',
    }
};

module.exports = winston.createLogger({
    levels: config.levels,
    transports: [new winston.transports.Console({ handleExceptions: true })],
    format: format.combine(
        format.label({ label: path.basename(process.mainModule.filename) }),
        format.colorize(),
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.printf(info => `[${info.timestamp}] ${info.level}: [${info.label}] : ${info.message}`),
        format.errors({ stack: true }),
        format.splat(),
    )
});