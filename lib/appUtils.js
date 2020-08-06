'use strict';

var sha256 = require('sha256');
var promise  = require('bluebird');
var bcrypt = require('bcryptjs');


function getNodeEnv() {
    return process.env.NODE_ENV;
}

function isValidEmail(email) {
    var pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
    return new RegExp(pattern).test(email);
}

function createHashSHA256(pass) {
    return sha256(pass);
}

var getRandomPassword = function () {
    return getSHA256(Math.floor((Math.random() * 1000000000000) + 1));
};

var getSHA256 = function (val) {
    return sha256(val + "password");
};

function generateSaltAndHashForPassword(password) {
    return bcrypt.hash(password, 10);
}

async function convertPass(password) {
    try {
        return await bcrypt.hash(password, 10);        
    } catch (err) {
        return err;
    }
}

async function verifyPassword(user, isExist) {
    return await bcrypt.compare(user.password, isExist.password);
};

async function verifyRole(query, isExist) {
    return query.role === isExist.role ? true : false;
};

module.exports = {
    getNodeEnv,
    verifyPassword,
    isValidEmail,
    createHashSHA256,
    getRandomPassword,
    generateSaltAndHashForPassword,
    convertPass,
    verifyRole
};
