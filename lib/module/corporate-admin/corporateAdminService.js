"use strict";

const crypto = require("crypto");
const mongoose = require("mongoose");
const _ = require("lodash");
const sendgridTransport = require("@sendgrid/mail");
const userDao = require("./corporateAdminDao");
const corpAdminConstants = require("./corporateAdminConstants");
const appUtils = require("../../appUtils");
const userMapper = require("./corporateAdminMapper");
const config = require("../../config");
const jwtHandler = require("./../../commonHandler/jwtHandler");
const { streamUploadToCloudinary } = require("../../appUtils");
const responseHandler = require("./../../commonHandler/responseHandler");
const mailHandler = require('../../commonHandler/mailHandler');

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
    usrDetails.isActive = false;

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
function corporate_signup_mail(corpDetails) {
  try {
    // sendgridTransport.setApiKey(config.API_SECRET);
    // let mailOptions = {
    //   to: corpDetails.email,
    //   from: "jeena.varghese@codezeros.com",
    //   subject: corpAdminConstants.MESSAGES.SIGNUP,
    //   html: `
	//   <P>Hello ${corpDetails.firstName}  ${corpDetails.lastName}</P>
	//   <p> Thank you for registering with us as your profile has been successfully sent for Verification! </p>
	//   <p>Thanks & Regards</p>
	//   <p>ROS Team</p>`,
	// };
	let Intro ="Thank you for registering with us as your profile has been successfully sent for Verification!"
	const html = mailHandler.mailGenHTML({
		name: corpDetails.firstName + " " + corpDetails.lastName,
		intro: Intro
	});

	// send mail
	mailHandler.sendMail({
		to: corpDetails.email,
		subject: corpAdminConstants.MESSAGES.SIGNUP,
		html
	});
    // sendgridTransport.send(mailOptions).then(() => {
    //   console.log("Message sent123");
    //   //  userMapper.responseMapping()
    // });
  } catch (err) {
    return err;
  }
  
}
// Send mail
function corporate_confirmation_mail(email, token) {
  sendgridTransport.setApiKey(config.API_SECRET);
  const url = `http://localhost:4000/confirmation/${token}`;
  let mailOptions = {
    to: email,
    from: "jeena.varghese@codezeros.com",
    subject: "Corporate Profile Request",
    html: `
            <P>Thank you for your registration, <a href='${url}'> Register Here </a>After admin approval you will be able to login into your account </P>
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
async function forgot_password(details) {
  try {
    const resetToken = await jwtHandler.genUsrToken({
      user_id: details._id,
      email: details.email,
    });
    const resetTokenExpiration = Date.now() + 3600000;
    const query = {
      email: details.email,
      resetToken,
      resetTokenExpiration,
      returnNewDocument: false,
      resetTokenIsUsed: false,
    };
    await userDao.updateUser(query, details._id);
    send_mail(details.email, resetToken);
    return userMapper.emailSent();
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
    const user = await userDao.checkIfExist(data);
    if (!user) {
      return userMapper.resetTokenExpireOrNotFound();
    }
    if (user.resetTokenIsUsed) {
      return userMapper.linkAlreadyUsed();
    }
    const newPassword = await appUtils.convertPass(data.password);
    const updateData = {
      userId: user._id,
      newPassword,
      returnNewDocument: true,
      resetTokenIsUsed: true,
      isFirstLogin: false,
    };
    const result = await userDao.reset_password(updateData);
    if (result) {
      return userMapper.passwordChanged();
    }
  } catch (err) {
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

  let agrgegateQuery = [
    {
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
          { $limit: limit },
        ],
        total: [{ $match: query }, { $count: "count" }],
      },
    },
  ];

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
      console.log(err);
      return userMapper.responseMapping(
        corpAdminConstants.CODE.INTRNLSRVR,
        corpAdminConstants.MESSAGES.internalServerError
      );
    });
}

 function employeeOrdersEditById(id, order) {
  try {
    return userDao
      .updateEmpOrders(id, order)
      .then(async(data1) => {
		  let empDetail = await getEmployeeById(id)
		  console.log('11111111111111111111111111111111111',order)

		  if(order.status == 'confirmed'){
			let Intro ="Your order has been confirmed!"
			const html = mailHandler.mailGenHTML({
				name: empDetail.data.firstName + " " + empDetail.data.lastName,
				intro: Intro
			});
		
			// send mail
			mailHandler.sendMail({
				to: empDetail.data.email,
				subject: corpAdminConstants.MESSAGES.ORDER,
				html
			});
		  }
		  if(order.status == 'rejected'){
			let Intro ="Your order has been rejected!"
			const html = mailHandler.mailGenHTML({
				name: empDetail.data.firstName + " " + empDetail.data.lastName,
				intro: Intro
			});
		
			// send mail
			mailHandler.sendMail({
				to: empDetail.data.email,
				subject: corpAdminConstants.MESSAGES.ORDER_CANCEL,
				html
			});
		  }

        return userMapper.responseMappingData(
          corpAdminConstants.CODE.Success,
          corpAdminConstants.MESSAGES.Employee_Orders_Update,
          data
        );
      })
      .catch((err) => {
        return userMapper.responseMapping(
          corpAdminConstants.CODE.INTRNLSRVR,
          corpAdminConstants.MESSAGES.internalServerError
        );

        sendgridTransport.send(mailOptions).then(() => {
          console.log("Message sent");
          //  userMapper.responseMapping()
        });
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
          corpAdminConstants.CODE.Success,
          "Employee list success",
          data
        );
      })
      .catch((err) => {
        return userMapper.responseMapping(
          corpAdminConstants.CODE.INTRNLSRVR,
          corpAdminConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return err;
  }
}
function getEmployeeById(id) {
	try {
	
	  return userDao
		.employeeById(id)
		.then((data) => {
		  return userMapper.responseMappingData(
			corpAdminConstants.CODE.Success,
			"Employee list success",
			data
		  );
		})
		.catch((err) => {
		  return userMapper.responseMapping(
			corpAdminConstants.CODE.INTRNLSRVR,
			corpAdminConstants.MESSAGES.internalServerError
		  );
		});
	} catch (err) {
	  return err;
	}
  }
async function confirmEmployeeOrders(orders, update) {
  try {
    let result = await userDao.createFirstInvoice(orders, update);
	let empDetail = await userDao.getEmployeeById(orders.employeeId);
    if (result) {
      return userDao
        .confirmEmployeeOrders(orders, update)
        .then((data) => {
			// let Intro ="Your order payment is successful!"
			// const html = mailHandler.mailGenHTML({
			// 	name: empDetail.data.firstName + " " + empDetail.data.lastName,
			// 	intro: Intro
			// });
		
			// // send mail
			// mailHandler.sendMail({
			// 	to: empDetail.data.email,
			// 	subject: corpAdminConstants.MESSAGES.PAYMENT,
			// 	html
			// });
          return userMapper.responseMapping(
            corpAdminConstants.CODE.Success,
            "Order Payment Success."
          );
        })
        .catch((err) => {
          return userMapper.responseMapping(
            corpAdminConstants.CODE.INTRNLSRVR,
            corpAdminConstants.MESSAGES.internalServerError
          );
        });
    }
    return userMapper.responseMapping(
      corpAdminConstants.CODE.INTRNLSRVR,
      corpAdminConstants.MESSAGES.internalServerError
    );
  } catch (err) {
    return userMapper.responseMapping(
      corpAdminConstants.CODE.INTRNLSRVR,
      corpAdminConstants.MESSAGES.internalServerError
    );
  }
}

async function getInvoiceList(query, batch, limit) {
  try {
    return userDao
      .getInvoiceList(query, batch, limit)
      .then((data) => {
        return userMapper.responseMappingList(
          corpAdminConstants.CODE.Success,
          "Invoice list Success.",
          data
        );
      })
      .catch((err) => {
        console.log(err);
        return userMapper.responseMapping(
          corpAdminConstants.CODE.INTRNLSRVR,
          corpAdminConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return userMapper.responseMapping(
      corpAdminConstants.CODE.INTRNLSRVR,
      corpAdminConstants.MESSAGES.internalServerError
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
            corpAdminConstants.CODE.Success,
            "Order Payment Success."
          );
        })
        .catch((err) => {
          return userMapper.responseMapping(
            corpAdminConstants.CODE.INTRNLSRVR,
            corpAdminConstants.MESSAGES.internalServerError
          );
        });
    }
    return userMapper.responseMapping(
      corpAdminConstants.CODE.INTRNLSRVR,
      corpAdminConstants.MESSAGES.internalServerError
    );
  } catch (err) {
    return userMapper.responseMapping(
      corpAdminConstants.CODE.INTRNLSRVR,
      corpAdminConstants.MESSAGES.internalServerError
    );
  }
}
async function sendMail(employee, corporate) {
  try {
    const employeeDetails = await userDao.getEmployeeDetails(employee);
    // let SENDGRID_API_KEY =
    //   "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";
    sendgridTransport.setApiKey(config.API_SECRET);
    let mailOptions = {
      to: employeeDetails.email,
      from: "jeena.varghese@codezeros.com",
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
  } catch (err) {
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
  sendMail,
  getEmployeeById
};
