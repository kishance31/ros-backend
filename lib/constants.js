const STATUS_CODE = {
    ERROR: 0,
    SUCCESS: 1
};
const ACCOUNT_LEVEL = {
    ADMIN : 1,
    NORMAL_USER : 0
};
const DB_MODEL_REF = {
    USER : "User",
    BRANCH :"Branch",
    CATEGORY : "Category",
    SUBCATEGORY : "SubCategory",
    PRODUCT : "Product",
    LICENSES: "license",
    PURCHASE_LICENSE: "purchaseLicense",
    LICENSE_ORDER_ID: "licenseOrderId",
    LICENSE_COUNT: "licenseCount",
    ORDER:"Order",
    CART:"Cart",
    VENDOR:"Vendor"
};


const MESSAGES = {
    intrnlSrvrErr: "Please try after some time.",
    unAuthAccess: "Unauthorized access.",
    tokenGenError: "Error while generating access token",
    invalidEmail: "Please fill valid Email Address",
    invalidMobile: "Please fill valid Mobile No",
    nameCantEmpty: "Name can't be empty",
    passCantEmpty: "Password can't be empty",
    validationError : "Validation errors",
    incorrectPass: "Invalid email or passoword",
    userNotFound: "User not found.",
};

module.exports = Object.freeze({
    TOKEN_EXPIRATION_TIME : 60 * 24 * 60, // in mins - 60 days
    STATUS_CODE: STATUS_CODE,
    ACCOUNT_LEVEL : ACCOUNT_LEVEL,
    DB_MODEL_REF: DB_MODEL_REF,
    MESSAGES : MESSAGES,
});
