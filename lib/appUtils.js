'use strict';

var sha256 = require('sha256');
var promise = require('bluebird');
var bcrypt = require('bcryptjs');
const { customAlphabet } = require('nanoid/async');
const numberNanoId = customAlphabet('1234567890', 12);
var cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: "dljkawvlg",
    api_key: "228612331659815",
    api_secret: "kbXvRMrdv4UV9NCbqcX29_m8zJI",
});



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

// generate a 9-digit random number id
async function generateNumberNanoId(number) {
    if(!number) {
        return await numberNanoId();
    }
    return await Promise.all(Array.from(Array(number).keys()).map(() => numberNanoId()));
};

function streamUploadToCloudinary(imageBuffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((err, result) => {
            if(result) {
                resolve(result.secure_url);
            } else {
                reject(err.message);
            }
        }).end(imageBuffer);
    });
}

module.exports = {
    getNodeEnv,
    verifyPassword,
    isValidEmail,
    createHashSHA256,
    getRandomPassword,
    generateSaltAndHashForPassword,
    convertPass,
    verifyRole,
    generateNumberNanoId,
    streamUploadToCloudinary
};
