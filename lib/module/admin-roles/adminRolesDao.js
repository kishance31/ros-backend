"use strict";

const BaseDao = require('../../dao/baseDao');
const adminRoleModel = require('../../model/adminRolesModel');
const adminFormsModel = require('../../model/adminFormsModel');
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);
const adminRoleDao = new BaseDao(adminRoleModel);
const adminFormsDao = new BaseDao(adminFormsModel);

exports.checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

exports.addRole = async (data) => {
    try {
        return await adminRoleDao.save({
            adminId: data.adminId,
            roleName: data.roleName
        });
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

exports.getRole = async (roleName) => {
    try {
        return await adminRoleDao.findOne({ roleName });
    } catch (error) {
        return null;
    }
}

exports.updateRole = async ({ adminId, roleId, roleName }, options) => {
    try {
        return await adminRoleDao.findOneAndUpdate(
            { adminId, _id: roleId },
            { $set: { roleName: roleName } },
            { ...options }
        )
    } catch (error) {
        return null;
    }
}

exports.deleteRole = async (roleId) => {
    try {
        return await adminRoleDao.findByIdAndRemove({ _id: roleId });
    } catch (error) {
        logger.warn(error)
        return null
    }
}

exports.managePermissions = async (data, options) => {
    try {
        return await adminRoleDao.findOneAndUpdate(
            { _id: data.roleId, roleName: data.roleName },
            { $set: { permissions: data.permissions } },
            { ...options },
        )
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

exports.getAdminForms = async () => {
    try {
        return await adminFormsDao.findOne({});
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

exports.getAllRoles = async () => {
    try {
        return await adminRoleDao.find({}, {updatedAt: 0, __v: 0});
    } catch (error) {
        return [];
    }
}