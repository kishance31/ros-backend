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
const { streamUploadToCloudinary } = require('../../appUtils');

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
      return userMapper.registerMapping(data._id);
    }
  } catch (err) {
    return err;
  }
}

// Send mail
function corporate_confirmation_mail(email, token) {
  sendgridTransport.setApiKey(config.cfg.API_SECRET);
  const url = `http://localhost:4000/confirmation/${token}`;
  let mailOptions = {
    to: email,
    from: "shivangi.dubey@codezeros.com",
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

// Forgot password
async function forgot_password(email) {
  try {
		// find user in db
    const user = await userDao.checkIfUserExist(email);
		if (!user) {
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
					link: `${cfg.RESET_CLIENT_URL}?reset=${user.resetPasswordToken}`
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
      resetPasswordToken :"",
      resetPasswordExpires : 0,
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
  if (req.body.employeeId || req.body.status) {
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
        "productDetails._id": 1,
        "productDetails.product_name": 1,
        "productDetails.product_description": 1,
        "productDetails.product_image": 1,
        "productDetails.product_code": 1,
        "productDetails.product_cost": 1,
        "productDetails.first_three_month_cost": 1,
        "employeeDetails.firstName": 1,
        "employeeDetails.lastName": 1,
        "employeeDetails.employeeId": 1,
        "employeeDetails.licenseType": 1,
      },
    },
    
  ];

  return userDao
    .aggregate(agrgegateQuery)
    .then((empOrderDetail) => {
      return userMapper.responseMappingData(
        corpAdminConstants.CODE.Success,
        corpAdminConstants.MESSAGES.Employee_Orders,
        empOrderDetail
      );
    })
    .catch((err) => {
      return userMapper.responseMapping(
        corpAdminConstants.CODE.INTRNLSRVR,
        corpAdminConstants.MESSAGES.internalServerError
      );
    });
}

function employeeOrdersEditById(id, data) {
    try {
        return  userDao.updateEmpOrders(id, data).then((data) => {
            return userMapper.responseMappingData(corpAdminConstants.CODE.Success, corpAdminConstants.MESSAGES.Employee_Orders_Update, data)

        }).catch((err)=>{
            return userMapper.responseMapping(corpAdminConstants.CODE.INTRNLSRVR, corpAdminConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
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
  employeeOrdersEditById
};
