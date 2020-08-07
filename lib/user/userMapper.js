

const contstants = require("./userConstants");
const config = require('../config');


function registerMapping(params) {
    var respObj = {
        "responseMessage": "Successfully registered.",
        "responseCode" : 200,
        "userProfile": {
            id:params
        }
    };
    return respObj;
};

function userExist(){
    var respObj = {
        "responseMessage": "User already exist.",
        "responseCode": 400,
    }
    return respObj;
};

function loginMapping(user, jwt){
    var respObj = {
        "responseMessage": "Successfully Logged In.",
        "responseCode" : 200,
        "userProfile": {
            user: {
                _id: user._id,
            },
            jwt
        }
    };
    return respObj;
};

function passwordMismatch(){
    var respObj = {
        "responseMessage": "Incorrect Password.",
        "responseCode": 500
    }
    return respObj;
};

function userNotExist(){
    var respObj = {
        "responseMessage": "User Not Found",
        "responseCode": 404
    }
    return respObj;
};

function internalServerError(){
    var respObj = {
        "responseMessage": "Internal Server Error.",
        "responseCode": 500
    }
    return respObj;
};

function somethingWentWrong(){
    var respObj = {
        "responseMessage": "Something went wrong, Please try agian later.",
        "responseCode": 500
    }
    return respObj;
};

function emailSent(){
    var respObj = {
        "responseMessage": "Reset link has been sent to your email account.",
        "responseCode": 200
    }
    return respObj;
};

function passwordChanged(){
    var respObj = {
        "responseMessage": "Password changed successfully!",
        "responseCode": 200
    }
    return respObj;
};

function logoutSuccess(){
    var respObj = {
        "responseMessage": "Successfully Logged Out.",
        "responseCode" : 200
    };

    return respObj;
};

function userFetched(user){
    var respObj = {
        "responseMessage": "User Fetched Successfully.",
        "responseCode" : 200,
        "userProfile": {
            user: {
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                contactNumber: user.contactNumber,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            }
        }
    };

    return respObj;
};

module.exports = {
    registerMapping,
    userExist,
    loginMapping,
    passwordMismatch,
    userNotExist,
    internalServerError,
    emailSent,
    somethingWentWrong,
    passwordChanged,
    logoutSuccess,
    userFetched,
};
