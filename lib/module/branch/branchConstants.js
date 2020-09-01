const MESSAGES = {
    TOKEN_NOT_PROVIDED: "Please provide a valid authorization details",
    BranchNameCantEmpty : "Branch name cannot be empty",
    companyNameCantEmpty: 'Company Name cannot be empty',
    EmailCantEmpty: 'EmailId is required.',
    ValidDetails: 'Please provide valid details',
    LocationCantEmpty: 'Location is required.',
    mobileCantEmpty: 'Mobile no is required',
    validationError : "Validation errors",
    Branch_Added : "Branch Added Successfully",
    Branch_Listed : "Branch List get Successfully",
    Branch_By_Id : 'Branch By id get Successfully',
    Branch_By_Corporate : 'Branch By Corporate Id get Successfully',
    Branch_Update : 'Branch Updated Successfully.',
    Branch_Deleted : 'Branch Deleted Successfully.',
    INTRNLSRVR :'Internal Server Error.',
    Unauthorized :'Unauthorized Request',
    userIdCantEmpty: 'User id cannot be empty',
    emailInvalid: 'Email Id is invalid.',
    tokenInvalid: 'Invalid token.',
    userNoPermission: "You don't have permissions to add a branch.",
    updateNoPermission: "You don't have permissions to update a branch.",
    deleteNoPermission: "You don't have permissions to delete a branch.",
    branchNameExists: "Branch name already exists.",
    branchIdMissing: 'Branch Id is missing',
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