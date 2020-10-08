const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    CmsDescriptionCantEmpty: 'AboutUs Description cannot be empty',
    CmsContactCantEmpty:'Contact is required',
    CmsAddressCantEmpty:'Address is required',
    CmsEmailCantEmpty:"Email is required",
    InvalidEmail:"Invalid Email",
    ValidDetails: 'Please provide valid details',
    AboutUs_Added : "AboutUs Added Successfully",
    AboutUs_Listed : "AboutUs List get Successfully",
    AboutUs_By_Id : 'AboutUs By id get Successfully',
    AboutUs_Update : 'AboutUs Updated Successfully.',
    AboutUs_Deleted : 'AboutUs Deleted Successfully.',
    ContactUs_Added : "ContactUs Added Successfully",
    ContactUs_Listed : "ContactUs List get Successfully",
    ContactUs_By_Id : 'ContactUs By id get Successfully',
    ContactUs_Update : 'ContactUs Updated Successfully.',
    ContactUs_Deleted : 'ContactUs Deleted Successfully.',
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