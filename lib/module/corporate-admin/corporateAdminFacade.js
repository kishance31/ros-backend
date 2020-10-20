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
        // if (isExist.status == "PENDING") {
        //     return userMapper.pendingAccount();
        // }

        if (!isExist.isActive || isExist.isDeleted) {
            return userMapper.InActiveAccount();
        }

        // if (isExist.status == "REJECTED") {
        //     return userMapper.InActiveAccount();
        // }

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

        if(typeof updateUserObj.corpDoc === "object") {
            updateUserObj.corpDoc = await AppUtil.streamUploadToCloudinary(updateUserObj.corpDoc.data);
        }

        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            projection: {
                resetTokenIsUsed: 0,
                createdAt: 0,
                updatedAt: 0,
                isActive: 0,
                password: 0,
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
        return await userService.forgot_password(userObj);
    } catch (err) {
        return err;
    }
};

// Reset password
async function resetPassword(data) {
    console.log(data,'dataaa@@@@@@@@@@@@@@@@@@@@')
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

// Get employee order details
async function getEmployeeOrders(data, req) {
    try {
        return await userService.getEmployeeOrders(data, req);
    } catch (err) {
        return err;
    }
};
function updateEmployeeOrders(req, updateData) {
    return userService.employeeOrdersEditById(req, updateData).then(result =>
        result)
}
 function sendMail(employee,req) {
    return  userService.sendMail(employee,req);
};
function sendOrderToVendor(vendor) {
    return  userService.sendOrderToVendor(vendor);
};
function getEmployeeNames(id) {
    return userService.getEmployeeNames(id).then(result => result);
}
async function confirmEmployeeOrders(orders, update, userId) {
    const isExist = await userService.isUserExist({userId});
        if (!isExist) {
            return userMapper.userNotExist();
        }
    return userService.confirmEmployeeOrders(orders, update).then(result => result);
}

function getInvoiceList(data, batch, limit) {
    return userService.getInvoiceList(data, batch, limit).then(result => result);
}

function recurringInvoicePayment(data) {
    return userService.recurringInvoicePayment(data).then(result => result);
}

module.exports = {
    signup,
    login,
    forgot_password,
    logout,
    getUser,
    resetPassword,
    updateUser,
    getEmployeeOrders,
    updateEmployeeOrders,
    sendMail,
    getEmployeeNames,
    confirmEmployeeOrders,
    getInvoiceList,
    recurringInvoicePayment,
    sendOrderToVendor
}
