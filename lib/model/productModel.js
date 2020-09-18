// Importing mongoose
const mongoose = require("mongoose");

const constants = require("../constants");

const Schema = mongoose.Schema;

let PRODUCT;

const ProductSchema = Schema(
  {
    // id will be auto generated

    category_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    sub_category_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
    status: {
      type: String,
    },
    product_name: {
      type: String,
    },

    product_image: {
      type: String,
    },

    product_cost: {
      type: String,
    },

    product_code: {
      type: String,
    },

    ros_cost:{
      type: String,
    },

    product_description:{
      type: String,
    },

    ros_code: {
      type: String,
    },
    license_id: {
      type: mongoose.Schema.Types.ObjectId,
    },
  },
  {
    timestamps: true,
  }
);

//Export user module
PRODUCT = module.exports = mongoose.model(
  constants.DB_MODEL_REF.PRODUCT,
  ProductSchema
);
