// Importing mongoose
const mongoose = require("mongoose");

const constants = require('../constants');

const Schema = mongoose.Schema;

let Category;

const CategorySchema = new Schema({
	// id will be auto generated

	category_name: {
		type: String,
		index: { unique: true }
	},
	status: {
		type: Boolean,
		default: true
	},
	categoryRoute: {
		type: String,
		default: "/",
	},
	subCategories: [{
		type: Schema.Types.ObjectId,
		default: [],
	}]

}, {
	timestamps: true
});

// create a route name before saving
CategorySchema.pre('save', function () {
	if(this.isModified("category_name")) {
		this.categoryRoute = "/" + this.category_name.trim().toLowerCase().split(" ").join("-");
	}
});

//Export category module
Category = module.exports = mongoose.model(constants.DB_MODEL_REF.CATEGORY, CategorySchema);
