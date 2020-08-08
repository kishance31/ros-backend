'use strict';

var mongoose = require("mongoose");
var promise = require("bluebird");

const User = require('./userModel');
const appUtil = require("../appUtils");

let BaseDao = new require('../dao/baseDao');
const userDao = new BaseDao(User);


// Chech if user exist
async function checkIfExist(data) {
    try {
        let query = {
            $or: []
        };
        if (data.userId) {
            query.$or.push({ _id: data.userId });
        }
        if (data.email) {
            query.$or.push({ email: data.email });
        }
        if (data.username) {
            query.$or.push({ username: data.username });
        }
        if (data.resetToken) {
            query.$or.push({ resetToken: data.resetToken, resetTokenExpiration: { $gt: Date.now() } });
        }
        return await userDao.findOne(query);
    } catch (err) {
        return err;
    }
};

// Register user
async function registerUser(userInfo) {
    try {
        const hashPassword = await appUtil.convertPass(userInfo.password);
        let user = new User(userInfo);
        user.password = hashPassword;
        return await userDao.save(user);
    } catch (err) {
        console.log(err);
    }
};

function login(loginInfo) {
    try {
        let query = {};
        query._id = loginInfo.userId;

        let update = {};
        update['$set'] = loginInfo;

        let options = {};
        options.new = true;

        return userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        console.log(err);
    }
};

// Update user
async function updateUser(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update = {};
        update['$set'] = data;

        let options = {};
        options.returnNewDocument = data.returnNewDocument;
        return await userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        return err;
    }
};

// Reset password
function reset_password(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update = {};
        update['$set'] = data;

        let options = {};
        options.returnNewDocument = data.returnNewDocument;

        return userDao.findOneAndUpdate(query, update, options);
    } catch (error) {

    }
};

//logout
function logoutUser(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update= {};
        if (data.tokens) {
            update.$pull = { tokens: data.tokens };
        }

        let options = {};
        options.returnNewDocument = data.returnNewDocument;

        return userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    registerUser,
    login,
    checkIfExist,
    reset_password,
    updateUser,
    logoutUser
};
