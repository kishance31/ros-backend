const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    ProductNameCantEmpty : "Product name cannot be empty",
    ProductCodeCantEmpty : "Product code cannot be empty",
    ProductCostCantEmpty : "Product cost cannot be empty",
    Product_By_License: "Product listed by License type Successfully",
    RosCodeCantEmpty : "Ros code cannot be empty",
    LicenseTypeCantEmpty : "License Type cannot be empty",
    ValidDetails: 'Please provide valid details',
    validationError : "Validation errors",
    Product_Added : "Product Added Successfully",
    Product_Listed : "Product List get Successfully",
    Product_By_Id : 'Product By id get Successfully',
    Product_By_Category : 'Product By Category Id get Successfully',
    Product_Update : 'Product Updated Successfully.',
    Product_Deleted : 'Product Deleted Successfully.',
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