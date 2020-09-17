/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const jwtHandler = require('../../commonHandler/jwtHandler');
const AppUtil   = require('../../appUtils');
const adminMapper = require('./adminMapper');
const adminService = require("./adminService");
const loggerConfig = require("../../config/loggerConfig");

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
async function approveCorporateUser(_corporateUserId) {
    return await adminService.updateCorporateAdminStatus(_corporateUserId, "APPROVED");
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
async function rejectCorporateUser(_corporateUserId) {
    return await adminService.updateCorporateAdminStatus(_corporateUserId, "REJECTED");
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

        const valid = await AppUtil.verifyPassword(loginInfo, isExist);
        
        if (!valid) {
            return adminMapper.passwordMismatch();
        }

        const jwtToken = await jwtHandler.genUsrToken({ userId: isExist._id, email: isExist.email, role: isExist.role });        
        const data = {
            userId: isExist._id,
            tokens: jwtToken,
            returnNewDocument: true
        };
        const res = await adminService.loginUser(data);
        return adminMapper.loginMapping(res, jwtToken);
    } catch (err) {
        return err;
    }
}
// Signup
async function signup(signupInfo) {
    return await adminService.signupUser(signupInfo);
};

async function editAdmin(userId, updateUserObj,reqs){
    if (reqs.files) {
        if (reqs.files.corpDoc) {
            var str = reqs.files.corpDoc.name
            reqs.files.corpDoc.name = str.replace(/\s/g, "_");
            await uploadImage(reqs.files.corpDoc).then((result) => {
                updateUserObj.corpDoc = result
            })
        }

    }
    return adminService.updateUser(userId,updateUserObj).then(result =>result)
}

function deleteAdminById(data,updateUserObj) {
    return adminService.deleteAdmin(data,updateUserObj).then(data=> data)
      
}
function getAdminById(req) {
    return adminService.getAdminById(req).then(result => result)
}
function getAdminList() {
    return adminService.adminList().then(result =>result)
}
function updateAdminStatus(userId,updateUserObj) {
    return adminService.updateAdminStatus(userId,updateUserObj).then(result =>result)
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
module.exports = {
    login,
    signup,
    editAdmin,
    deleteAdminById,
    getAdminById,
    getAdminList,
    approveCorporateUser,
    rejectCorporateUser,
    updateAdminStatus
}