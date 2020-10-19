const MESSAGES = {
	PWD_CANT_EMPTY: "Password is empty or invalid.",
	PWD_NOT_LONG_ENOUGH: "Password must be long enough.",
	EmailCantEmpty: "email id cannot be empty",
	InvalidEmail: "Invalid email",
	validationError: "Validation errors",
	UserIdCantEmpty: "User id cannot be empty",
	UserNameCantEmpty: "User name cannot be empty",
	FirstNameCantEmpty: 'First name cannot be empty',
	LastNamCantEmpty: 'Last name cannot be empty',
	RoleCantEmpty: 'Role cannot be empty',
	RoleMustBeCorporateOrEmployee: 'Role must be Corporate admin or Employee',
	RESET_TOKEN_NOT_FOUND: 'Reset token not found.',
	usernameEmpty: "Username cannot be empty",
	companyNameEmpty: "Company name cannot be empty",
	positionEmpty: "Position cannot be empty",
	departmentEmpty: "Department cannot be empty",
	coporateEmailIdEmpty: "Corporate email id cannot be empty",
	mobileNoEmpty: "Mobile number cannot be empty",
	officeContactNoEmpty: "Office phone number cannot be empty",
	Employee_Orders:"Employee Orders Get Successfully",
	Employee_Orders_Update : "Employee orders status updated",
	Mail_SENT:"Mail Sent Sccessfully",
	INTRNLSRVR:"Internal server error",
	WELCOME:"Welcome to ROS",
	SIGNUP:"SIGN UP",
	ORDER:"Order Confirmation",
	ORDER_CANCEL:"Order Cancellation",
	PAYMENT:"Payment Success"
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
  }