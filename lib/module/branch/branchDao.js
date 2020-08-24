
const mongoose = require("mongoose");
const Branch = require('../../model/branchModel');
const BaseDao = new require('./../../dao/baseDao');
const branchDao = new BaseDao(Branch);

async function branchById(_query) {
    return await branchDao.findOne(_query);
}

async function saveBranch(branchInfo) {
    let branch = new Branch(branchInfo);
    return await branchDao.save(branch);
};

async function branchList() {
    return await branchDao.find();
}

async function updateBranch(data,_update) {
    try {
        let query = {};
        query._id = data._id;
        
       
        return await branchDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function deleteBranch(data) {
    try {
        let query = {};
        query._id = data._id;

      
        return await branchDao.remove(query);
    } catch (err) {
        return err;
    }
};

async function branchByCorporateId(data) {
    return await branchDao.findOne(data);

}

module.exports = {
    branchById,
    saveBranch,
    branchList,
    updateBranch,
    deleteBranch,
    branchByCorporateId
  
};
