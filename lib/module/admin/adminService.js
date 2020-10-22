const config = require("../../config");
const adminDao = require("./adminDao");
const adminMapper = require("./adminMapper");
const adminConstants = require("./adminConstants");
const mongoose = require('mongoose');
const { cfg } = require('../../config');
const mailHandler = require('../../commonHandler/mailHandler');
const appUtil = require("../../appUtils");

async function createdefaultAdmin() {
	logger.info(`default admin data`, config.cfg.DEFAULT_ADMIN_USER);

	const exist = await adminDao.checkIfExist(config.cfg.DEFAULT_ADMIN_USER);
	if (exist) {
		return adminMapper.userExist();
	}

	const data = await adminDao.createDefaultAdminUser(config.cfg.DEFAULT_ADMIN_USER);
	await createDefaultAdminForms();
	if (data) {
		return adminMapper.registerMapping(data._id);
	}
}

async function createDefaultAdminForms() {
	logger.info(`default admin forms data`);
	const data = await adminDao.createDefaultAdminForms({ names: config.cfg.DEFAULT_ADMIN_FORMS, types: config.cfg.ROLE_PERMISSIONS });
	if (data) {
		return adminMapper.registerMapping(data._id);
	}
}

async function isUserExist(details) {
	return await adminDao.checkIfExist(details);
};

/**
 * update status of corporate admin
 *
 * @async
 * @desc manage corporater-admin account status
 *
 * @param {string} userId - corporaterUserId
 * @param {string} status - account-status
 * 
 * @returns {responseHandler<success/reject>}
 */
async function updateCorporateAdminStatus(id, _corporateUserId, _status) {
	try {
		const exist = await adminDao.checkIfExist({ id });
		if (!exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.UserNotExist);
		}

		let result = await adminDao.updateCorporateStatus(_corporateUserId, _status);
		if (result) {
			// mail body html
			let Intro = ""
			if (_status === "APPROVED") {
				Intro = "Congratulations!" + adminConstants.MAIL_MESSAGE.STATUS_CHANGED_APPROVED
			} if (_status === "REJECTED") {
				Intro = adminConstants.MAIL_MESSAGE.STATUS_CHANGED_REJECTED
			}
			const html = mailHandler.mailGenHTML({
				name: result.firstName + " " + result.lastName,
				intro: Intro
			});

			// send mail
			mailHandler.sendMail({
				to: result.email,
				subject: adminConstants.MAIL_MESSAGE.STATUS_SUB,
				html
			});
			return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.StatusUpdated);
		}
		return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.StatusUpdatedError);
	} catch (error) {
		return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.StatusUpdatedError);
	}
}

async function loginUser(data) {
	return await adminDao.login(data);
}

async function logout(data) {
	return await adminDao.logout(data);
}

// User signup
async function signupUser(usrDetails) {
	logger.debug(`Inside signup admin services`);
	try {
		// let corpDoc = usrDetails.files;
		const exist = await adminDao.checkIfExist(usrDetails);

		if (exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.userExist);
		}

		const roleExists = await adminDao.checkRoleExists(usrDetails.roleName);
		if (!roleExists) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.incorrectRoleName)
		}
		usrDetails.roleName = roleExists._id;

		// Initialized
		usrDetails.role = "ADMIN";
		usrDetails.isActive = true;

		// if (typeof corpDoc != "undefined" && corpDoc != null) {
		//   if (typeof corpDoc != "undefined") {
		//     var str = corpDoc.name;
		//     corpDoc.name = str.replace(/\s/g, "_");
		//     await uploadImage(corpDoc).then((result) => {
		//       usrDetails.corpDoc = result;
		//     });
		//   } else {
		//     usrDetails.corpDoc = "";
		//   }
		// }
		const data = await adminDao.saveAdmin(usrDetails);
		if (data) {
			//SuccessfullyRegistered
			return adminMapper.responseMapping(
				adminConstants.CODE.Success,
				adminConstants.MESSAGES.SuccessfullyRegistered
			);
		}
	} catch (err) {
		return err;
	}
}

async function updateUser(userId, updateUserObj) {
	try {
		const exist = await adminDao.checkIfExist({ id: userId });
		if (!exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.UserNotExist);
		}
		const options = {
			returnNewDocument: false,
			returnOriginal: false,
			upsert: false,
		}
		return adminDao.updateUser(userId, updateUserObj, options)
			.then((data) => {
				return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.AdminUpdate)
			}).catch((err) => {
				console.log(err)
				return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)
			});
	} catch (err) {
		logger.warn(err);
		return err;
	}
}

async function updateAdminStatus(userObj) {

	try {
		const exist = await adminDao.checkIfExist({ id: userObj._id });
		if (!exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserNotExist);
		}

		const options = {
			returnNewDocument: true,
			returnOriginal: false,
			upsert: false,
		}

		return adminDao.updateUser(userObj.adminId, { isActive: userObj.isActive }, options).then((data) => {
			return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.StatusUpdated, { isActive: data.isActive })

		}).catch((err) => {
			return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)
		})
	} catch (err) {
		return err;
	}
}

