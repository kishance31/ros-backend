const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    CartNameCantEmpty : "Cart name cannot be empty",
    statusCantEmpty: 'Status cannot be empty',
    employeeCantEmpty: 'Employee cannot be empty',
    ValidDetails: 'Please provide valid details',
    Cart_Added : "Cart Added Successfully",
    Cart_Listed : "Cart List get Successfully",
    Cart_By_EmployeeId : 'Cart By employee get Successfully',
    Cart_Update : 'Cart Updated Successfully.',
    Cart_Deleted : 'Cart Deleted Successfully.',
    INTRNLSRVR :'Internal Server Error.',
    Unauthorized :'Unauthorized Request',
    validationError : 'Validation Error',
    productIdCantEmpty : "Prdocut cannot be empty",
    productExistsInCart: "A similar product already exists in cart. You can have only one product of same type in the cart."
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