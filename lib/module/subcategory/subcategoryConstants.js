const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    SubCategoryNameCantEmpty : "SubCategory name cannot be empty",
    StatusCantEmpty : "Status  cannot be empty",
    CategoryCantEmpty : "Category cannot be empty",
    ValidDetails: 'Please provide valid details',
    validationError : "Validation errors",
    SubCategory_Added : "SubCategory Added Successfully",
    SubCategory_Listed : "SubCategory List get Successfully",
    SubCategory_By_Id : 'SubCategory By id get Successfully',
    SubCategory_By_Category : 'SubCategory By Category Id get Successfully',
    SubCategory_Update : 'SubCategory Updated Successfully.',
    SubCategory_Deleted : 'SubCategory Deleted Successfully.',
    INTRNLSRVR :'Internal Server Error.',
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