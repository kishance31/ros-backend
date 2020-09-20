/**
 * @author Shivangi Dubey <shivangi.dubey@codezeros.com>
 */

const config = require('../../config');
const adminDao = require('./adminDao');
const adminMapper = require('./adminMapper');
const corporateAdminDao = require('./../corporate-admin/corporateAdminDao');

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
async function updateCorporateAdminStatus(_corporateUserId, _status) {
    const IsExist = await  corporateAdminDao.checkIfExist({userId: _corporateUserId});
    if(!IsExist) {
        return adminMapper.userExist();
    }

    if(_status == "APPROVED") {
        IsExist.status = _status;    
        IsExist.isActive = true;
    } else {
        IsExist.status = "REJECTED";
        IsExist.isActive = false;
    }
    
    return await corporateAdminDao.findCorporateUserById({_id: _corporateUserId}, IsExist);
}

/**
 * create default platform admin account
 *
 * @async
 * @desc systerm required default user to manage platform operations
 * 
 * @returns {responseHandler<success/reject>}
 */
async function createdefaultAdmin() {
    logger.info(`default admin data`, config.cfg.DEFAULT_ADMIN_USER );
    
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
    logger.info(`default admin forms data` );
    const data = await adminDao.createDefaultAdminForms({names: config.cfg.DEFAULT_ADMIN_FORMS, types: config.cfg.ROLE_PERMISSIONS});
    if (data) {
        return adminMapper.registerMapping(data._id);
    }
}

/**
 * verify if admin user already registered
 *
 * @async
 * @desc prevent duplicate of the admin-user
 *
 * @param {object} user - admin-user object
 * 
 * @returns {responseHandler<success/reject>}
 */
async function isUserExist(details) {
    return await adminDao.checkIfExist(details);
};

/**
 * login admin user flow handler
 *
 * @async
 * @desc login admin-user
 *
 * @param {object} user - admin-user object
 * 
 * @returns {responseHandler<success/reject>}
 */
async function loginUser(data) {
    return await adminDao.login(data);
}

module.exports = {
    createdefaultAdmin,
    isUserExist,
    loginUser,
    updateCorporateAdminStatus,
}