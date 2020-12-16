'use strict';


const employeeDao = require('./employeeDao');
// const ordereDao = require('../../');
const employeeMapper = require('./employeeMapper');
const employeeConstants = require("./employeeConstants");
const licenseServices = require('../licenses/licensesService')
const purchaseLicenseDao = require('../corporate-purchase-license/purchaseLicenseDao');
const appUtils = require('../../appUtils');
const jwtHandler = require('../../commonHandler/jwtHandler');
const mailHandler = require('../../commonHandler/mailHandler');

const mongoose = require('mongoose')
const _ = require('lodash');
// const crypto = require('crypto');

// Chech if user exist
async function isUserExist(details, projection) {
    return await employeeDao.checkIfExist(details, projection);
};

async function checkEmployeeDetails(EmployeeDetails, employeeExists) {
    // check corporate admin exists
    try {
        let randomLicenseId = "";
        const isExist = await isUserExist({ userId: EmployeeDetails.corporate_admin_id });
        if (!isExist) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.userNoPermission);
        }

        // //check license type is correct
        if (!(employeeExists && employeeExists.licenseId.toString() === EmployeeDetails.licenseId) || (employeeExists && employeeExists.isDeleted)) {
            const licenseExists = await licenseServices.decrementLicenseCount({
                corporateId: EmployeeDetails.corporate_admin_id,
                licenseId: mongoose.Types.ObjectId(EmployeeDetails.licenseId),
            }, false);
            if (licenseExists.responseCode !== 201) {
                return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, licenseExists.responseMessage);
            }
            randomLicenseId = licenseExists.data;
        }

        //check branch name is correct
        // if (EmployeeDetails.branchId) {
        //     const branchExists = await employeeDao.checkBranchExists(EmployeeDetails.branchId)
        //     if (!branchExists) {
        //         return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectBranchName);
        //     }
        // }
        return {success: true, randomLicenseId};
    } catch (error) {
        logger.warn(error);
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError);
    }
}

async function employeeAdd(EmployeeDetails) {
    logger.debug(`Inside Employeeservices`);
    try {
        const employeeExists = await employeeDao.employeeById({ email: EmployeeDetails.email }, { __v: 0 });
        if (employeeExists.length) {
            if (!employeeExists[0].isDeleted) {
                return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.emailExists);
            }
        }

        const checkedEmployeeDetails = await checkEmployeeDetails(EmployeeDetails, employeeExists[0])
        if (!checkedEmployeeDetails.success) {
            return checkedEmployeeDetails;
        }
        EmployeeDetails.role = "EMPLOYEE";
        EmployeeDetails.status = "APPROVED";
        EmployeeDetails.isActive = false;
        EmployeeDetails.isDeleted = false;
        EmployeeDetails.isFirstLogin = true;
        EmployeeDetails.address = typeof EmployeeDetails.address === "string" ? JSON.parse(EmployeeDetails.address) : [];
        EmployeeDetails.licenseAssignDate = new Date();
        EmployeeDetails.branchId = EmployeeDetails.branchId || null;
        EmployeeDetails.randomLicenseId = checkedEmployeeDetails.randomLicenseId

        //encrypt password
        // const Password = await appUtils.convertPass(EmployeeDetails.password);
        // EmployeeDetails.password = Password;

        // const buff = await crypto.randomBytes(64);
        // const token = await buff.toString('hex');

        // EmployeeDetails.tokens = token

        //save employee
        return employeeDao.saveEmployee(EmployeeDetails, employeeExists[0]).then((data) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Added)
        }).catch(async (err) => {
            console.log(err)
            await purchaseLicenseDao.addAvailableLicenseCount(
                {
                    corporateId: EmployeeDetails.corporate_admin_id,
                    licenseObj: { [EmployeeDetails.licenseId]: 1 }
                }
            )
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        });
    } catch (err) {
        logger.warn(err)
        return err;
    }
};

