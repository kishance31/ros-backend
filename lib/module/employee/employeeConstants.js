const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    EmployeeNameCantEmpty : "Employee name cannot be empty",
    companyNameCantEmpty: 'Company Name cannot be empty',
    EmailCantEmpty: 'EmailId is required.',
    ValidDetails: 'Please provide valid details',
    mobileCantEmpty: 'Mobile no is required',
    validationError : "Validation errors",
    Employee_Added : "Employee Added Successfully",
    Employee_Listed : "Employee List get Successfully",
    Employee_By_Id : 'Employee By id get Successfully',
    Employee_Update : 'Employee Updated Successfully.',
    Employee_Deleted : 'Employee Deleted Successfully.',
    internalServerError :'Internal Server Error.',
    Unauthorized :'Unauthorized Request'
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