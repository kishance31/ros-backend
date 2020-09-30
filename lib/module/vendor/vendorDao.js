
const mongoose = require("mongoose");
const Vendor = require('../../model/vendorModel');
const BaseDao = new require('./../../dao/baseDao');
const vendorDao = new BaseDao(Vendor);

async function vendorById(_query) {
    return await vendorDao.findOne(_query);
}

async function saveVendor(vendorInfo) {
    let vendor = new Vendor(vendorInfo);
    return await vendorDao.save(vendor);
};

async function vendorList() {
    return await vendorDao.find();
}

async function updateVendor(data,_update) {
    try {
        let query = {};
        query._id = data._id;
        
       
        return await vendorDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function updateVendorStatus(data,_update) {
    try {
        let query = {};
        query._id = data._id;
        
       
        return await vendorDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};
async function deleteVendor(data) {
    try {
        let query = {};
        query._id = data._id;

      
        return await vendorDao.remove(query);
    } catch (err) {
        return err;
    }
};



module.exports = {
    vendorById,
    saveVendor,
    vendorList,
    updateVendor,
    updateVendorStatus,
    deleteVendor
  
};