async function employeeAddMultiple(EmployeeDetails) {
    logger.debug(`Inside Employeeservices`);
    try {

        let uniqueEmployeeDetails = []
        uniqueEmployeeDetails = Object.values(EmployeeDetails.reduce((acc, cur) => Object.assign(acc, { [cur.email]: cur }), {}))

        //save employee
        var insertobj
        var insertarray = [];
        let isExists = false;
        let permissionDenied;
        let checkedEmployeeDetails = []
        var validationMessage;
        // var isEmployeeExists 
        await Promise.all(uniqueEmployeeDetails.map(async (employee, i) => {
            return new Promise(async function (resolve, reject) {
                checkedEmployeeDetails = await checkEmployeeDetails(employee)
                if (checkedEmployeeDetails == null) {
                    permissionDenied = false
                } else {
                    validationMessage = checkedEmployeeDetails.responseMessage
                    permissionDenied = true
                }

                const employeeExists = await employeeDao.employeeById({ email: employee.email });
                if (employeeExists) {
                    isExists = true;

                } else {

                    //encrypt password
                    const Password = await appUtils.convertPass(employee.password);
                    employee.password = Password;

                    {
                        insertobj = {
                            firstName: employee.firstName,
                            lastName: employee.lastName,
                            email: employee.email,
                            position: employee.position,
                            department: employee.department,
                            address: employee.address ? employee.address : [],
                            mobileNo: employee.mobileNo ? employee.mobileNo : '',
                            employeeId: employee.employeeId,
                            companyName: employee.companyName ? employee.companyName : '',
                            username: employee.username ? employee.username : '',
                            password: employee.password ? employee.password : '',
                            licenseType: employee.licenseType ? employee.licenseType : '',
                            branchName: employee.branchName ? employee.branchName : '',
                            corporate_admin_id: employee.corporate_admin_id,
                            role: employee.role ? employee.role : 'EMPLOYEE',
                            status: employee.status ? employee.status : 'APPROVED',
                            isActive: employee.isActive ? employee.isActive : false,
                            isFirstLogin: employee.isFirstLogin ? employee.isFirstLogin : true


                        }

                        insertarray.push(insertobj)
                    }
                }
                resolve(true);
            })
        }))



        if (isExists) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.emailExists);

        }

        if (permissionDenied) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, validationMessage);


        } else {
            if (insertarray.length > 0) {
                return await employeeDao.saveMultipleEmployees(insertarray).then((data) => {
                    return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Added, data)
                }).catch((err) => {
                    return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
                });

            }
        }
    } catch (err) {

        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)

    }
};

function employeeList() {
    try {
        return employeeDao.employeeList().then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.EmployeeList, employeeConstants.MESSAGES.Success, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getEmployeeById(id) {
    try {
        return employeeDao.employeeById(id).then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_By_Id, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }

}

async function getCorporateEmployees(corporateId, batch, limit) {
    try {
        const projection = {
            resetTokenIsUsed: 0,
            updatedAt: 0,
            __v: 0,
            tokens: 0,
            password: 0,
            role: 0,
            corporate_admin_id: 0,
        };

        // check corporate admin exists
        const isExist = await isUserExist({ userId: corporateId });
        if (!isExist) {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.userNoPermission);
        }

        // Get Corporate employee
        return employeeDao.getCorporateEmployees(corporateId, projection, batch, limit).then((data) => {
            return employeeMapper.responseMappingEmployees(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Listed, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })

    } catch (error) {
        logger.warn(error)
        return error;
    }
}

async function employeeEditById(id, data) {
    try {
        const employeeExists = await employeeDao.employeeById({ email: data.email, _id: mongoose.Types.ObjectId(id._id) }, { __v: 0 });
        if (!employeeExists.length) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }

        const checkedEmployeeDetails = await checkEmployeeDetails(data, employeeExists[0]);
        if (!checkedEmployeeDetails.success) {
            return checkedEmployeeDetails;
        }

        if (data.licenseId !== employeeExists.licenseId) {
            data.licenseAssignDate = new Date();
            data.randomLicenseId = checkedEmployeeDetails.randomLicenseId
        }
        data.address = typeof data.address === "string" ? JSON.parse(data.address) : [];
        data.branchId = data.branchId || null;
        return employeeDao.updateEmployee(id, data).then((result) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Update, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        });
    } catch (err) {
        return err;
    }
}

async function deleteEmployee(id, userDetails) {
    try {

        // check corporate admin exists
        const isExist = await isUserExist({ userId: userDetails.userId });
        if (!isExist) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.userNoPermission);
        }

        const employeeExists = await employeeDao.employeeById({ _id: id, isActive: true }, { __v: 0 });
        if (!employeeExists) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }

        return employeeDao.deleteEmployee(id).then((data) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Employee_Deleted)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}

