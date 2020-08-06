'use strict';

class Exceptions {
    constructor(errorCode, msg, errStackTrace) {
        this.errorCode = errorCode;
        this.message = msg;
        if (errStackTrace) {
            this.errors = errStackTrace;
        }
    }
}

module.exports = Exceptions;
