/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

function userExist() {
    var respObj = {
        "responseMessage": "Admin Already Exist",
        "responseCode": 500
    }
    return respObj;
}

function registerMapping() {
    var respObj = {
        "responseMessage": "Default Admin User Created.",
        "responseCode": 200
    }
    return respObj;
}

function userNotExist() {
    var respObj = {
        "responseMessage": "Incorrect Email/Password.",
        "responseCode": 400,
    }
    return respObj;
}

function passwordMismatch() {
    var respObj = {
        "responseMessage": "Incorrect Password.",
        "responseCode": 500
    }
    return respObj;
}

function loginMapping(jwt, user) {
    if(user) {
        const {
            firstName,
            lastName,
            email,
            mobileNo,
            isActive,
            _id,
            roleName
        } = user._doc;
        var respObj = {
            "responseMessage": "Successfully Logged In.",
            "responseCode": 200,
            tokens: jwt,
            user: {
                firstName,
                lastName,
                email,
                mobileNo,
                isActive,
                _id,
                roleName,
            },
        };
        return respObj;
    } else {
        var respObj = {
            "responseMessage": "Successfully Logged In.",
            "responseCode": 200,
            tokens: jwt,
        }
    }
};

function authoizationError() {
    var respObj = {
        "responseMessage": "Unauthorized Request",
        "responseCode": 401
    }
    return respObj;
}

function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
    }
}
function responseMappingAdmins(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        adminList: data.length ? data[0].list : [],
        totalAdmins: data.length && data[0].total.length ? data[0].total[0].count : 0
    }
}
function responseMappingData(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        data: data
    }
}


module.exports = {
    userExist,
    registerMapping,
    responseMapping,
    responseMappingAdmins,
    responseMappingData,
    passwordMismatch,
    loginMapping,
    authoizationError,
    userNotExist
}