async function loginEmployee(loginDetails) {
    try {

        const projection = {
            tokens: 0,
            resetTokenIsUsed: 0,
            createdAt: 0,
            updatedAt: 0,
            resetPasswordToken: 0,
            resetPasswordExpires: 0,
            __v: 0,
        }

        let [userDetails] = await employeeDao.employeeById({ email: loginDetails.email, role: "EMPLOYEE" }, projection);

        if (!userDetails) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectEmailPass);
        }

        if (userDetails.status != "APPROVED") {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.permissionDenied);
        }
        if ((userDetails.isActive === false && userDetails.isFirstLogin === false) || userDetails.isDeteted) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.permissionDenied);
        }
        if (!userDetails.isFirstLogin) {
            const valid = await appUtils.verifyPassword(loginDetails, userDetails);
            if (!valid) {
                return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectEmailPass);
            }
        } else {
            if (loginDetails.password !== userDetails.password) {
                return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectEmailPass);
            }
        }

        const jwtToken = await jwtHandler.genUsrToken({
            firstName: userDetails.firstName,
            lastName: userDetails.lastName,
            userId: userDetails._id,
            email: userDetails.email,
            role: userDetails.role,
            companyName: userDetails.companyName,
        });
        const data = {
            userId: userDetails._id,
            tokens: jwtToken,
        };

        employeeDao.loginEmployee(data);
        return employeeMapper.loginMapping(userDetails, jwtToken, employeeConstants.MESSAGES.loginSuccess);

    } catch (error) {
        logger.warn(error)
        return error;
    }
}

// Logout
async function logout(data) {
    try {
        // const isExist = await employeeDao.employeeById({ _id: data.userId, role: "EMPLOYEE" });
        // if (!isExist) {
        //     return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        // }
        // data.returnNewDocument = true;
        employeeDao.logoutUser(data);
        return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.logoutSuccess);
    } catch (err) {
        return err;
    }
};

async function setPassword(data) {
    try {
        const projection = {
            tokens: 0,
            resetTokenIsUsed: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
        }
        const [userDetails] = await employeeDao.employeeById({ _id: mongoose.Types.ObjectId(data.userId), email: data.email }, projection);
        if (!userDetails) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }
        // if (userDetails.status != "APPROVED") {
        //     return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.permissionDenied);
        // }
        if (userDetails.isDeleted) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.permissionDenied);
        }
        if (!userDetails.isFirstLogin) {
            const valid = await appUtils.verifyPassword(data, userDetails);
            if (!valid) {
                return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectEmailPass);
            }
        } else {
            if (data.password !== userDetails.password) {
                return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.incorrectEmailPass);
            }
        }
        //encrypt password
        const newPassword = await appUtils.convertPass(data.newPassword);
        data.newPassword = newPassword;
        data.isActive = true;

        let result = await employeeDao.setPassword(data, projection);

        if (result) {
            result._doc.setFirstProfile = userDetails.isFirstLogin ? true : false;
            if (userDetails.isFirstLogin) {
                return employeeMapper.loginMapping({ ...userDetails, ...result._doc }, data.tokens, employeeConstants.MESSAGES.setPasswordSuccess);
            } else {
                return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.setPasswordSuccess);
            }
        }
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.setPasswordError);
    } catch (error) {
        logger.warn(error);
        return error;
    }
}

async function placeOrder(orderDetails) {
    logger.debug(`Inside Place Order`);
    try {
        const isEmployeeExist = await employeeDao.employeeById({ _id: mongoose.Types.ObjectId(orderDetails.employeeId), role: "EMPLOYEE", isActive: true }, { __v: 0 });
        if (!isEmployeeExist.length) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }

        const isCorporateExist = await employeeDao.checkIfExist({ userId: orderDetails.corporateId });
        if (!isCorporateExist) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.employeeNotFound);
        }

        const productsExistInCart = await employeeDao.productsOnCart(orderDetails.employeeId, orderDetails.products);
        if (!productsExistInCart.length) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Unauthorized, employeeConstants.MESSAGES.ProductNotExistsInCart);
        }

        let productsDetails = await employeeDao.getProductsDetails(orderDetails.products);

        const costSummaryDetails = await employeeDao.getCostSummary();

        let firstTimeCost = 0;
        let recurringCost = 0;
        let totalOrderCost = 0;

        let allProducts = productsDetails.map(product => {
            let oneTimeCost = parseFloat(((product.ros_cost / 12) * costSummaryDetails.firstTimeMonths).toFixed(2));
            let recrngCost = parseFloat(((product.ros_cost - oneTimeCost) / costSummaryDetails.recurringMonthsNo).toFixed(2));
            firstTimeCost += oneTimeCost;
            recurringCost += recrngCost;
            totalOrderCost += product.ros_cost
            // product.firstTimeCost = oneTimeCost
            // product.recurringCost = recrngCost;
            return { ...product._doc, firstTimeCost: oneTimeCost, recurringCost: recrngCost };
        })


        const orderId = await appUtils.generateNumberNanoId();
        orderDetails.orderId = "ROS-" + orderId;

        orderDetails.status = 'pending'
        orderDetails.deliveryStatus = 'pending'
        orderDetails.orderDate = new Date();
        orderDetails.firstPaymentTerm = costSummaryDetails.firstTimeMonths;
        orderDetails.recurringPaymentPending = costSummaryDetails.recurringMonthsNo;
        orderDetails.recurringMonthsNo = costSummaryDetails.recurringMonthsNo;
        orderDetails.firstYearCharge = costSummaryDetails.firstYearCharge;
        orderDetails.firstYearTerm = costSummaryDetails.firstYearTerm;
        orderDetails.secondYearCharge = costSummaryDetails.secondYearCharge;
        orderDetails.secondYearTerm = costSummaryDetails.secondYearTerm;
        orderDetails.pendingFirstYearTerm = costSummaryDetails.firstYearTerm;
        orderDetails.pendingSecondYearTerm = costSummaryDetails.secondYearTerm;
        orderDetails.firstTimeCost = firstTimeCost;
        orderDetails.recurringCost = recurringCost;
        orderDetails.products = allProducts;
        orderDetails.totalOrderCost = totalOrderCost;
        //save employee order details
        return employeeDao.saveEmployeeOrderDetails(orderDetails).then((data) => {
            employeeDao.emptyCart(orderDetails.employeeId);
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Order_Added, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        });
    } catch (err) {
        logger.warn(err)
        return err;
    }
};

