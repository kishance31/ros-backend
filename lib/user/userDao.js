'use strict';

//========================== Load Modules Start =======================

//========================== Load internal modules ====================
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
            $or:[]
        };
    
        if (data.userId) {
            query.$or.push({ _id: data.userId });
        }
    
        if (data.email) {
            query.$or.push({ email: data.email });
        }
    
        if (data.username) {
            query.$or.push({ userName : data.userName });
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
        console.log("signup22222222222:::::::::", userInfo);
        const hashPassword = await appUtil.convertPass(userInfo.password);
        let user = new User(userInfo);
        user.password = hashPassword;
        return await userDao.save(user);        
    } catch (err) {
        console.log(err);
    }
};


//========================== Export Module Start ==============================

module.exports = {
    registerUser,
    checkIfExist
    // login,
    // reset_password,
    // searchUsers,
    // updateUser,
    // removeUser
};

//========================== Export Module End ===============================
