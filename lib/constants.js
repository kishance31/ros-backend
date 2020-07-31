const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1
};
const ACCOUNT_LEVEL = {
    ADMIN : 1,
    NORMAL_USER : 0
};
const LOGIN_TYPE = {
    FB : 0,
    TW : 1
};
const DB_MODEL_REF = {
    USER : "User"
};

const MESSAGES = {
    intrnlSrvrErr: "Please try after some time.",
    unAuthAccess: "Unauthorized access.",
    tokenGenError: "Error while generating access token",
    invalidEmail: "Please fill valid Email Address",
    invalidMobile: "Please fill valid Mobile No",
    blockedMobile: "Action Blocked for Illegal use of Services.",
    invalidOtp: "Invalid OTP",
    nameCantEmpty: "Name can't be empty",
    invalidZipcode: "please fill valid zip Code",
    invalidNum: "Please fill valid phone number or Do not add country code",
    passCantEmpty: "Password can't be empty",
    validationError : "Validation errors",
    incorrectPass: "Invalid email or passoword",
    userNotFound: "User not found.",
    deviceTokenCantEmpty : "Device token cannot be empty",
};

module.exports = Object.freeze({
    TOKEN_EXPIRATION_TIME : 60 * 24 * 60, // in mins - 60 days
    STATUS_CODE: STATUS_CODE,
    ACCOUNT_LEVEL : ACCOUNT_LEVEL,
    LOGIN_TYPE : LOGIN_TYPE,
    DB_MODEL_REF: DB_MODEL_REF,
    MESSAGES : MESSAGES,
});
