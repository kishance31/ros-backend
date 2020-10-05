'use strict';

const adminRoleConstant = require("./adminRolesConstant");
const exceptions = require("../../commonHandler/customException");
const _ = require('lodash');

exports.addRoleValidate = (req, res, next) => {
    const errors = [];
    const { adminId, roleName, roleId } = req.body;

    logger.info(roleName);

    if (!roleName) {
        errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.roleNameEmpty })
    }
    // if (!adminId) {
    //     errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.adminIdEmpty })
    // }
    // if (adminId !== req.tokenPayload.userId) {
    //     errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.adminIdEmpty })
    // }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.adminRoleDetails = { adminId, roleName, roleId };
    next();
}

exports.roleIdValidate = (req, res, next) => {
    const errors = [];
    const { roleId } = req.body;

    if (!roleId) {
        errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.roleIdEmpty });
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.adminRoleDetails = { roleId };
    next();
}

exports.validatePermissions = (req, res, next) => {
    const errors = [];
    const { roleId, adminId, roleName, permissions } = req.body;

    if (adminId !== req.tokenPayload.userId) {
        errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.adminIdEmpty })
    }
    if (!roleId) {
        errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.roleIdEmpty });
    }
    if (!roleName) {
        errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.roleNameEmpty })
    }
    if (!(_.isArray(permissions) && permissions.length)) {
        errors.push({ code: adminRoleConstant.CODE.Unauthorized, message: adminRoleConstant.MESSAGES.permissionsEmpty })
    }

    if (errors && errors.length > 0) {
        validationError(errors, next);
    }

    req.adminRoleDetails = { roleId, adminId, roleName, permissions };
    next();
}

/**
 * validation error handler
 *
 * @async
 * @desc handler validation
 * 
 * @param {Object} errors, list of errors
 * @param {Object} next, passing it on to next middleware
 * 
 */
const validationError = function (errors, next) {
    if (errors && errors.length > 0) {
        return next(exceptions.getCustomErrorException(adminRoleConstant.MESSAGES.validationError, errors));
    }
    next();
};