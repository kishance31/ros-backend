// Importing mongoose
const mongoose = require("mongoose");

const constants = require("../constants");

const Schema = mongoose.Schema;

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
      type: Boolean,
      default: true
    },
    product_name: {
      type: String,
    },

    product_image: [{
      type: String,
    }],

    product_cost: {
      type: Number,
    },

    product_code: {
      type: String,
    },

    ros_cost:{
      type: Number,
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
module.exports = mongoose.model(
  constants.DB_MODEL_REF.PRODUCT,
  ProductSchema
);
