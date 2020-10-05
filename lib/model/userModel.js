// Importing mongoose
const mongoose = require("mongoose");
const crypto = require('crypto');
const constants = require('../constants');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
	corporateEmailId: {
		type: String,
		required: false
	},
	position: {
		type: String,
		required: false
	},
	department: {
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
	},
	password: {
		type: String,
		required: true
	},
	taxNo: {
		type: String,
		required: false
	},
	companyRegisterNo: {
		type: String,
		required: false
	},
	isActive: {
		type: Boolean,
		default: true
	},
	status: {
		type: String,
		enum: ['PENDING', 'APPROVED', 'REJECTED']
	},
	tokens: [{
		type: String,
		required: false
	}],
	role: {
		type: String,
		enum: ['ADMIN', 'CORPORATE_ADMIN', 'EMPLOYEE'],
		required: true
	},
	employeeId: {
		type: String,
		required: false
	},
	corpDoc: {
		type: String,
		required: false
	},
	address: [Schema.Types.Mixed],
	branchName: String,
	corporate_admin_id: {
		type: mongoose.Schema.Types.ObjectId,
	},
	licenseType: {
		type: String,
	},

	isFirstLogin: {
		type: Boolean,
		default: false
	},
	isDeleted: {
		type: Boolean,
		default: false
	},
	roleName: {
		type: Schema.Types.ObjectId,
		// default: "",
	},
	resetTokenIsUsed: {
		type: Boolean,
		default: false
	},
	resetPasswordToken: {
        type: String,
        default: "",
        required: false,
    },
    resetPasswordExpires: {
        type: Number,
        default: 0,
        required: false,
    }
}, {
	timestamps: true
});

UserSchema.methods.userExist = function (name) {
	return this.where({ $or: [{ username: name }, { email: email }] });
};

UserSchema.methods.generatePasswordReset = function() {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
};

//Export user module
module.exports = mongoose.model(constants.DB_MODEL_REF.USER, UserSchema);
