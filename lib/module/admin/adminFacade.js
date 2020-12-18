/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const jwtHandler = require('../../commonHandler/jwtHandler');
const AppUtil = require('../../appUtils');
const adminMapper = require('./adminMapper');
const adminService = require("./adminService");
const { cfg } = require('../../config');
const mailHandler = require('../../commonHandler/mailHandler');

/**
 * approve corporater-admin registration request
 *
 * @async
 * @desc admin can approve the corporater-admin user account
 *
 * @param {string} _id - userId (corporaterUserId)
 *
 * @returns {*|Promise<any | never>}
 */
async function approveCorporateUser(id, _corporateUserId) {
    return await adminService.updateCorporateAdminStatus(id, _corporateUserId, "APPROVED");
}

/**
 * reject corporater-admin registration request
 *
 * @async
 * @desc admin can reject the corporater-admin user account
 *
 * @param {string} _id - userId (corporaterUserId)
 *
 * @returns {*|Promise<any | never>}
 */
async function rejectCorporateUser(id, _corporateUserId) {
    return await adminService.updateCorporateAdminStatus(id, _corporateUserId, "REJECTED");
}

/**
 * admin-user login flow
 *
 * @async
 * @desc handle login flow of the admin user
 *
 * @param {object} user - admin-user object
 *
 * @returns {responseHandler<success/reject>}
 */
async function login(loginInfo) {
    try {
        const isExist = await adminService.isUserExist(loginInfo);
        if (!isExist) {
            return adminMapper.userNotExist();
        }

        if (!isExist.isActive) {
            return adminMapper.responseMapping(401, "User not active.")
        }

        const valid = await AppUtil.verifyPassword(loginInfo, isExist);

        if (!valid) {
            return adminMapper.passwordMismatch();
        }

        const jwtToken = await jwtHandler.genUsrToken({ userId: isExist._id, email: isExist.email, role: isExist.role });
        const data = {
            userId: isExist._id,
            email: isExist.email,
            tokens: jwtToken,
            returnNewDocument: true
        };
        const res = await adminService.loginUser(data);
        console.log(res)
        if (res.length) {
            return adminMapper.loginMapping(jwtToken, res[0]);
        }
        return adminMapper.userNotExist();
    } catch (err) {
        console.log(err)
        return err;
    }
}

async function logout(data) {
    try {
        await adminService.logout(data);
        return adminMapper.responseMapping(200, "Logout Success.");
    } catch (err) {
        return err;
    }
}

// Signup
async function signup(signupInfo) {
    return await adminService.signupUser(signupInfo);
};

async function editAdmin(userId, updateUserObj, adminId) {
    // if (reqs.files) {
    //     if (reqs.files.corpDoc) {
    //         var str = reqs.files.corpDoc.name
    //         reqs.files.corpDoc.name = str.replace(/\s/g, "_");
    //         await uploadImage(reqs.files.corpDoc).then((result) => {
    //             updateUserObj.corpDoc = result
    //         })
    //     }

    // }
    return adminService.updateUser(userId, updateUserObj, adminId).then(result => result)
}

function deleteAdminById(data, userId) {
    return adminService.deleteAdmin(data, userId).then(data => data)

}
function getAdminById(req) {
    return adminService.getAdminById(req).then(result => result)
}
function getAdminList(id, batch, limit) {
    return adminService.adminList(id, batch, limit).then(result => result)
}
function updateAdminStatus(updateUserObj) {
    return adminService.updateAdminStatus(updateUserObj).then(result => result)
}
async function getUserByToken(data) {
    try {
        let admin = await adminService.isUserExist({ id: data.userId, email: data.email });
        if (admin) {
            return adminMapper.loginMapping(data.tokens, admin);
        }
        return adminMapper.userNotExist();
    } catch (error) {
        return adminMapper.userNotExist();
    }
}
async function uploadImage(image) {

    let filename = image.name;
    await image.mv('./uploads/' + filename, function (err) {

        if (err) {
            return err
        }
    });
    return filename;
}
function getCorporateUsers(userId, batch, limit) {
    return adminService.getCorporateUsers(userId, batch, limit).then(result => result)
}
function getEmpOrderDetails(req) {
    return adminService.getEmpOrderDetails(req).then(result => result)
}
function getEmpInvoiceDetails(req) {
    return adminService.getEmpInvoiceDetails(req).then(result => result)
}
function getCorporateOrderInvoice(isReccuring, batch, limit) {
    return adminService.getCorporateOrderInvoice(isReccuring, batch, limit).then(result => result)
}
function updateEmployeeOrdersByAdmin(data, updateData) {
    const {
        status, deliveryStatus, dispatchDate, deliveryDate, employeeDetails
    } = updateData;

    let Intro = "";
    if (status === "confirmed") {
        Intro = "Your order is confirmed.";
    } else if ( deliveryStatus === "dispatched") {
        Intro = "<p>Your order is Dispatched.</p><br/>";
        Intro += "<p>Dispatched Date:-&nbsp; " + new Date(dispatchDate).toLocaleDateString() + "</p>";
        Intro += "<p>Expected Delivery Date:-&nbsp; " + new Date(deliveryDate).toLocaleDateString() + "</p>";
    } else if(deliveryStatus=== "delivered") {
        Intro = "<p>Your order is Delivered.</p><br/>";
        Intro += "<p>If Order is not received by you, Please contact the admin.</p>";
    }
    const html = mailHandler.mailGenHTML({
        name: employeeDetails.firstName + " " + employeeDetails.lastName,
        intro: Intro
    });

    // send mail
    mailHandler.sendMail({
        to: employeeDetails.email,
        subject: "Order Details",
        html
    });
    return adminService.employeeOrdersEditById(data, updateData).then(result =>
        result)
}

function updateCorporateStatusByAdmin(data, updateData) {
    return adminService.corporateEditById(data, updateData).then(result =>
        result)
}

function forgotPassword(email) {
    return adminService.forgotPassword(email);
}
function resetPassword(data) {
    return adminService.resetPassword(data);
}
function changePassword(data) {
    return adminService.changePassword(data);
}

module.exports = {
    login,
    signup,
    editAdmin,
    deleteAdminById,
    getAdminById,
    getAdminList,
    approveCorporateUser,
    rejectCorporateUser,
    updateAdminStatus,
    getEmpOrderDetails,
    getEmpInvoiceDetails,
    updateEmployeeOrdersByAdmin,
    updateCorporateStatusByAdmin,
    logout,
    getUserByToken,
    getCorporateUsers,
    forgotPassword,
    resetPassword,
    getCorporateOrderInvoice,
    changePassword,

}