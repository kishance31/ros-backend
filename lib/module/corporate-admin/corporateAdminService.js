"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const _ = require("lodash");
const sendgridTransport = require("@sendgrid/mail");
const userDao = require("./corporateAdminDao");
const { cfg } = require('./../../config');
const corporateAdminConstants = require("./corporateAdminConstants");
const appUtils = require("../../appUtils");
const userMapper = require("./corporateAdminMapper");
const mailHandler = require('./../../commonHandler/mailHandler');
const config = require("../../config");
const jwtHandler = require("./../../commonHandler/jwtHandler");
const { streamUploadToCloudinary } = require("../../appUtils");
const responseHandler = require("./../../commonHandler/responseHandler");
// let mailSent:Boolean;
// User signup
async function signupUser(usrDetails) {
	logger.debug(`Inside signup corporate-admin services`);
	try {
		const exist = await userDao.checkIfExist(usrDetails);
		if (exist) {
			return userMapper.userExist();
		}

		// Initialized
		usrDetails.role = "CORPORATE_ADMIN";
		usrDetails.status = "PENDING";
		usrDetails.isActive = true;

		/** -----send email---- **/
		// const buff = crypto.randomBytes(64);
		// const token = buff.toString('hex');
		// const resetTokenExpiration = Date.now() + 3600000;
		corporate_confirmation_mail(usrDetails.email);

		sendMailToAdmin(usrDetails);

		let corpDoc = usrDetails.files;
		if (corpDoc) {
			usrDetails.corpDoc = await streamUploadToCloudinary(corpDoc.data);
		}
		const data = await userDao.registerUser(usrDetails);
		if (data) {
			return userMapper.registerMapping(data._id);
		}
	} catch (err) {
		return err;
	}
}

// Send mail
function corporate_confirmation_mail(email, token) {
	sendgridTransport.setApiKey(config.cfg.API_SECRET);
	let mailOptions = {
		to: email,
		from: "jeena.varghese@codezeros.com",
		subject: "Corporate Profile Request",
		html: `
            <P>Thank you for your registration, After admin approval you will be able to login into your account </P>
        `,
	};
	sendgridTransport.send(mailOptions).catch((e) => {
		console.log("error", e);
	});
}

function sendMailToAdmin(details) {
	sendgridTransport.setApiKey(config.cfg.API_SECRET);
	let mailOptions = {
		to: config.cfg.ADMIN_MAIL_ID,
		from: config.cfg.FROM_EMAIL,
		subject: "Corporate Profile Request",
		html: `
			<P>A new corporate has registered. Check the Admin panel for more details</P><br/>
			<p>Name:- ${details.firstName}&nbsp;${details.lastName}</p><br />
			<p>email:- ${details.email}</p>
        `,
	};
	sendgridTransport.send(mailOptions).catch((e) => {
		console.log("error", e);
	});
}

// Chech if user exist
async function isUserExist(details, projection) {
	try {
		return await userDao.checkIfExist(details, projection);
	} catch (err) {
		return err;
	}
}

// Update user document
async function loginUser(data) {
	try {
		return await userDao.login(data);
	} catch (err) {
		return err;
	}
}

// Forgot password
async function forgot_password(email) {
	try {
		// find user in db
		const user = await userDao.checkIfUserExist(email);
		if (!user || user.isDeleted) {
			return userMapper.responseMapping(corporateAdminConstants.CODE.Unauthorized, corporateAdminConstants.MESSAGES.UserNotExist);
		}

		//Generate and set password reset token
		user.generatePasswordReset();
		// save reset password token and expire time in db
		await user.save();
		// mail body html
		const html = mailHandler.mailGenHTML({
			name: user.firstName + " " + user.lastName,
			intro: corporateAdminConstants.MAIL_MESSAGE.FORGOT_PSWD,
			action: {
				instructions: corporateAdminConstants.MAIL_MESSAGE.FORGOT_PSWD_BTN_MSG,
				button: {
					color: '#22BC66', // Optional action button color
					text: corporateAdminConstants.MAIL_MESSAGE.FORGOT_PSWD_BTN_TEXT,
					link: `${cfg.RESET_PSWD_CORPORATE_URL}?reset=${user.resetPasswordToken}`
				}
			}
		});

		// send mail
		mailHandler.sendMail({
			to: user.email,
			subject: corporateAdminConstants.MAIL_MESSAGE.FORGOT_PSWD_SUB,
			html
		});

		// send_mail(user, resetToken);
		return userMapper.emailSent(user.resetPasswordToken);
	} catch (err) {
		console.log(err);
		return err;
	}
}

