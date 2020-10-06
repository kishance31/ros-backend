const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    EmailTemplatesTitleCantEmpty : "EmailTemplates Title cannot be empty",
    EmailTemplatesSubjectCantEmpty : "EmailTemplates Subject cannot be empty.",
    EmailTemplatesDescriptionCantEmpty: 'EmailTemplates Description cannot be empty',
    ValidDetails: 'Please provide valid details',
    EmailTemplate_Added : "EmailTemplates Added Successfully",
    EmailTemplate_Listed : "EmailTemplates List get Successfully",
    EmailTemplate_By_Id : 'EmailTemplates By id get Successfully',
    EmailTemplate_Update : 'EmailTemplates Updated Successfully.',
    EmailTemplate_Deleted : 'EmailTemplates Deleted Successfully.',
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