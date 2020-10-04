const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    CmsTitleCantEmpty : "Cms Title cannot be empty",
    CmsSubjectCantEmpty : "Cms Subject cannot be empty.",
    CmsDescriptionCantEmpty: 'Cms Description cannot be empty',
    ValidDetails: 'Please provide valid details',
    Cms_Added : "Cms Added Successfully",
    Cms_Listed : "Cms List get Successfully",
    Cms_By_Id : 'Cms By id get Successfully',
    Cms_Update : 'Cms Updated Successfully.',
    Cms_Deleted : 'Cms Deleted Successfully.',
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