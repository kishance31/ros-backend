// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

let User;

const UserSchema = Schema({
  // id will be auto generated
  companyName: {
    type: String,
    required: false
  },
  firstName: {
    type: String,
    required: false
  },
  lastName: {
    type: String,
    required: false
  },
  email: {
    type: String,
    required: true
  },
  officeContactNo: {
    type: Number,
    required: false
  },
  mobileNo: {
    type: Number,
    required: false
  },
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED']
  },
  tokens: {
    type: String,
    required: false
  },
  role: {
    type: String,
    enum: ['ADMIN', 'CORPORATE_ADMIN', 'EMPLOYEE'],
    required: true
  },
  corpDoc: {
    type: String,
    required: false
  },
  address: [
    {
      delivery_address: String,
      city: String,
      state: String,
      country: String
    }
  ],

  corporate_admin_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: constants.DB_MODEL_REF.USER
  },

  license_id: {
    type: mongoose.Schema.Types.ObjectId
  },

  isFirstLogin: {
    type: Boolean,
    default: false
  },
  resetTokenIsUsed: {
    type: Boolean,
    default: false
  }
},
  {
    timestamps: true
  });

// UserSchema.methods.toJSON = function () {
//   var obj = this.toObject();

//   delete obj.created;
//   delete obj.updated;

//   return obj;
// };

UserSchema.methods.userExist = function (name) {
  return this.where({ $or: [{ username: name }, { email: email }] });
};

//Export user module
User = module.exports = mongoose.model(constants.DB_MODEL_REF.USER, UserSchema);
