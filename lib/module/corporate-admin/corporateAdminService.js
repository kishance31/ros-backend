"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const _ = require("lodash");
const sendgridTransport = require("@sendgrid/mail");
const userDao = require("./corporateAdminDao");
const { cfg } = require("./../../config");
const corporateAdminConstants = require("./corporateAdminConstants");
const appUtils = require("../../appUtils");
const userMapper = require("./corporateAdminMapper");
const config = require("../../config");
const { streamUploadToCloudinary } = require("../../appUtils");
const mailHandler = require("../../commonHandler/mailHandler");

// let mailSent:Boolean;
// User signup
async function signupUser(usrDetails) {
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
		// corporate_confirmation_mail(usrDetails.email, token);

		let corpDoc = usrDetails.files;
		if (corpDoc) {
			usrDetails.corpDoc = await streamUploadToCloudinary(corpDoc.data);
			// const resultTemp = await cloudinary.uploader.upload(corpDoc.tempFilePath);
			// usrDetails.corpDoc = resultTemp.secure_url;
		}
		const data = await userDao.registerUser(usrDetails);
		if (data) {
			corporate_signup_mail(usrDetails);
			return userMapper.registerMapping(data._id);
		}
	} catch (err) {
		return err;
	}
}

//kk
async function corporate_signup_mail(corpDetails) {
	try {
		let mailTemplate = await mailHandler.getMailTemplate("CORPORATE_SIGN_UP");
		let Intro = mailTemplate.description;
		const html = mailHandler.mailGenHTML({
			name: corpDetails.firstName + " " + corpDetails.lastName,
			intro: Intro,
		});

		// send mail
		mailHandler.sendMail({
			to: corpDetails.email,
			subject: mailTemplate.subject,
			html,
		});

	} catch (err) {
		return err;
	}
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

function send_mail(email, token) {
	sendgridTransport.setApiKey(config.API_SECRET);
	let mailOptions = {
		to: email,
		from: "jeena.varghese@codezeros.com",
		subject: "Reset Password ",
		html: `
        <P>You requested a password reset</P>
        <P>Click this <a href="http://localhost:4000/auth/reset-password/${token}">link</a> to set a new password.</P>
        `,
	};

	sendgridTransport.send(mailOptions).catch((e) => {
		console.log("error", e);
	});
}

// Forgot password
async function forgot_password(email) {
	try {
		// find user in db
		const user = await userDao.checkIfUserExist(email);
		if (!user || user.isDeleted || (!user.isActive && !user.isFirstLogin)) {
			return userMapper.responseMapping(
				corporateAdminConstants.CODE.Unauthorized,
				corporateAdminConstants.MESSAGES.UserNotExist
			);
		}

		//Generate and set password reset token
		user.generatePasswordReset();
		// save reset password token and expire time in db
		await user.save();
		// mail body html
		let mailTemplate = await mailHandler.getMailTemplate("CORPORATE_FORGOT_PASSWORD");
		const html = mailHandler.mailGenHTML({
			name: user.firstName + " " + user.lastName,
			intro: mailTemplate.description,
			action: {
				instructions: corporateAdminConstants.MAIL_MESSAGE.FORGOT_PSWD_BTN_MSG,
				button: {
					color: "#22BC66", // Optional action button color
					text: corporateAdminConstants.MAIL_MESSAGE.FORGOT_PSWD_BTN_TEXT,
					link: `${cfg.RESET_PSWD_CORPORATE_URL}?reset=${user.resetPasswordToken}`,
				},
			},
		});

		// send mail
		mailHandler.sendMail({
			to: user.email,
			subject: mailTemplate.subject,
			html,
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
		const password = await appUtils.convertPass(data.new_password);
		const updateData = {
			userId: user._id,
			password,
			isFirstLogin: false,
			isActive: true,
			returnNewDocument: true,
			resetPasswordToken: "",
			resetPasswordExpires: 0,
		};
		const result = await userDao.reset_password(updateData);
		if (result) {
			// mail body html
			let mailTemplate = await mailHandler.getMailTemplate("CORPORATE_RESET_PASSWORD");
			const html = mailHandler.mailGenHTML({
				name: user.firstName + " " + user.lastName,
				intro: mailTemplate.description,
			});

			// send mail
			mailHandler.sendMail({
				to: user.email,
				subject: mailTemplate.subject,
				html,
			});
			return userMapper.passwordChanged();
		}
	} catch (err) {
		console.log(err);
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
						from: "users",
						localField: "employeeId",
						foreignField: "_id",
						as: "employeeDetails",
					},
				},
				{ $unwind: "$employeeDetails" },
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
						firstTimeCost: 1,
						totalOrderCost: 1,
						// recurringPaymentPending: 1,
						createdAt: 1,
						"products._id": 1,
						"products.product_name": 1,
						"products.product_description": 1,
						"products.product_image": 1,
						"products.ros_code": 1,
						"products.ros_cost": 1,
						"products.firstTimeCost": 1,
						"employeeDetails.firstName": 1,
						"employeeDetails.lastName": 1,
						"employeeDetails.employeeId": 1,
						"employeeDetails.licenseId": 1,
						"employeeDetails.email": 1,
					},
				},
				{ $sort: { createdAt: -1 } },
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
				corporateAdminConstants.CODE.Success,
				corporateAdminConstants.MESSAGES.Employee_Orders,
				empOrderDetail
			);
		})
		.catch((err) => {
			console.log(err)
			return userMapper.responseMapping(
				corporateAdminConstants.CODE.INTRNLSRVR,
				corporateAdminConstants.MESSAGES.internalServerError
			);
		});
}

