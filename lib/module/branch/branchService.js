'use strict';


const branchDao = require('./branchDao');
const branchMapper = require('./branchMapper');
const branchConstants = require("./branchConstants");

function branchAdd(branchDetails) {
    logger.debug(`Inside branchservices`);
    try {

        return branchDao.saveBranch(branchDetails).then((data) => {

            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Added, data)


        }).catch((err) => {

            console.log({ err })
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGE.internalServerError)
        })

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
function branchEditById(id, data) {
    try {
        return  branchDao.updateBranch(id, data).then((data) => {
            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Update, data)

        }).catch((err)=>{
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteBranch(id) {
    try {
        return branchDao.deleteBranch(id).then((data) => {
            return branchMapper.responseMapping(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_Deleted)

        }).catch((err)=>{
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function getBranchByCorporateId(id){
    try {
        return branchDao.branchByCorporateId(id).then((data) => {
            return branchMapper.responseMappingData(branchConstants.CODE.Success, branchConstants.MESSAGES.Branch_By_Corporate, data)

        }).catch((err) => {
            return branchMapper.responseMapping(branchConstants.CODE.INTRNLSRVR, branchConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    branchAdd,
    branchList,
    getBranchById,
    branchEditById,
    deleteBranch,
    getBranchByCorporateId

};