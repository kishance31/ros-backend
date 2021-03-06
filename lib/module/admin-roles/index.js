'use strict';

const adminRolesRouter = require('express').Router();
const adminRolevalidators = require('./adminRolesValidators')
const authMiddleware = require("../../middlewares/auth");
const adminRoleFacade = require('./adminRolesFacade');
const responseHandler = require('./../../commonHandler/responseHandler');

adminRolesRouter.route('/addRole')
    .post([authMiddleware.autntctAdminTkn, adminRolevalidators.addRoleValidate], (req, res) => {
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
    .post([authMiddleware.autntctAdminTkn, adminRolevalidators.addRoleValidate], (req, res) => {
        const {
            adminRoleDetails,
            tokenPayload
        } = req;
        console.log(tokenPayload);
        adminRoleFacade.updateRole(adminRoleDetails, tokenPayload.userId)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

adminRolesRouter.route('/deleteRole')
    .post([authMiddleware.autntctAdminTkn, adminRolevalidators.roleIdValidate], (req, res) => {
        const {
            adminRoleDetails,
            tokenPayload
        } = req;

        adminRoleFacade.deleteRole(adminRoleDetails, tokenPayload.userId)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

adminRolesRouter.route("/getAllRoles")
    .get([authMiddleware.autntctAdminTkn], (req, res) => {
        const {
            userId
        } = req.tokenPayload;
        console.log(req.tokenPayload);
        adminRoleFacade.getAllRoles(userId)
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });

    });

adminRolesRouter.route('/managePermissions')
    .post([authMiddleware.autntctAdminTkn, adminRolevalidators.validatePermissions], (req, res) => {
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

adminRolesRouter.route('/getAdminForms')
    .get([authMiddleware.autntctAdminTkn], (req, res) => {
        adminRoleFacade.getAdminForms()
            .then(result => {
                responseHandler.sendSuccess(res, result);
            })
            .catch(err => {
                responseHandler.sendError(res, err);
            });
    });

module.exports = adminRolesRouter;