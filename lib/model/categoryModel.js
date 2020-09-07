// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

let Category;

const CategorySchema = Schema({
    // id will be auto generated
  
    category_name: {
        type: String,
    },
    status:{
        type:String,
    }
  
  },
  {
    timestamps: true
  });




//Export category module
Category = module.exports = mongoose.model(constants.DB_MODEL_REF.CATEGORY, CategorySchema);
