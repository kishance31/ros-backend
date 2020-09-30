const config = require("../../config");
const adminDao = require("./adminDao");
const adminMapper = require("./adminMapper");
const adminConstants = require("./adminConstants");
const mongoose = require('mongoose');

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
    let corpDoc = usrDetails.files;
    const exist = await adminDao.checkIfExist(usrDetails);

    if (exist) {
      return adminMapper.responseMapping(
        adminConstants.CODE.Success,
        adminConstants.MESSAGES.userExist
      );
    }

    // Initialized
    usrDetails.role = "ADMIN";
    usrDetails.isActive = true;

    if (typeof corpDoc != "undefined" && corpDoc != null) {
      if (typeof corpDoc != "undefined") {
        var str = corpDoc.name;
        corpDoc.name = str.replace(/\s/g, "_");
        await uploadImage(corpDoc).then((result) => {
          usrDetails.corpDoc = result;
        });
      } else {
        usrDetails.corpDoc = "";
      }
    }
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
    return adminDao
      .updateUser(userId, updateUserObj)
      .then((data) => {
        return adminMapper.responseMappingData(
          adminConstants.CODE.Success,
          adminConstants.MESSAGES.AdminUpdate,
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

async function updateAdminStatus(userObj) {

    try {
        const exist = await adminDao.checkIfExist({id: userObj._id});
        if (!exist) {
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserNotExist);
        }

        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false,
        }

        return adminDao.updateUser(userObj.adminId, {isActive: userObj.isActive}, options).then((data) => {
            return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.StatusUpdated, {isActive: data.isActive})

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
async function adminList(id) {
    try {

        const exist = await adminDao.checkIfExist({id});
        if (!exist) {
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserNotExist);
        }

        let query = {
            role: "ADMIN",
            _id: {"$ne": mongoose.Types.ObjectId(id)}
        };

        return await adminDao.adminList(query).then((data) => {
            return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.UserListed, data)


        }).catch((err) => {

            console.log({ err })
            return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}

function deleteAdmin(id, updateUserObj) {
    try {
        return adminDao.deleteAdmin(id, updateUserObj).then((data) => {
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserDeleted)

        }).catch((err) => {
            return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)


        })
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

// function getEmpOrderDetails() {
//   let agrgegateQuery = [
  

//     {
//       $lookup: {
//         from: "users",
//         localField: "corporateId",
//         foreignField: "_id",
//         as: "corporateAdminDetails",
//       },
//     },
//     {
//       $group: {
//         _id: "$corporateId",
//         corporateId: { $addToSet: "$corporateId" },
//         products: { $addToSet: "$products" },
//         employeeId: { $addToSet: "$employeeId" },
//       },
//     },
//     {
//       $lookup: {
//         from: "users",
//         localField: "employeeId",
//         foreignField: "_id",
//         as: "employeeDetails",
//       },
//     },
//     {
//       $lookup: {
//         from: "products",
//         localField: "products",
//         foreignField: "_id",
//         as: "productDetails",
//       },
//     },
//     // {
//     //   $group: {
//     //     _id: "$_id",
        
//     //     "admin_name":{ $addToSet : "$corporateAdminDetails"}
      
//     //   },
//     // },
//     {
//       $project: {
//         "corporateAdminDetails.firstName": 1,
//         "corporateAdminDetails.lastName": 1,
//         "employeeDetails.firstName": 1,
//         "employeeDetails.lastName": 1,
//         "productDetails.product_name": 1,
//         "productDetails.product_cost": 1,
//         "productDetails.first_three_month_cost": 1,
//       },
//     },
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
//         console.log('eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',err)
//       return adminMapper.responseMapping(
//         adminConstants.CODE.INTRNLSRVR,
//         adminConstants.MESSAGES.internalServerError
//       );
//     });
// }
function getEmpOrderDetails(req) {
  //   let agrgegateQuery = [

  //       { $unwind : "$products" },
  //     {
  //         $lookup: {
  //             from: "products",
  //             localField: "products",
  //             foreignField: "_id",
  //             as: "productDetails",
  //         },
  //     },
  //     // { $unwind : "$corporateId" },

  //     // {
  //     //     $lookup: {
  //     //         from: "users",
  //     //         localField: "corporateId",
  //     //         foreignField: "_id",
  //     //         as: "corporateAdminDetails",
  //     //     },
  //     // },

  //     //   { $unwind : "$employeeId" },
  //     // {
  //     //     $lookup: {
  //     //         from: "users",
  //     //         localField: "employeeId",
  //     //         foreignField: "_id",
  //     //         as: "employeeDetails",
  //     //     },
  //     // },

  //     // {
  //     //     $project: {
  //     //         "corporateAdminDetails.firstName": 1,
  //     //         "corporateAdminDetails.lastName": 1,
  //     //         "employeeDetails.firstName": 1,
  //     //         "employeeDetails.lastName": 1,
  //     //         "productDetails.product_name": 1,
  //     //         "productDetails.product_cost": 1,
  //     //         "productDetails.first_three_month_cost": 1

  //     //     }
  //     // }
  // ]

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

    // { $unwind : { path : "$orderDetails",preserveNullAndEmptyArrays:true} },

    // { $unwind : { path : "$orderDetails.products",preserveNullAndEmptyArrays:true} },
    {
      $lookup: {
          from: "orders",
          localField: "employeeDetails._id",
          foreignField: "employeeId",
          as: "employeeDetails.orderDetails",
      },
    },
    { $unwind : { path : "$employeeDetails.orderDetails",preserveNullAndEmptyArrays:true} },
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
          "orderDetails": { "$addToSet": "$employeeDetails.orderDetails" },
          employeeDetails: { $addToSet: "$employeeDetails" },
          "orderDetails": { "$addToSet": "$employeeDetails.orderDetails" },
          // "productDetails": { "$push": "$productDetails" }
        },
      },

    // {
    //   $project: {
    //     firstName: 1,
    //     lastName: 1,
    //     "employeeDetails.firstName": 1,
    //     "employeeDetails.lastName": 1,
    //     "productDetails.product_name": 1,
    //     "productDetails.product_cost": 1,
    //     "productDetails.first_three_month_cost": 1,
    //     "orderDetails.address": 1,
    //     "orderDetails.invoiceNo": 1,
    //     "orderDetails.deliveryStatus": 1,
    //   },
    // },
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
  employeeOrdersEditById,
  logout
};
