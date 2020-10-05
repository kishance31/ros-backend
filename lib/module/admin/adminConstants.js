/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const MESSAGES = {
  PWD_CANT_EMPTY: "Password is empty or invalid.",
  PWD_NOT_LONG_ENOUGH: "Password must be long enough.",
  UserNameCantEmpty: "Username cannot be empty",
  EmailCantEmpty: "email id cannot be empty",
  InvalidEmail: "Invalid email",
  Invalidtoken: "Invalid user token",
  validationError: "Validation errors",
  userExist: "User Already Exists",
  UserNotExist: "User Does not exists",
  UserListed: "Admin Listed Successfully",
  UserById: "Admin Listed By Id",
  UserDeleted: "Admin Deleted Successfully",
  UserIdCantEmpty: "User id cannot be empty",
  FirstNameCantEmpty: 'First name cannot be empty',
  LastNameCantEmpty: 'Last name cannot be empty',
  RoleCantEmpty: 'Role cannot be empty',
  RoleMustBeCorporateOrEmployee: 'Role must be Corporate admin or Employee',
  RESET_TOKEN_NOT_FOUND: 'Reset token not found.',
  internalServerError: 'Internal Server Error',
  SuccessfullyRegistered: "Successfully registered",
  StatusUpdated: "Status Updated successfully",
  StatusUpdatedError: "Error while updating status.",
  AdminUpdate: "Admin Updated Successfully",
  Employee_Orders: "Employee Orders get successfully",
  invalidIsActive: "Active param must be a boolean only.",

  incorrectRoleName: "Incorrect role name.",
  statusEmpty: "Status cannot be empty",
  corporateListSuccess: "Fetched corporate list successfully.",
  corporateListError: "Error fetching corporate list.",

  mailSuccess: "If email is registered at our website, You will receive the mail.",
	mailError: "Error sending mail.",
	resetTokenInValid: "Reset token is invalid or has expired.",
	resetPasswordSuccess: "Password reset successfull.",
	resetPasswordError: "Error resetting password.",
	resetTokenEmpty: "Reset token cannot be empty.",
};
const CODE = {
  FRBDN: 403,
  INTRNLSRVR: 500,
  Success: 200,
  DataNotFound: 404,
  BadRequest: 400,
  Unauthorized: 401
}

const MAIL_MESSAGE = {
  FORGOT_PSWD_SUB: "Reset your password!",
  FORGOT_PSWD: "You have received this email because a password reset request for your account is received. If its not created by you ignore this mail.",
  FORGOT_PSWD_BTN_MSG: "Click the button below to reset your password.",
  FORGOT_PSWD_BTN_TEXT: "Reset your password",
}
module.exports = {
  MESSAGES: MESSAGES,
  CODE: CODE,
  MAIL_MESSAGE: MAIL_MESSAGE
};