function getAdminById(id) {
	try {
		return adminDao.adminById(id).then((data) => {
			return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.UserById, data)

		}).catch((err) => {
			return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)

		})
	} catch (err) {
		return err;
	}

}
async function adminList(id, batch, limit) {
	try {

		const exist = await adminDao.checkIfExist({ id });
		if (!exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserNotExist);
		}

		let query = {
			role: "ADMIN",
			_id: { "$ne": mongoose.Types.ObjectId(id) },
			isDeleted: false,
		};

		return await adminDao.adminList(query, batch, limit).then((data) => {
			return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.UserListed, data)


		}).catch((err) => {
			console.log({ err })
			return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGE.internalServerError)
		})
	} catch (err) {
		return err;
	}

}

async function deleteAdmin(id, userId) {
	try {
		const exist = await adminDao.checkIfExist({ id: userId });
		if (!exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserNotExist);
		}
		return adminDao.deleteAdmin(id)
			.then((data) => {
				return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserDeleted)
			}).catch((err) => {
				return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)
			});
	} catch (err) {
		return err;
	}
}

async function uploadImage(image) {
	let filename = image.name;
	await image.mv("./uploads/" + filename, function (err) {
		if (err) {
			return err;
		}
	});
	return filename;
}

function getEmpOrderDetails() {
	return adminDao
		.getOrdersByCorporateDetails()
		.then((empOrderDetail) => {
			return adminMapper.responseMappingData(
				adminConstants.CODE.Success,
				adminConstants.MESSAGES.Employee_Orders,
				empOrderDetail
			);
		})
		.catch((err) => {
			console.log(err)
			return adminMapper.responseMapping(
				adminConstants.CODE.INTRNLSRVR,
				adminConstants.MESSAGES.internalServerError
			);
		});

	//   let agrgegateQuery = [
	//     {
	//       $match: {
	//         role: "CORPORATE_ADMIN",
	//       },
	//     },
	//     { $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true } },
	//     {
	//       $lookup: {
	//         from: "users",
	//         localField: "_id",
	//         foreignField: "corporate_admin_id",
	//         as: "employeeDetails",
	//       },
	//     },

	//     { $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true } },

	//     {
	//       $lookup: {
	//           from: "orders",
	//           localField: "employeeDetails._id",
	//           foreignField: "employeeId",
	//           as: "employeeDetails.orderDetails",
	//       },
	//     },
	//     { $unwind : { path : "$employeeDetails.orderDetails",preserveNullAndEmptyArrays:true} },
	//     {
	//         $lookup: {
	//             from: "products",
	//             localField: "employeeDetails.orderDetails.products",
	//             foreignField: "_id",
	//             as: "employeeDetails.orderDetails.productDetails",
	//         },

	//     },

	//     {
	//         $group: {
	//           _id: "$_id",
	//           firstName: { $first: "$firstName" },
	//           lastName: { $first: "$lastName" },
	//           employeeName: { $first: "$employeeDetails.firstName" },
	//           employeeDetails: { $addToSet: "$employeeDetails" },

	//         },
	//       },


	//   ];
	//   return adminDao
	//     .aggregate(agrgegateQuery)
	//     .then((empOrderDetail) => {
	//       return adminMapper.responseMappingData(
	//         adminConstants.CODE.Success,
	//         adminConstants.MESSAGES.Employee_Orders,
	//         empOrderDetail
	//       );
	//     })
	//     .catch((err) => {
	//       return adminMapper.responseMapping(
	//         adminConstants.CODE.INTRNLSRVR,
	//         adminConstants.MESSAGES.internalServerError
	//       );
	//     });
}

function getEmpInvoiceDetails() {
	let agrgegateQuery = [
		{
			$match: {
				role: "CORPORATE_ADMIN",
			},
		},
		{ $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true } },
		{
			$lookup: {
				from: "users",
				localField: "_id",
				foreignField: "corporate_admin_id",
				as: "employeeDetails",
			},
		},

		{ $unwind: { path: "$employeeDetails", preserveNullAndEmptyArrays: true } },

		{
			$lookup: {
				from: "orders",
				localField: "employeeDetails._id",
				foreignField: "employeeId",
				as: "employeeDetails.orderDetails",
			},
		},
		{ $unwind: { path: "$employeeDetails.orderDetails", preserveNullAndEmptyArrays: true } },
		{
			$lookup: {
				from: "products",
				localField: "employeeDetails.orderDetails.products",
				foreignField: "_id",
				as: "employeeDetails.orderDetails.productDetails",
			},

		},

		{
			$group: {
				_id: "$_id",
				firstName: { $first: "$firstName" },
				lastName: { $first: "$lastName" },
				employeeName: { $first: "$employeeDetails.firstName" },
				employeeDetails: { $addToSet: "$employeeDetails" },

			},
		},


	];
	return adminDao
		.aggregate(agrgegateQuery)
		.then((empOrderDetail) => {
			return adminMapper.responseMappingData(
				adminConstants.CODE.Success,
				adminConstants.MESSAGES.Employee_Orders,
				empOrderDetail
			);
		})
		.catch((err) => {
			return adminMapper.responseMapping(
				adminConstants.CODE.INTRNLSRVR,
				adminConstants.MESSAGES.internalServerError
			);
		});
}

