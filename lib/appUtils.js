'use strict';

//========================== Load Modules Start ===========================

//========================== Load External Module =========================

var sha256 = require('sha256');
var promise  = require('bluebird');
var bcrypt = require('bcryptjs');
var randomstring = require("randomstring");
//========================== Load Modules End =============================

//========================== Export Module Start ===========================


/**
 * return user home
 * @returns {*}
 */
function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

function getNodeEnv() {
    return process.env.NODE_ENV;
}

/**
 * returns if email is valid or not
 * @returns {boolean}
 */
function isValidEmail(email) {
    var pattern = /(([a-zA-Z0-9\-?\.?]+)@(([a-zA-Z0-9\-_]+\.)+)([a-z]{2,3}))+$/;
    return new RegExp(pattern).test(email);
}

/**
 * returns if zipCode is valid or not (for US only)
 * @returns {boolean}
 */
/*function isValidPhoneNumber(num) {
 if (Number.isInteger(num)) {
 num = num.toString();
 }
 if (phoneNumber.indexOf("+") > -1)
 return new RegExp(pattern).test(zipcode);
 }*/

function createHashSHA256(pass) {
    return sha256(pass);
}

/**
 * returns random number for password
 * @returns {string}
 */
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
    // If role match then return true, if not then false
    return query.role === isExist.role ? true : false;
};



//========================== Export Module Start ===========================

module.exports = {
    getUserHome, 
    getNodeEnv,
    verifyPassword,
    isValidEmail,
    createHashSHA256,
    getRandomPassword,
    generateSaltAndHashForPassword,
    convertPass,
    verifyRole
};

//========================== Export Module End===========================
