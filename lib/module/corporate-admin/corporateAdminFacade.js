'use strict';

const promise = require("bluebird");
const jwtHandler = require('../../commonHandler/jwtHandler');
const AppUtil = require('../../appUtils');
const userMapper = require('./corporateAdminMapper');
const userService = require("./corporateAdminService");

// Signup
async function signup(signupInfo) {
    return await userService.signupUser(signupInfo);
};

// Login
async function login(loginInfo) {
    try {
        const projection = {
            resetTokenIsUsed: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
            tokens: 0,
        }
        const isExist = await userService.isUserExist(loginInfo, projection);
        if (!isExist) {
            return userMapper.userNotExist();
        }

        // Verify account activated or not
        if (isExist.status == "PENDING") {
            return userMapper.pendingAccount();
        }

        if (!isExist.isActive) {
            return userMapper.rejectAccount();
        }

        if (isExist.status == "REJECTED") {
            return userMapper.InActiveAccount();
        }

        // const roleMatch = await AppUtil.verifyRole(loginInfo, isExist);
        // if (!roleMatch) {
        //     return userMapper.userNotExist();
        // }
        const valid = await AppUtil.verifyPassword(loginInfo, isExist);
        if (!valid) {
            return userMapper.passwordMismatch();
        }
        const jwtToken = await jwtHandler.genUsrToken({
            firstName: isExist.firstName,
            lastName: isExist.lastName,
            userId: isExist._id,
            email: isExist.email,
            role: isExist.role,
            companyName: isExist.companyName,
        });
        const data = {
            userId: isExist._id,
            tokens: jwtToken,
        };
        userService.loginUser(data);
        return userMapper.loginMapping(isExist, jwtToken);
    } catch (err) {
        return err;
    }
};

async function updateUser(updateUserObj, userId, tokens) {
    try {
        if (updateUserObj._id !== userId) {
            return userMapper.incorrectUserIdToken();
        }
        const isExist = await userService.isUserExist({ userId, email: updateUserObj.email });

        if (!isExist) {
            return userMapper.userNotExist();
        }
        delete updateUserObj._id;
        delete updateUserObj.email;
        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            projection: {
                resetTokenIsUsed: 0,
                createdAt: 0,
                updatedAt: 0,
                isActive: 0,
                password: 0,
                status: 0,
                __v: 0,
            }
        }
        let result = await userService.updateUser(updateUserObj, userId, options);
        result._doc.tokens = tokens
        if (result) {
            return userMapper.updateuserMapping(result);
        }
        return userMapper.updateuserError()
    } catch (error) {
        logger.warn(error);
        return error;
    }
}

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
    resetPassword,
    updateUser
}