async function updateUser(updateUserObj, userId, options) {
	try {
		return await userDao.updateUser(updateUserObj, userId, options);
	} catch (error) {
		logger.warn(error);
		return error;
	}
}

// Reset password
async function resetPassword(data) {
	try {
		const user = await userDao.checkIfUserExist(data);
		if (!user) {
			return userMapper.resetTokenExpireOrNotFound();
		}
		const newPassword = await appUtils.convertPass(data.password);
		const updateData = {
			userId: user._id,
			newPassword,
			returnNewDocument: true,
			resetPasswordToken: "",
			resetPasswordExpires: 0,
		};
		const result = await userDao.reset_password(updateData);
		if (result) {
			return userMapper.passwordChanged();
		}
	}
	catch (err) {
		console.log(err)
		return err;
	}
}

// Get user data
async function getUser(data) {
	try {
		const user = await userDao.checkIfExist(data);
		if (!user) {
			return userMapper.userNotExist();
		}
		return userMapper.userFetched(user);
	} catch (err) {
		return err;
	}
}

// Logout
async function logout(data) {
	try {
		const isExist = await userDao.checkIfExist(data);
		if (!isExist) {
			return userMapper.userNotExist();
		}
		data.returnNewDocument = true;
		await userDao.logoutUser(data);
		return userMapper.logoutSuccess();
	} catch (err) {
		return err;
	}
}

// Get user data
async function getEmployeeOrders(data, req) {
	let query = {};
	let { batch, limit } = req.pagination;
	if (req.body.employeeId) {
		query = {
			employeeId: mongoose.Types.ObjectId(req.body.employeeId),
			//   status: req.body.status ? req.body.status : "",
			corporateId: mongoose.Types.ObjectId(data.corporateId),
		};
	} else {
		query = {
			corporateId: mongoose.Types.ObjectId(data.corporateId),

		};
	}

	let agrgegateQuery = [{
		$facet: {
			list: [
				{
					$match: query,
				},
				{
					$lookup: {
						from: "products",
						localField: "products",
						foreignField: "_id",
						as: "productDetails",
					},
				},
				{
					$lookup: {
						from: "users",
						localField: "employeeId",
						foreignField: "_id",
						as: "employeeDetails",
					},
				},
				{
					$project: {
						address: 1,
						orderId: 1,
						orderDate: 1,
						status: 1,
						deliveryStatus: 1,
						deliveryDate: 1,
						dispatchDate: 1,
						firstPaymentTerm: 1,
						isFirstTimePayment: 1,
						"productDetails._id": 1,
						"productDetails.product_name": 1,
						"productDetails.product_description": 1,
						"productDetails.product_image": 1,
						"productDetails.ros_cod": 1,
						"productDetails.ros_cost": 1,
						"employeeDetails.firstName": 1,
						"employeeDetails.lastName": 1,
						"employeeDetails.employeeId": 1,
						"employeeDetails.licenseId": 1,
					},
				},
				{ $sort: { updatedAt: -1 } },
				{ $skip: batch * limit },
				{ $limit: limit }
			],
			total: [
				{ $match: query },
				{ "$count": "count" }
			],
		}
	}];

	return userDao
		.aggregate(agrgegateQuery)
		.then((empOrderDetail) => {
			return userMapper.responseMappingList(
				corpAdminConstants.CODE.Success,
				corpAdminConstants.MESSAGES.Employee_Orders,
				empOrderDetail
			);
		})
		.catch((err) => {
			console.log(err)
			return userMapper.responseMapping(
				corpAdminConstants.CODE.INTRNLSRVR,
				corpAdminConstants.MESSAGES.internalServerError
			);
		});
}

