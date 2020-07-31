//========================== Load Modules Start ===========================

//========================== Load external Module =========================
//========================== Load Internal Module =========================
const appUtils = require("../appUtils");
const userConst = require("./userConstants");
const exceptions = require("../customException");
//========================== Load Modules End =============================


//========================== Export Module Start ===========================

// Register validation
function register(req,res,next){
    const { fullname, username, password, fb_id, type, firstName, lastName, role } = req.body;
    let email = req.body.email;
    const error = [];
    
    email = req.body.email = _.toLower(email);

	// if(!fullname){
	// 	error.push({ code:500, message: userConst.MESSAGES.FULLNAME_CANT_EMPTY })
    // } else if (!username) {
	// 	error.push({ code:500, message:userConst.MESSAGES.UserNameCantEmpty })
    // } 

    if (!firstName) {
        error.push({ code: 500, message: userConst.MESSAGES.FirstNameCantEmpty });
    } else if (!lastName) {
        error.push({ code: 500, message: userConst.MESSAGES.LastNamCantEmpty });
    } else if (!email) {
		error.push({ code:500, message: userConst.MESSAGES.EmailCantEmpty });
	} else if (!password) {
		error.push({ code:500, message: userConst.MESSAGES.PWD_CANT_EMPTY });
	} else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    } else if (!role) {
        error.push({ code: 500, message: userConst.MESSAGES.RoleCantEmpty });
    } else if (role !== 'ADMIN' && role !== 'TENANT') {
        error.push({ code: 500, message: userConst.MESSAGES.RoleMustBeAdminOrTenant });
    }
	// else if(!validation.validateEmail(email)){
	// 	error.push({code:500,message: userConst.MESSAGES.InvalidEmail })
	// }
	// else if(fb_id){
	// 		error.push({code:500,message: userConst.MESSAGES.FbIdNotRequired })
	// }
	// else if(type && type == 'facebook'){
	// error.push({code:500,message:userConst.MESSAGES.TypeNormal})
	// }

	if(error.length >0){
		validationError(error,next);
    }
    
	next();
};

// Change name
const changeName = function(req,res,next){
    req.body.fullname = req.body.firstName + ' ' + req.body.lastName || '' ;

    next();
};

// Login validation
const validateLogin = function (req, res, next) {
    let email = req.body.email;
    const { password, role } = req.body;
    const errors = [];

    email = req.body.email = _.toLower(email);

    // const { lat, lng, app_version, platform, ios_version } = req.headers;
    if (_.isEmpty(password)) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_CANT_EMPTY });
    } else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    }  else if (role !== 'ADMIN' && role !== 'TENANT') {
        errors.push({ fieldName: 'role', message: userConst.MESSAGES.RoleMustBeAdminOrTenant });
    } else if (_.isEmpty(email)) {
        errors.push({ fieldName: "email", message: userConst.MESSAGES.EmailCantEmpty });
    } else {
        if (!appUtils.isValidEmail(email)) {
            errors.push({ fieldName: "email", message: userConst.MESSAGES.InvalidEmail });
        }
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

const validateResetPassword = (req, res, next) => {
    const { password, resetToken } = req.body;
    const errors = [];

    if (_.isEmpty(password)) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_CANT_EMPTY });
    } else if (password.length < 6) {
        errors.push({ fieldName: "Password", message: userConst.MESSAGES.PWD_NOT_LONG_ENOUGH });
    } else if (!resetToken) {
        errors.push({ fieldName: "Reset Token", message: userConst.MESSAGES.RESET_TOKEN_NOT_FOUND });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

// User id validation
const validateUserId = function (req, res, next) {
    const { invitedByUserId } = req.body;
    const errors = [];

    if (_.isEmpty(invitedByUserId)) {
        errors.push({ fieldName: "invitedByUserId", message: userConst.MESSAGES.UserIdCantEmpty });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

// Users id validation
const validateUsersId = function (req, res, next) {
    const { userId } = req.body;
    const errors = [];

    if (_.isEmpty(userId)) {
        errors.push({ fieldName: "userId", message: userConst.MESSAGES.UserIdCantEmpty });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

// Get connection page list validation
const validateGetConnectionPageList = function (req, res, next) {
    const { pageNo, count } = req.params;
    const errors = [];

    if (pageNo) {
        pageNo = req.body.pageNo = parseInt(pageNo);
    }

    if (count) {
        count = req.body.count = parseInt(count);
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    next();
};

// Validation Error
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(userConst.MESSAGES.validationError, errors));
    }

    next();
};

module.exports = {
    validateLogin,
    requiredCheck:register,
    changeName,
    validateUserId,
    validateGetConnectionPageList,
    validateUsersId,
    validateResetPassword
};
//========================== Export module end ==================================
