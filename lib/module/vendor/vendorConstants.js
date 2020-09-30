const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    VendorNameCantEmpty : "Vendor name cannot be empty",
    EmailCantEmpty : "Email cannot be empty",
    emailInvalid : "Invalid email",
    ContactCantEmpty : "Contact cannot be empty",
    statusCantEmpty: 'Status cannot be empty',
    ValidDetails: 'Please provide valid details',
    Vendor_Added : "Vendor Added Successfully",
    Vendor_Listed : "Vendor List get Successfully",
    Vendor_By_Id : 'Vendor By id get Successfully',
    Vendor_Update : 'Vendor Updated Successfully.',
    Vendor_Deleted : 'Vendor Deleted Successfully.',
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