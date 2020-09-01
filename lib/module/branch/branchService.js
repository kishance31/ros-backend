'use strict';


const branchDao = require('./branchDao');
const branchMapper = require('./branchMapper');
const branchConstants = require("./branchConstants");

async function branchAdd(branchDetails) {
    logger.debug(`Inside branchservices`);
    try {

        const isExist = await isUserExist({ userId: branchDetails.corporate_admin_id });
        if (!isExist) {
            return branchMapper.responseMappingData(branchConstants.CODE.Unauthorized, branchConstants.MESSAGES.userNoPermission);
        }

        const isBranchExists = await branchDao.branchById({ branch_name: branchDetails.branch_name });

        if (isBranchExists) {
            return branchMapper.responseMappingData(branchConstants.CODE.Unauthorized, branchConstants.MESSAGES.branchNameExists);
        }

        return branchDao.saveBranch(branchDetails).then((data) => {

            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Added, data)


        }).catch((err) => {

            console.log({ err })
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGE.internalServerError)
        })

    } catch (err) {
        logger.warn(err);
        return err;
    }
};

// Chech if user exist
async function isUserExist(details, projection) {
    try {
        return await branchDao.checkIfExist(details, projection);
    } catch (err) {
        return err;
    }
};


function branchList() {
    try {
        return branchDao.branchList().then((data) => {
            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getBranchById(id) {
    try {
        return branchDao.branchById(id).then((data) => {
            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_By_Id, data)

        }).catch((err) => {
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }

}
async function branchEditById(id, data) {
    try {
        const isExist = await isUserExist({ userId: data.corporate_admin_id });
        if (!isExist) {
            return branchMapper.responseMappingData(branchConstants.CODE.Unauthorized, branchConstants.MESSAGES.updateNoPermission);
        }

        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false
        }

        return branchDao.updateBranch(id, data, options).then((result) => {
            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Update, result)

        }).catch((err) => {
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        logger.warn(err)
        return err;
    }
}

async function deleteBranch(id, userId) {
    try {
        const isExist = await isUserExist({ userId });
        if (!isExist) {
            return branchMapper.responseMappingData(branchConstants.CODE.Unauthorized, branchConstants.MESSAGES.deleteNoPermission);
        }
        return branchDao.deleteBranch(id).then((data) => {
            return branchMapper.responseMapping(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Deleted)

        }).catch((err) => {
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
async function getBranchByCorporateId(id, batch, limit) {
    try {
        const isExist = await isUserExist({ userId: id.corporate_admin_id });
        if (!isExist) {
            return branchMapper.responseMappingData(branchConstants.CODE.Unauthorized, branchConstants.MESSAGES.userNoPermission);
        }

        return branchDao.branchByCorporateId(id, batch, limit).then((data) => {
            return branchMapper.responseMappingBranches(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_By_Corporate, data)

        }).catch((err) => {
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }
}
async function getCorporateBranchNames(corporate_admin_id) {
    try {
        const isExist = await isUserExist({ userId: corporate_admin_id });
        if (!isExist) {
            return branchMapper.responseMappingData(branchConstants.CODE.Unauthorized, branchConstants.MESSAGES.userNoPermission);
        }

        return branchDao.getCorporateBranchNames(corporate_admin_id).then((data) => {
            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_By_Corporate, data)

        }).catch((err) => {
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)

        })
    } catch (error) {
        return error;
    }
}

module.exports = {
    branchAdd,
    branchList,
    getBranchById,
    branchEditById,
    deleteBranch,
    getBranchByCorporateId,
    getCorporateBranchNames
};