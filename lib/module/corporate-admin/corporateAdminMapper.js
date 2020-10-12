function registerMapping(params) {
    var respObj = {
        "responseMessage": "Successfully registered.",
        "responseCode" : 201,
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
    const {
        isActive,
        // status,
        password,
        isDeleted,
        roleName,
        ...otherDetails
    } = user._doc;
    var respObj = {
        "responseMessage": "Successfully Logged In.",
        "responseCode" : 200,
        "userProfile": {
            user: otherDetails,
            tokens: jwt,
        }
    };
    return respObj;
};

function updateuserMapping(user){
    var respObj = {
        "responseMessage": "Successfully updated user profile.",
        "responseCode" : 201,
        "userProfile": user
    };
    return respObj;
};

function updateuserError(){
    var respObj = {
        "responseMessage": "Error updating user profile",
        "responseCode" : 400,
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

//
function pendingAccount(){
    var respObj = {
        "responseMessage": "Your account status is pending",
        "responseCode": 500
    }
    return respObj;
};
function rejectAccount(){
    var respObj = {
        "responseMessage": "Your account status is rejected",
        "responseCode": 500
    }
    return respObj;
};

function InActiveAccount(){
    var respObj = {
        "responseMessage": "Your account marked as InActive",
        "responseCode": 500
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

function incorrectUserIdToken(){
    return {
        "responseMessage": "Token is incorrect.",
        "responseCode": 500
    }
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

function responseMappingList(code, msg, data) {
    return {
        responseCode: code,
        responseMessage: msg,
        list: data.length ? data[0].list : [],
        totalRecords: data.length && data[0].total.length ? data[0].total[0].count : 0
    }
}

function resetTokenExpireOrNotFound(){
    var respObj = {
        "responseMessage": "Reset Token expire or Reset token not found!",
        "responseCode": 400
    }
    return respObj;
};

function linkAlreadyUsed(){
    var respObj = {
        "responseMessage": "This link already used to reset new password.",
        "responseCode" : 400
    };

    return respObj;
};

function responseMapping(code, msg) {
    return {
        responseCode: code,
        responseMessage: msg
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
    resetTokenExpireOrNotFound,
    linkAlreadyUsed,
    pendingAccount,
    rejectAccount,
    InActiveAccount,
    incorrectUserIdToken,
    updateuserMapping,
    updateuserError,
    responseMapping,
    responseMappingData,
    responseMappingList
};
