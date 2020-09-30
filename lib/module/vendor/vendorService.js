'use strict';


const vendorDao = require('./vendorDao');
const vendorMapper = require('./vendorMapper');
const vendorConstants = require("./vendorConstants");

function vendorAdd(vendorDetails) {
    logger.debug(`Inside vendorservices`);
    try {

        return vendorDao.saveVendor(vendorDetails).then((data) => {

            return vendorMapper.responseMappingData(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_Added, data)


        }).catch((err) => {

            console.log({ err })
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGES.internalServerError)
        })

    } catch (err) {
        return err;
    }
};


function vendorList() {
    try {
        return vendorDao.vendorList().then((data) => {
            return vendorMapper.responseMappingData(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getVendorById(id) {
    try {
        return vendorDao.vendorById(id).then((data) => {
            return vendorMapper.responseMappingData(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_By_Id, data)

        }).catch((err) => {
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}


function vendorEditById(id, data) {
    try {
        return  vendorDao.updateVendor(id, data).then((data) => {
            return vendorMapper.responseMappingData(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_Update, data)

        }).catch((err)=>{
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function vendorStatusEditById(id, data) {
    try {
        return  vendorDao.updateVendorStatus(id, data).then((data) => {
            return vendorMapper.responseMappingData(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_Update, data)

        }).catch((err)=>{
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function deleteVendor(id) {
    try {
        return vendorDao.deleteVendor(id).then((data) => {
            return vendorMapper.responseMapping(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_Deleted)

        }).catch((err)=>{
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
function getVendorByCorporateId(id){
    try {
        return vendorDao.vendorByCorporateId(id).then((data) => {
            return vendorMapper.responseMappingData(vendorConstants.CODE.Success, vendorConstants.MESSAGES.Vendor_By_Corporate, data)

        }).catch((err) => {
            return vendorMapper.responseMapping(vendorConstants.CODE.INTRNLSRVR, vendorConstants.MESSAGES.internalServerError)

        })
    } catch (err) {
        return err;
    }
}
module.exports = {
    vendorAdd,
    vendorList,
    getVendorById,
    vendorEditById,
    vendorStatusEditById,
    deleteVendor,
    getVendorByCorporateId

};