function employeeOrdersEditById(id, data) {
	try {
		return userDao
			.updateEmpOrders(id, data)
			.then(async (data) => {
				let empDetail = await getEmployeeById(id);
				if (order.status == "confirmed") {
					let Intro = "Your order has been confirmed!";
					const html = mailHandler.mailGenHTML({
						name: empDetail.data.firstName + " " + empDetail.data.lastName,
						intro: Intro,
					});

					// send mail
					mailHandler.sendMail({
						to: empDetail.data.email,
						subject: corporateAdminConstants.MESSAGES.ORDER,
						html,
					});
				}
				if (order.status == "rejected") {
					let Intro = "Your order has been rejected!";
					const html = mailHandler.mailGenHTML({
						name: empDetail.data.firstName + " " + empDetail.data.lastName,
						intro: Intro,
					});

					// send mail
					mailHandler.sendMail({
						to: empDetail.data.email,
						subject: corporateAdminConstants.MESSAGES.ORDER_CANCEL,
						html,
					});
				}
				return userMapper.responseMappingData(
					corporateAdminConstants.CODE.Success,
					corporateAdminConstants.MESSAGES.Employee_Orders_Update,
					data
				);
			})
			.catch((err) => {
				return userMapper.responseMapping(
					corporateAdminConstants.CODE.INTRNLSRVR,
					corporateAdminConstants.MESSAGES.internalServerError
				);
			})
			.catch((err) => {
				return userMapper.responseMapping(
					corporateAdminConstants.CODE.INTRNLSRVR,
					corporateAdminConstants.MESSAGES.internalServerError
				);
			});
	} catch (err) {
		return err;
	}
}

function getEmployeeNames(id) {
	try {
		return userDao
			.getEmployeeNames(id)
			.then((data) => {
				return userMapper.responseMappingData(
					corporateAdminConstants.CODE.Success,
					"Employee list success",
					data
				);
			})
			.catch((err) => {
				return userMapper.responseMapping(
					corporateAdminConstants.CODE.INTRNLSRVR,
					corporateAdminConstants.MESSAGES.internalServerError
				);
			});
	} catch (err) {
		return err;
	}
}
function getEmployeeById(id) {
	try {
		return userDao.employeeById(id).then((data) => {
			return userMapper.responseMappingData(
				corporateAdminConstants.CODE.Success,
				"Employee list success",
				data
			);
		});
	} catch (err) {
		return err;
	}
}
async function confirmEmployeeOrders(orders, update) {
	try {
		let result = await userDao.createFirstInvoice(orders, update);
		if (result) {
			return userDao
				.confirmEmployeeOrders(orders, update)
				.then((data) => {
					return userMapper.responseMapping(
						corporateAdminConstants.CODE.Success,
						"Order Payment Success."
					);
				})
				.catch((err) => {
					return userMapper.responseMapping(
						corporateAdminConstants.CODE.INTRNLSRVR,
						corporateAdminConstants.MESSAGES.internalServerError
					);
				});
		}
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.INTRNLSRVR,
			corporateAdminConstants.MESSAGES.internalServerError
		);
	} catch (err) {
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.INTRNLSRVR,
			corporateAdminConstants.MESSAGES.internalServerError
		);
	}
}