function orderEditById(id, data) {
    try {
        return employeeDao.updateOrderDetails(id, data).then((data) => {
            return employeeMapper.responseMappingData(employeeConstants.CODE.Success, employeeConstants.MESSAGES.Order_Updated, data)
        }).catch((err) => {
            return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
        })
    } catch (err) {
        return err;
    }
}
function getOrderListByEmployee(data) {
    let query = {};
    query = {
        employeeId: mongoose.Types.ObjectId(data._id),

    };


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
                orderId: 1,
                orderDate: 1,
                status: 1,
                "productDetails._id": 1,
                "productDetails.product_name": 1,
                "productDetails.product_description": 1,
                "productDetails.product_image": 1,
                "productDetails.product_code": 1,
                "productDetails.product_cost": 1,
            },
        },

    ];
    return employeeDao.getOrderListByEmployee(agrgegateQuery).then((data) => {
        return employeeMapper.responseMappingData(employeeConstants.CODE.EmployeeList, employeeConstants.MESSAGES.Success, data)
    }).catch((err) => {
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.internalServerError)
    })


}

const getEmployeeOrder = async (employeeId, batch, limit) => {
    try {
        let orderList = await employeeDao.getEmployeeOrder(employeeId, batch, limit);
        if (orderList) {
            return employeeMapper.responseMappingList(employeeConstants.CODE.Success, employeeConstants.MESSAGES.orderListSuccess, orderList)
        }
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.orderListError)
    } catch (error) {
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.orderListError)
    }
}

const cancelEmployeeOrder = async (orderId) => {
    try {
        let result = await employeeDao.cancelEmployeeOrder(orderId);
        if (result && result.deletedCount) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.orderListSuccess)
        }
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.orderCancelError)
    } catch (error) {
        console.log(error)
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.orderCancelError)
    }
}

const deactiveEmployee = async (_id, data) => {
    try {
        let result = await employeeDao.deactivateEmployee({ _id }, data);
        if (result) {
            return employeeMapper.responseMapping(employeeConstants.CODE.Success, employeeConstants.MESSAGES.deactiveEmployeeSuccess)
        }
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.deactiveEmployeeError)
    } catch (error) {
        return employeeMapper.responseMapping(employeeConstants.CODE.INTRNLSRVR, employeeConstants.MESSAGES.deactiveEmployeeError);
    }
}
async function sendMail(id, data) {
    try {
        let Intro = "Thank you for contacting us. You are very important to us, all information received will always remain confidential. we will contact you as soon as we review your message."
        const html = mailHandler.mailGenHTML({
            name: data.fullName,
            intro: Intro
        });

        // send mail
        mailHandler.sendMail({
            to: data.email,
            subject: employeeConstants.MESSAGES.Contact,
            html
        });
    } catch (err) {

    }
}
module.exports = {
    employeeAdd,
    employeeAddMultiple,
    employeeList,
    getEmployeeById,
    employeeEditById,
    deleteEmployee,
    getCorporateEmployees,
    loginEmployee,
    logout,
    setPassword,
    placeOrder,
    orderEditById,
    getOrderListByEmployee,
    getEmployeeOrder,
    cancelEmployeeOrder,
    deactiveEmployee,
    sendMail
};