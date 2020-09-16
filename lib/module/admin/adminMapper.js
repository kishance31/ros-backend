/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

function userExist(){
    var respObj = {
        "responseMessage": "Admin Already Exist",
        "responseCode": 500
    }
    return respObj;
}

function registerMapping(){
    var respObj = {
        "responseMessage": "Default Admin User Created.",
        "responseCode": 200
    }
    return respObj;
}

function userExist(){
    var respObj = {
        "responseMessage": "User already exist.",
        "responseCode": 400,
    }
    return respObj;
}

function passwordMismatch(){
    var respObj = {
        "responseMessage": "Incorrect Password.",
        "responseCode": 500
    }
    return respObj;
}

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

function authoizationError(){
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
    authoizationError
}