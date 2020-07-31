const codes = {
    FRBDN: 403,
    INTRNLSRVR: 500,
    Success: 200,
    DataNotFound: 404,
    BadRequest: 400,
    UnauthorizedAccess: 401
}

const messages = {
    successLogin: "Login Successfully",
    failedLogin: "Invalid Username or Password",
    notExist: "User not Exist",
    successProfileEdit: "Profile updated Successfully",
    successEmailSend: "Email Sent",
    successLogout: "Logout Successfully",
    failedLogout: "Logout Failed",
    InvalidDetails: 'Please provide valid details.',
    Success: 'Success',
    internalServerError: 'Internal server error. Please try after some time.',
    TOKEN_NOT_PROVIDED: 'Please provide a valid authorization details',
    InvalidCredentials: 'Please provide valid credentials and try again',
    inValidMailId: 'Invalid Email-Id',
    successResetPassword: 'Reset Password Successfully',
    invalidPassword: 'Invalid Password',
    errorInResetPassword: 'Error in Reset Password',
    successProfilePictureEdit: "Profile Picture uploaded Successfully",
    failedEditProfilePicture: "upload profile picture Failed",
    setPasswordError: "Error in Set Password",
    successSetPassword: "Set Password Successfully"
   
}

module.exports = {
    CODE: codes,
    MESSAGE: messages
}