async function getInvoiceList(query, batch, limit) {
	try {
		return userDao
			.getInvoiceList(query, batch, limit)
			.then((data) => {
				return userMapper.responseMappingList(
					corporateAdminConstants.CODE.Success,
					"Invoice list Success.",
					data
				);
			})
			.catch((err) => {
				console.log(err);
				return userMapper.responseMapping(
					corporateAdminConstants.CODE.INTRNLSRVR,
					corporateAdminConstants.MESSAGES.internalServerError
				);
			});
	} catch (err) {
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.INTRNLSRVR,
			corporateAdminConstants.MESSAGES.internalServerError
		);
	}
}

async function recurringInvoicePayment(data) {
	try {
		let result = await userDao.recurringInvoicePaymentUpdate(data);
		if (result) {
			return userDao
				.addOrderPaypalDetails(data)
				.then((data) => {
					return userMapper.responseMapping(
						corporateAdminConstants.CODE.Success,
						"Order Payment Success."
					);
				})
				.catch((err) => {
					return userMapper.responseMapping(
						corporateAdminConstants.CODE.INTRNLSRVR,
						corporateAdminConstants.MESSAGES.internalServerError
					);
				});
		}
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.INTRNLSRVR,
			corporateAdminConstants.MESSAGES.internalServerError
		);
	} catch (err) {
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.INTRNLSRVR,
			corporateAdminConstants.MESSAGES.internalServerError
		);
	}
}
async function sendMail(employee, corporate) {
	try {
		const employeeDetails = await userDao.getEmployeeDetails(employee);
		if (employeeDetails) {
			sendgridTransport.setApiKey(config.cfg.API_SECRET);
			let mailOptions = {
				to: employeeDetails.email,
				from: config.cfg.FROM_EMAIL,
				subject: corporateAdminConstants.MESSAGES.WELCOME,
				html: `
					<P>Hello ${employeeDetails.firstName}  ${employeeDetails.lastName}</P>
					<p> We welcome you to ROS <br> Your email is ${employeeDetails.email} and password ${employeeDetails.password} </p>
					<P>Click this <a href=${config.cfg.clientUrl}>link</a> to Login to ROS APP.</P>
					<p>Thanks</p>
					<p>ROS Team</p>
				`,
			};

			return sendgridTransport.send(mailOptions).then(() => {
				return userMapper.responseMapping(
					corporateAdminConstants.CODE.Success,
					corporateAdminConstants.MESSAGES.Mail_SENT
				);
			})
				.catch(err => {
					console.log(err);
					return userMapper.responseMapping(
						corporateAdminConstants.CODE.INTRNLSRVR,
						corporateAdminConstants.MESSAGES.INTRNLSRVR
					);
				});
		}
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.INTRNLSRVR,
			corporateAdminConstants.MESSAGES.INTRNLSRVR
		);
	} catch (err) {
		console.log(err)
		return err;
	}

}
async function sendOrderToVendor(vendorDetails) {
	try {
		// mail body html
		let mailTemplate = await mailHandler.getMailTemplate("SEND_ORDER_TO_VENDOR");

		let address = vendorDetails.address;
		let Intro = mailTemplate.description + "<br />";
		let orderTable = [
			"<table><thead><th>Product Code</th><th>Product Name</th></thead><tbody>"
		]
		vendorDetails.orderDetails.forEach(order => {
			orderTable.push(`<tr><td>${order.product_code}</td><td>${order.product_name}</td></tr>`)
		})
		orderTable.push("</tbody></table>");
		Intro += orderTable.join("");

		Intro += "<br/><p>Delivery address:- </p>";
		Intro += `
			Street Address: ${address.delivery_address},<br/>
			City: ${address.city},<br/>
			State: ${address.state},<br/>
			Country: ${address.country},<br/>
			Pincode: ${address.pincode}.
		`;

		const html = mailHandler.mailGenHTML({
			name: vendorDetails.vendorName,
			intro: Intro,
		});

		// send mail
		mailHandler.sendMail({
			to: vendorDetails.vendorEmail,
			subject: mailTemplate.subject,
			html,
		});
		return userMapper.responseMapping(
			corporateAdminConstants.CODE.Success,
			corporateAdminConstants.MESSAGES.Mail_SENT
		);
	} catch (err) {
		console.log(err)
		return err;
	}
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
	sendMail,
	getEmployeeById,
	sendOrderToVendor,
};
