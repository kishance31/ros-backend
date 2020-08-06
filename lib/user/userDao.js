'use strict';

var mongoose = require("mongoose");
var promise = require("bluebird");

// var _ = require("lodash");
//========================== Load internal modules ====================
const User = require('./userModel');
const appUtil = require("../appUtils");

// init user dao
let BaseDao = new require('../dao/baseDao');
const userDao = new BaseDao(User);

//========================== Load Modules End ==============================================

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

// Update user
async function updateUser(data) {
    try {
        let query = {};
        if (data.userId) {
            query._id = data.userId;
        }
        if (data.email) {
            query.email = data.email;
        }
        let update = {};
        // For adding tokens in database during login api
        if (data.resetToken) {
            update.tokens = data.resetToken;
            update.resetTokenExpiration = data.resetTokenExpiration;
        }
        // For removing token from database during logout api
        if (data.token) {
            update.$pull = { tokens: data.token };
        }
        if (data.resetToken && data.resetTokenExpiration) {
            update.resetToken = data.resetToken;
            update.resetTokenExpiration = data.resetTokenExpiration,
            update.resetTokenIsUsed = data.resetTokenIsUsed
        }
        if (data.hashPassword) {
            update.password = data.hashPassword;
            update.resetTokenIsUsed = data.resetTokenIsUsed
        }
        if (data.firstName) {
            update.firstName = data.firstName;
        }
        if (data.lastName) {
            update.lastName = data.lastName;
        }
        if (data.officeContactNo) {
            update.officeContactNo = data.officeContactNo;
        }

        let options = {};
        options.returnNewDocument = data.returnNewDocument;
        options.returnOriginal = false;
        return await userDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        return err;
    }
};

// Reset password
function reset_password(email, new_password) {
    let query = {};
    query.email = email;
    let update = {};
    update.password = new_password;

    return userDao.findOneAndUpdate(query, update);
};

module.exports = {
    registerUser,
    checkIfExist,
    reset_password,
    updateUser,
    // removeUser
};
