
const mongoose = require("mongoose");
// const promise = require("bluebird");
const Branch = require('../../model/branchModel');
// const appUtil = require("../../appUtils");
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

// Update user
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

module.exports = {
    branchById,
    saveBranch,
    branchList,
    updateBranch,
    deleteBranch
  
};
