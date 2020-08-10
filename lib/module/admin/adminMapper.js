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
        "responseMessage": "Unauthrized Request",
        "responseCode": 401
    }
    return respObj;
}

module.exports = {
    userExist,
    registerMapping,
    userExist,
    passwordMismatch,
    loginMapping,
    authoizationError
}