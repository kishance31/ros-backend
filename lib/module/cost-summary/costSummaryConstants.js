const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    ValidDetails: 'Please provide valid details',
    LicenseNameCantEmpty: 'License name cannot be empty',
    CostSummary_Added : "Cost Summary Added Successfully",
    CostSummary_By_Id : 'Cost Summary By id get Successfully',
    CostSummary_Update : 'Cost Summary Updated Successfully.',
    INTRNLSRVR :'Internal Server Error.',
    Unauthorized :'Unauthorized Request',
    validationError : 'Validation Error'
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