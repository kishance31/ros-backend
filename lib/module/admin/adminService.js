
const config = require('../../config');
const adminDao = require('./adminDao');
const adminMapper = require('./adminMapper');
const adminConstants = require("./adminConstants");


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


async function isUserExist(details) {
    return await adminDao.checkIfExist(details);
};


async function loginUser(data) {
    return await adminDao.login(data);
}

// User signup
async function signupUser(usrDetails) {
    logger.debug(`Inside signup admin services`);
    try {
        // let corpDoc = usrDetails.files;
        const exist = await adminDao.checkIfExist(usrDetails);

        if (exist) {
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.userExist);
        }

        const roleExists = await adminDao.checkRoleExists(usrDetails.roleName);
        if(!roleExists) {
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.incorrectRoleName)
        }
        

        // Initialized 
        usrDetails.role = "ADMIN";
        usrDetails.isActive = true;

        // if (typeof (corpDoc) != "undefined" && corpDoc != null) {

        //     if (typeof (corpDoc) != "undefined") {

        //         var str = corpDoc.name
        //         corpDoc.name = str.replace(/\s/g, "_");
        //         await uploadImage(corpDoc).then((result) => {
        //             usrDetails.corpDoc = result
                   
        //         })
        //     } else {
        //         usrDetails.corpDoc = ''
        //     }
        // }
        const data = await adminDao.saveAdmin(usrDetails);
        if (data) {
            //SuccessfullyRegistered
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.SuccessfullyRegistered)
        }
    } catch (err) {
        logger.warn(err);
        return err;
    }
};
async function updateUser(userId, updateUserObj) {
    try {
        return  adminDao.updateUser(userId, updateUserObj).then((data) => {
            return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.AdminUpdate, data)

        }).catch((err)=>{
            return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

async function updateAdminStatus(adminId, _status) {
  
    try {
        return  adminDao.updateUser(adminId, _status).then((data) => {
            return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.StatusUpdated, data)

        }).catch((err)=>{
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
function adminList() {
    try {
        let query = {
            role: "ADMIN",
            };
            
        return adminDao.adminList(query).then((data) => {
            return adminMapper.responseMappingData(adminConstants.CODE.Success, adminConstants.MESSAGES.UserListed, data)


        }).catch((err) => {

            console.log({ err })
            return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}

function deleteAdmin(id,updateUserObj) {
    try {
        return adminDao.deleteAdmin(id,updateUserObj).then((data) => {
            return adminMapper.responseMapping(adminConstants.CODE.Success, adminConstants.MESSAGES.UserDeleted)

        }).catch((err)=>{
            return adminMapper.responseMapping(adminConstants.CODE.INTRNLSRVR, adminConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
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

module.exports = {
    createdefaultAdmin,
    isUserExist,
    loginUser,
    signupUser,
    updateUser,
    getAdminById,
    updateAdminStatus,
    adminList,
    deleteAdmin
}