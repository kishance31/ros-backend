// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

let Branch;

const BranchSchema = Schema({
    // id will be auto generated
  
    branch_name: {
        type: String,
    },
    company_name: {
        type: String,
    },
    email_id: {
        type: String,
    },
    location: {
        type: String,
    },
    mobile_no: {
        type: String,
    }
  },
  {
    timestamps: true
  });




//Export user module
Branch = module.exports = mongoose.model(constants.DB_MODEL_REF.BRANCH, BranchSchema);
