"use strict";

const adminRoleDao = require('./adminRolesDao');
const adminRoleMapper = require('./adminRolesMapper');
const adminRoleConstant = require('./adminRolesConstant');

exports.addRole = async ({ adminRoleDetails, tokenPayload }) => {
    try {
        const adminExists = await adminRoleDao.checkAdmin(tokenPayload.userId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(adminRoleConstant.CODE.Unauthorized, adminRoleConstant.MESSAGES.invalidUser);
        }

        const roleExists = await adminRoleDao.getRole(adminRoleDetails.roleName);
        if (roleExists) {
            return adminRoleMapper.responseMapping(adminRoleConstant.CODE.Unauthorized, adminRoleConstant.MESSAGES.roleNameExists);
        }

        const result = await adminRoleDao.addRole(adminRoleDetails);
        if (result) {
            return adminRoleMapper.responseMappingData(adminRoleConstant.CODE.Success, adminRoleConstant.MESSAGES.roleAddSuccess, result);
        }

    } catch (error) {
        logger.info(error)
        return error
    }
}

exports.updateRole = async (data) => {
    try {
        const adminExists = await adminRoleDao.checkAdmin(data.adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(adminRoleConstant.CODE.Unauthorized, adminRoleConstant.MESSAGES.invalidUser);
        }

        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false,
        }

        const result = await adminRoleDao.updateRole(data, options);
        if (result) {
            return adminRoleMapper.responseMappingData(adminRoleConstant.CODE.Success, adminRoleConstant.MESSAGES.roleUpdateSuccess, result);
        }

    } catch (error) {
        return error;
    }
}

exports.deleteRole = async (data) => {
    try {
        const adminExists = await adminRoleDao.checkAdmin(data.adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(adminRoleConstant.CODE.Unauthorized, adminRoleConstant.MESSAGES.invalidUser);
        }

        const result = await adminRoleDao.deleteRole(data.roleId);
        if (result) {
            return adminRoleMapper.responseMappingData(adminRoleConstant.CODE.Success, adminRoleConstant.MESSAGES.roleDeleteSuccess, data.roleId);
        }
    } catch (error) {
        logger.warn(error);
        return error;
    }
}

const validatePermissions = async () => {
    try {

    } catch (error) {
        logger.warn(error);
        return false;
    }
}

exports.managePermissions = async (data) => {
    try {
        const adminExists = await adminRoleDao.checkAdmin(data.adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(adminRoleConstant.CODE.Unauthorized, adminRoleConstant.MESSAGES.invalidUser);
        }

        const formsResult = await adminRoleDao.getAdminForms();
        const permissionTypes = formsResult.types
        const formNames = formsResult.names;
        logger.info(permissionTypes, JSON.stringify(formNames));

        console.log(data);

        let permissionsObj = [];
        data.permissions.forEach(permission => {
            let selectedForm;
            formNames.forEach(form => {
                if (form.subForms.length) {
                    const _form = form.subForms.find(subForm => subForm.name === permission.name);
                    if (_form)
                        selectedForm = permission;
                } else {
                    if (form.name === permission.name) {
                        selectedForm = permission;
                    }
                }
            });
            const typesResult = selectedForm.types.every(val => permissionTypes.includes(val));
            if (selectedForm && typesResult) {
                permissionsObj.push(selectedForm);
            }
        });
        logger.info(permissionsObj);
        data.permissions = permissionsObj;

        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false,
        }

        const result = await adminRoleDao.managePermissions(data, options)
        if (result) {
            return adminRoleMapper.responseMappingData(adminRoleConstant.CODE.Success, adminRoleConstant.MESSAGES.roleDeleteSuccess, result);
        }
        return adminRoleMapper.responseMappingData(adminRoleConstant.CODE.Success, adminRoleConstant.MESSAGES.roleDeleteSuccess, result);
    } catch (error) {
        logger.warn(error);
        return error;
    }
}

exports.getAllRoles = async (adminId) => {
    try {
        const adminExists = await adminRoleDao.checkAdmin(adminId);
        if (!adminExists) {
            return adminRoleMapper.responseMapping(adminRoleConstant.CODE.Unauthorized, adminRoleConstant.MESSAGES.invalidUser);
        }
    
        let result = await adminRoleDao.getAllRoles();
        return adminRoleMapper.responseMappingData(adminRoleConstant.CODE.Success, "Roles List.", result);
    } catch (error) {
        return error;        
    }
}