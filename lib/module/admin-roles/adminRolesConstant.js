const MESSAGES = {
    formNameEmpty: 'Form Name is missing.',
    incorrectPermissions: 'Permission types is incorrect',
    validationError : "Validation errors",
    roleNameEmpty: 'Role Name cannot be empty.',
    adminIdEmpty: 'Admin Id cannot be empty.',
    invalidToken: 'Token is invalid',
    invalidUser: 'Invalid user id.',
    roleNameExists: 'Role name must be unique.',
    roleAddSuccess: 'Role added successfully.',
    roleUpdateSuccess: 'Role update successfully',
    roleDeleteSuccess: 'Role delete successfully',
    roleIdEmpty: 'Role Id cannot be empty',
    permissionsEmpty: 'Permissions cannot be empty.',
};

const CODE = {
    FRBDN: 403,
    INTRNLSRVR: 500,
    Success: 200,
    DataNotFound: 404,
    BadRequest: 400,
    Unauthorized: 401
}

module.exports = {
    MESSAGES: MESSAGES,
    CODE: CODE
};