function employeeOrdersEditById(id, data) {
	try {
		return userDao.updateEmpOrders(id, data).then((data) => {
			return userMapper.responseMappingData(corpAdminConstants.CODE.Success, corpAdminConstants.MESSAGES.Employee_Orders_Update, data)

		}).catch((err) => {
			return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)

			sendgridTransport.send(mailOptions).then(() => {
				console.log("Message sent");
				//  userMapper.responseMapping()
			});

		})
	} catch (err) {
		return err;
	}
}

function getEmployeeNames(id) {
	try {
		return userDao.getEmployeeNames(id).then((data) => {
			return userMapper.responseMappingData(corpAdminConstants.CODE.Success, "Employee list success", data)

		}).catch((err) => {
			return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
		})
	} catch (err) {
		return err;
	}
}
async function confirmEmployeeOrders(orders, update) {
	try {
		let result = await userDao.createFirstInvoice(orders, update);
		if (result) {
			return userDao.confirmEmployeeOrders(orders, update).then((data) => {
				return userMapper.responseMapping(corpAdminConstants.CODE.Success, "Order Payment Success.")

			}).catch((err) => {
				return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
			})
		}
		return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
	} catch (err) {
		return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
	}
}

async function getInvoiceList(query, batch, limit) {
	try {
		return userDao.getInvoiceList(query, batch, limit).then((data) => {
			return userMapper.responseMappingList(corpAdminConstants.CODE.Success, "Invoice list Success.", data)
		}).catch((err) => {
			console.log(err);
			return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
		})
	} catch (err) {
		return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
	}
}

async function recurringInvoicePayment(data) {
	try {
		let result = await userDao.recurringInvoicePaymentUpdate(data);
		if (result) {
			return userDao.addOrderPaypalDetails(data).then((data) => {
				return userMapper.responseMapping(corpAdminConstants.CODE.Success, "Order Payment Success.")

			}).catch((err) => {
				return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
			})
		}
		return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
	} catch (err) {
		return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)
	}
}
async function sendMail(employee, corporate) {
	try {
		const employeeDetails = await userDao.getEmployeeDetails(employee);
		// let SENDGRID_API_KEY =
		//   "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";
		sendgridTransport.setApiKey(config.cfg.API_SECRET);
		let mailOptions = {
			to: employeeDetails.email,
			from: config.cfg.FROM_EMAIL,
			subject: corpAdminConstants.MESSAGES.WELCOME,
			html: `
	  <P>Hello ${employeeDetails.firstName}  ${employeeDetails.lastName}</P>
	  <p> We welcome you to ROS <br> Your email is ${employeeDetails.email} and password ${employeeDetails.password} </p>
	  <P>Click this <a href="http://localhost:3000/">link</a> to Login to ROS.</P>
	  <p>Thanks</p>
	  <p>ROS Team</p>`,
		};

		sendgridTransport.send(mailOptions).then(() => {
			console.log("Message sent");
			//  userMapper.responseMapping()
		});

	}
	catch (err) {
		return err;
	}
	return userMapper.responseMapping(
		corpAdminConstants.CODE.Success,
		corpAdminConstants.MESSAGES.Mail_SENT
	);
}

module.exports = {
	signupUser,
	isUserExist,
	forgot_password,
	loginUser,
	logout,
	resetPassword,
	getUser,
	updateUser,
	getEmployeeOrders,
	employeeOrdersEditById,
	getEmployeeNames,
	confirmEmployeeOrders,
	getInvoiceList,
	recurringInvoicePayment,
	sendMail
};
