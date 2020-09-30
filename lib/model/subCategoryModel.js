// Importing mongoose
const mongoose = require("mongoose");
const constants = require('../constants');
const Schema = mongoose.Schema;

const SubCategorySchema = new Schema({
    // id will be auto generated
  
    category_id: {
        type: Schema.Types.ObjectId
    },
    status:{
        type:Boolean,
        default:true
    },
    subcategory_name: {
        type: String,
        index: {unique: true},
    },
    subCategoryRoute: {
        type: String,
        default: "/",
	},
   },
  {
    timestamps: true
  });

// create a route name before saving
SubCategorySchema.pre('save', function () {
	this.subCategoryRoute = "/" + this.subcategory_name.trim().toLowerCase().split(" ").join("-");
});

//Export subcategory module
module.exports = mongoose.model(constants.DB_MODEL_REF.SUBCATEGORY, SubCategorySchema);