async function getCorporateOrderInvoice(isReccuring, batch, limit) {
	try {
		return adminDao
			.getCorporateOrderInvoice(isReccuring, batch, limit)
			.then((data) => {
				return adminMapper.responseMappingList(
					adminConstants.CODE.Success,
					"Invoice list Success.",
					data
				);
			})
			.catch((err) => {
				console.log(err);
				return userMapper.responseMapping(
					adminConstants.CODE.INTRNLSRVR,
					adminConstants.MESSAGES.internalServerError
				);
			});
	} catch (err) {
		return userMapper.responseMapping(
			adminConstants.CODE.INTRNLSRVR,
			adminConstants.MESSAGES.internalServerError
		);
	}
}

async function getCorporateUsers(userId, batch, limit) {
	try {
		const exist = await adminDao.checkIfExist({ id: userId });
		if (!exist) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.UserNotExist);
		}

		let result = await adminDao.getCorporateUsers(batch, limit);
		if (result) {
			return adminMapper.responseMappingList(adminConstants.CODE.Success, adminConstants.MESSAGES.corporateListSuccess, result);
		}
		return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.corporateListError)
	} catch (error) {
		return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.corporateListError)
	}
}

function employeeOrdersEditById(id, data) {
	try {
		return adminDao
			.updateEmpOrders(id, data)
			.then((data) => {
				return adminMapper.responseMappingData(
					adminConstants.CODE.Success,
					adminConstants.MESSAGES.Employee_Orders_Update,
					data
				);
			})
			.catch((err) => {
				return adminMapper.responseMapping(
					adminConstants.CODE.INTRNLSRVR,
					adminConstants.MESSAGES.internalServerError
				);
			});
	} catch (err) {
		return err;
	}
}
function corporateEditById(id, data) {
	try {
		return adminDao
			.updateCorpStatus(id, data)
			.then((data) => {
				return adminMapper.responseMappingData(
					adminConstants.CODE.Success,
					adminConstants.MESSAGES.Corporate_Status,
					data
				);
			})
			.catch((err) => {
				return adminMapper.responseMapping(
					adminConstants.CODE.INTRNLSRVR,
					adminConstants.MESSAGES.internalServerError
				);
			});
	} catch (err) {
		return err;
	}
}
const forgotPassword = async (email) => {
	try {
		// find user in db
		const user = await adminDao.checkIfExist({ email });
		if (!user) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.UserNotExist);
		}

		//Generate and set password reset token
		user.generatePasswordReset();
		// save reset password token and expire time in db
		await user.save();

		// mail body html
		const html = mailHandler.mailGenHTML({
			name: user.firstName + " " + user.lastName,
			intro: adminConstants.MAIL_MESSAGE.FORGOT_PSWD,
			action: {
				instructions: adminConstants.MAIL_MESSAGE.FORGOT_PSWD_BTN_MSG,
				button: {
					color: '#22BC66', // Optional action button color
					text: adminConstants.MAIL_MESSAGE.FORGOT_PSWD_BTN_TEXT,
					link: `${cfg.RESET_CLIENT_URL}?reset=${user.resetPasswordToken}`
				}
			}
		});

		// send mail
		mailHandler.sendMail({
			to: user.email,
			subject: adminConstants.MAIL_MESSAGE.FORGOT_PSWD_SUB,
			html
		});

		// send response to user
		return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.mailSuccess);

	} catch (error) {
		// error send exception
		return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.mailError);
	}
}

const resetPassword = async ({ resetToken, newPassword }) => {
	try {
		// find user in db
		const user = await adminDao.findByResetToken(resetToken);
		if (!user) {
			return adminMapper.responseMapping(adminConstants.CODE.Unauthorized, adminConstants.MESSAGES.resetTokenInValid);
		}
		user.password = await appUtil.convertPass(newPassword);
		user.resetPasswordToken = "";
		user.resetPasswordExpires = 0;
		await user.save();

		// send response to user
		return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.resetPasswordSuccess);

	} catch (error) {
		// error send exception
		return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.resetPasswordError);
	}
}

module.exports = {
	createdefaultAdmin,
	isUserExist,
	loginUser,
	signupUser,
	updateUser,
	getAdminById,
	updateAdminStatus,
	adminList,
	deleteAdmin,
	getEmpOrderDetails,
	getEmpInvoiceDetails,
	employeeOrdersEditById,
	corporateEditById,
	logout,
	getCorporateUsers,
	updateCorporateAdminStatus,
	forgotPassword,
	resetPassword,
	getCorporateOrderInvoice,
}