/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const MESSAGES = {
    PWD_CANT_EMPTY: "Password is empty or invalid.",
    PWD_NOT_LONG_ENOUGH: "Password must be long enough.",
    UserNameCantEmpty: "Username cannot be empty",
    EmailCantEmpty:"email id cannot be empty",
    InvalidEmail:"Invalid email",
    Invalidtoken:"Invalid user token",
    validationError : "Validation errors",
    userExist : "User Already Exists",
    UserNotExist : "User Does not exists",
    UserListed : "Admin Listed Successfully",
    UserById : "Admin Listed By Id",
    UserDeleted : "Admin Deleted Successfully",
    UserIdCantEmpty : "User id cannot be empty",
    FirstNameCantEmpty: 'First name cannot be empty',
    LastNameCantEmpty: 'Last name cannot be empty',
    RoleCantEmpty: 'Role cannot be empty',
    RoleMustBeCorporateOrEmployee: 'Role must be Corporate admin or Employee',
    RESET_TOKEN_NOT_FOUND: 'Reset token not found.',
    internalServerError: 'Internal Server Error',
    SuccessfullyRegistered : "Successfully registered",
    StatusUpdated : "Status Updated successfully",
    AdminUpdate : "Admin Updated Successfully"

  };
  const CODE = {
    FRBDN: 403,
    INTRNLSRVR: 500,
    Success: 200,
    DataNotFound: 404,
    BadRequest: 400,
    Unauthorized:401
}
  module.exports = {
    MESSAGES:MESSAGES,
    CODE:CODE
  };
  