'use strict';

const promise = require("bluebird");
const jwtHandler = require('../jwtHandler');
const AppUtil   = require('../appUtils');
const userMapper = require('./userMapper');
const userService = require("./userService");

// Signup
async function signup(signupInfo){
    try {
        const result = await userService.signupUser(signupInfo);
        if (result) {
            return result;
        }        
    } catch (err) {
        return err;
    }
};

// Login
async function login(loginInfo) {
    try {
        const isExist = await userService.isUserExist(loginInfo);  
        if (!isExist) {
            return userMapper.userNotExist();
        }
        // const roleMatch = await AppUtil.verifyRole(loginInfo, isExist);
        // if (!roleMatch) {
        //     return userMapper.userNotExist();
        // }
        const valid = await AppUtil.verifyPassword(loginInfo, isExist);
        if (!valid) {
            return userMapper.passwordMismatch();
        }
        const jwtToken = await jwtHandler.genUsrToken({ firstName: isExist.firstName, lastName: isExist.lastName, userId: isExist._id, email: isExist.email });        
        // const tokens = isExist.tokens;
        const data = {
            userId: isExist._id,
            tokens: jwtToken,
            returnNewDocument: true
        };        
        // Update jwt token into user document
        const res = await userService.loginUser(data);
        return userMapper.loginMapping(res, jwtToken);
    } catch (err) {
        return err;
    }
};

// Forgot password
async function forgot_password(userObj) {
    try {
        const isExist = await userService.isUserExist(userObj);  
        if (!isExist) {
            return userMapper.userNotExist();
        }
        // const roleMatch = await AppUtil.verifyRole(userObj, isExist);
        // if (!roleMatch) {
        //     return userMapper.userNotExist();
        // }
        return await userService.forgot_password(isExist);
    } catch (err) {
        return err;
    }
};

// Reset password
async function resetPassword(data) {
    try {
        return await userService.resetPassword(data);
    } catch (err) {
        return err;
    }
};

// Get user
async function getUser(data) {
    try {
        return await userService.getUser(data);
    } catch (err) {
        return err;
    }
};

// Logout
async function logout(data) {
    try {
        return await userService.logout(data);
    } catch (err) {
        return err;
    }
};

module.exports = {
    signup,
    login,
    forgot_password,
    logout,
    getUser,
    resetPassword
}
