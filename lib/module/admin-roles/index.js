'use strict';

const adminRolesRouter = require('express').Router();
const adminRolevalidators = require('./adminRolesValidators')
const authMiddleware = require("../../middlewares/auth");
const adminRoleFacade = require('./adminRolesFacade');
const responseHandler = require('./../../commonHandler/responseHandler');

adminRolesRouter.route('/addRole')
    .post([authMiddleware.autntctTkn, adminRolevalidators.addRoleValidate], (req, res) => {
        const {
            adminRoleDetails,
            tokenPayload
        } = req;

        adminRoleFacade.addRole({ adminRoleDetails, tokenPayload })
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

adminRolesRouter.route('/updateRole')
    .post([authMiddleware.autntctTkn, adminRolevalidators.addRoleValidate], (req, res) => {
        const {
            adminRoleDetails,
        } = req;

        adminRoleFacade.updateRole(adminRoleDetails)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

adminRolesRouter.route('/deleteRole')
    .post([authMiddleware.autntctTkn, adminRolevalidators.roleIdValidate], (req, res) => {
        const {
            adminRoleDetails,
        } = req;

        adminRoleFacade.deleteRole(adminRoleDetails)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

adminRolesRouter.route('/managePermissions')
    .post([authMiddleware.autntctTkn, adminRolevalidators.validatePermissions], (req, res) => {
        const {
            adminRoleDetails
        } = req;

        adminRoleFacade.managePermissions(adminRoleDetails)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

module.exports = adminRolesRouter;