const morgan = require('morgan');
const chalk = require('chalk');

module.exports = morgan((tokens, req, res) => {
    return [
        '\n',
        chalk.hex('#228B22').bold(tokens.method(req, res)),
        chalk.hex('#FF6347').bold(tokens.url(req, res)),
        chalk.hex('#228B22').bold(tokens.status(req, res)),
        chalk.hex('#FF4500').bold(tokens['response-time'](req, res) + ' ms'),
        chalk.hex('#FF00FF').bold(tokens.date(req, res)),
        '\n'
    ].join(" ");
})