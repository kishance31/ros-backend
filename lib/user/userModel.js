// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

let User;


const UserSchema = Schema({
  // id will be auto generated
  companyName: { type: String, required: false },
  firstName: { type: String, required: false },
  lastName: { type: String, required: false },
  position: { type: String, required: false },
  department: { type: String, required: false },
  email: { type: String, required: true },
  corporateEmailId: { type: String, required: false },
  officeContactNo: { type: Number, required: false },
  mobileNo: { type: Number, required: false },
  employeeId: { type: String, required: false },
  username: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false},
  userType: { type: String, required: false },
  documentPath: { type: String, required: false }
}, {
  //this will add createdAt and updatedAt in the table
  timestamps: true
});

UserSchema.methods.toJSON = function () {
  var obj = this.toObject();

  delete obj.created;
  delete obj.updated;
  
  return obj;
};

UserSchema.methods.userExist = function (name) {
  return this.where({ $or: [{ username: name },{ email: name }] });
};

//Export user module
User = module.exports = mongoose.model(constants.DB_MODEL_REF.USER, UserSchema);

/*module.exports = rootRef*/
