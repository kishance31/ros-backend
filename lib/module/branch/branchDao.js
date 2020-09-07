
const mongoose = require("mongoose");
const Branch = require('../../model/branchModel');
const BaseDao = require('../../dao/baseDao');
const branchDao = new BaseDao(Branch);
const User = require('../../model/userModel');
const userDao = new BaseDao(User);

async function branchById(_query) {
    try {
        return await branchDao.findOne(_query);
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

/**
 * find corporater-admin by _id, email, username
 *
 * @async
 * @desc update corporate user object
 *
 * @param {object} data - Query parameters
 *
 * @returns {*|Promise<any | never>}
 */
async function checkIfExist(data, project) {
    try {
        let query = {
            $or: [],
            role: "CORPORATE_ADMIN",
        };
        if (data.userId) {
            query.$or.push({ _id: data.userId });
        }
        if (data.email) {
            query.$or.push({ email: data.email });
        }
        if (data.username) {
            query.$or.push({ username: data.username });
        }
        if (data.resetToken) {
            query.$or.push({ resetToken: data.resetToken, resetTokenExpiration: { $gt: Date.now() } });
        }
        return await userDao.findOne(query, project);
    } catch (error) {
        return null;
    }
};

async function saveBranch(branchInfo) {
    let branch = new Branch(branchInfo);
    return await branchDao.save(branch);
};

async function branchList() {
    return await branchDao.find();
}

async function updateBranch(data, _update, options) {
    try {
        let query = {};
        query._id = data._id;

        return await branchDao.findOneAndUpdate(query, _update, options);
    } catch (err) {
        return err;
    }
};

async function deleteBranch(data) {
    try {
        return await branchDao.remove({ ...data });
    } catch (err) {
        return err;
    }
};

async function branchByCorporateId(data, batch = 0, limit = 5) {
    // return await branchDao.find(data)
    try {
        // return await employeeDao.find({ corporate_admin_id: corporateId }, projection)
        return await branchDao.aggregate([
            {
                $facet: {
                    list: [
                        { $match: { corporate_admin_id: mongoose.Types.ObjectId(data.corporate_admin_id) } },
                        { $project: {__v: 0, updatedAt: 0} },
                        { $sort: { createdAt: -1 } },
                        { $skip: batch * limit },
                        { $limit: limit },
                    ],
                    total: [
                        { $match: { corporate_admin_id: mongoose.Types.ObjectId(data.corporate_admin_id) } },
                        { "$count": "count" }
                    ],
                }
            }
        ])
    } catch (error) {
        logger.warn(error)
        return [];
    }
}

async function getCorporateBranchNames(corporate_admin_id) {
    try {
        return await branchDao.find({corporate_admin_id}, {branch_name: 1});
    } catch (error) {
        return [];
    }
}

module.exports = {
    branchById,
    saveBranch,
    branchList,
    updateBranch,
    deleteBranch,
    branchByCorporateId,
    checkIfExist,
    getCorporateBranchNames
};
