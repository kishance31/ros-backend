
const mongoose = require("mongoose");
const CostSummary = require('../../model/costSummaryModel');
const BaseDao = require('../../dao/baseDao');
const costSummaryDao = new BaseDao(CostSummary);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);

const checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

async function costSummaryById() {
    return await costSummaryDao.findOne({});
}

async function saveCostSummary(data) {
    try {
        return await costSummaryDao.findOneAndUpdate({}, {...data}, {upsert: true});
        // let costSummary = new CostSummary(data);
        // return await costSummaryDao.save(costSummary);
    } catch (error) {
        throw new Error(error.message);
    }
};


async function updateCostSummary(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await costSummaryDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};



module.exports = {
    costSummaryById,
    saveCostSummary,
    updateCostSummary,
    checkAdmin
};
