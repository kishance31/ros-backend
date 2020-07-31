'use strict';

const promise = require("bluebird");
const jwtHandler = require('../jwtHandler');
const AppUtil   = require('../appUtils');
const customExceptions = require('../customException');
const userMapper = require('./userMapper');
const userService = require("./userService");
const usrRoutr = require("./userRoute");

// Signup
async function signup(signupInfo){
    console.log("signupdatafacade:::::::::::", signupInfo);
    try {
        const result = await userService.signupUser(signupInfo);
        if (result) {
            return result;
        }        
    } catch (err) {
        return err;
    }
};

// User Login
function loginUser(req) {
    return userService.loginUser(req).then((result) => {
        userMapper.successLoginMapper(result);
    })
}

// Forget Password
function forgetPassword(req) {
    return userService.forgetPassword(req).then(result => result)
}

// Reset Password
function resetPassword(req) {
    return userService.resetPassword(req).then(result => result)
}

// User Logout
function logoutUser(req) {
    return userService.logoutUser(req).then(result => result)
}

module.exports = {
    signup,
    loginUser,
    forgetPassword,
    logoutUser,
    resetPassword
}
