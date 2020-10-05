const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    CategoryNameCantEmpty : "Category name cannot be empty",
    CategoryNameDuplicate : "Category name is duplicate. it must be unique.",
    statusCantEmpty: 'Status cannot be empty',
    ValidDetails: 'Please provide valid details',
    Category_Added : "Category Added Successfully",
    Category_Listed : "Category List get Successfully",
    Category_By_Id : 'Category By id get Successfully',
    Category_Update : 'Category Updated Successfully.',
    Category_Deleted : 'Category Deleted Successfully.',
    INTRNLSRVR :'Internal Server Error.',
    Unauthorized :'Unauthorized Request',
    validationError : 'Validation Error',
    statusInvalid: "Invalid status type",
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