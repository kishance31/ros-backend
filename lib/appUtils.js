'use strict';

var sha256 = require('sha256');
var bcrypt = require('bcryptjs');
const { customAlphabet } = require('nanoid/async');
const numberNanoId = customAlphabet('1234567890', 12);
const fs = require('fs');
const {cfg} = require('../lib/config') 
var cloudinary = require("cloudinary").v2;
cloudinary.config({
    cloud_name: 'ncc-corporation-inc',
    api_key: '842737327941694',
    api_secret: 'Po-e6X_oq7iX70r9fqfVP4lsTOI'
})


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
    if (!number) {
        return await numberNanoId();
    }
    return await Promise.all(Array.from(Array(number).keys()).map(() => numberNanoId()));
};

function streamUploadToCloudinary(imageBuffer) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((err, result) => {
            if (result) {
                resolve(result.secure_url);
            } else {
                reject(err.message);
            }
        }).end(imageBuffer);
    });
}

function generateRandomId(count = 12) {
    let characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    let charactersLength = characters.length;
    for (let j = 0; j < count; j++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function writeFilesAsync(input, dir) {
    // let rs = fs.createReadStream(input.data);
    let resolvePath = `${dir}/${generateRandomId(12)}_${input.name}`;
    let outpath = `public/${resolvePath}`;
    let finalUrl = `${cfg.serverUrl}/static/${resolvePath}`
    return new Promise((resolve, reject) => {
        fs.writeFile(outpath, input.data, (err) => {
            if (err) {
                console.log(err);
                reject();
            }
            else {
                resolve(finalUrl);
            }
        })
    })
    // let ws = fs.createWriteStream(outpath)
    // return new Promise((resolve, reject) => {
    //     ws.on('error', reject);
    //     // rs.on('error', reject);
    //     input.data.pipe(ws)
    //         .on('close', () => resolve(resolvePath));
    // })
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
    streamUploadToCloudinary,
    writeFilesAsync
};
