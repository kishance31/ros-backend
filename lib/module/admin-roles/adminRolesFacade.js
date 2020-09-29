const adminRoleService = require('./adminRolesService');

exports.addRole = async (data) => {
    try {
        return await adminRoleService.addRole(data);
    } catch (error) {
        return error;
    }
}

exports.updateRole = async (data) => {
    try {
        return await adminRoleService.updateRole(data);
    } catch (error) {
        return error;
    }
}

exports.deleteRole = async (data) => {
    try {
        return await adminRoleService.deleteRole(data);
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