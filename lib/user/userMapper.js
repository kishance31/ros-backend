/**
 * This file will have request and response object mappings.
 */

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

module.exports = {
    registerMapping,
    userExist,
    loginMapping,
    passwordMismatch,
    userNotExist
    // internalServerError,
    // emailSent,
    // somethingWentWrong,
    // resetTokenExpireOrNotFound,
    // passwordChanged,
    // logoutSuccess,
    // userFetched,
    // linkAlreadyUsed,
    // updateMapping
};
