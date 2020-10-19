const adminRoleService = require('./adminRolesService');

exports.addRole = async (data) => {
    try {
        return await adminRoleService.addRole(data);
    } catch (error) {
        return error;
    }
}

exports.updateRole = async (data, userId) => {
    try {
        return await adminRoleService.updateRole(data, userId);
    } catch (error) {
        return error;
    }
}

exports.deleteRole = async (data, userId) => {
    try {
        return await adminRoleService.deleteRole(data, userId);
    } catch (error) {
        return error;
    }
}

exports.managePermissions = async (data) => {
    try {
        return await adminRoleService.managePermissions(data);
    } catch (error) {
        return error;
    }
}

exports.getAllRoles = async (adminId) => {
    try {
        return await adminRoleService.getAllRoles(adminId);
    } catch (error) {
        return error;
    }
}

exports.getAdminForms = async() => {
    return await adminRoleService.getAdminForms();
}