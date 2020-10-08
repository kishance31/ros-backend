
const mongoose = require("mongoose");
const Category = require('../../model/categoryModel');
const BaseDao = require('../../dao/baseDao');
const categoryDao = new BaseDao(Category);
const adminModel = require('../../model/userModel');
const adminDao = new BaseDao(adminModel);

const checkAdmin = async (adminId) => {
    try {
        return await adminDao.findOne({ _id: adminId, role: "ADMIN", isActive: true });
    } catch (error) {
        return null;
    }
}

async function categoryById(_query) {
    return await categoryDao.findOne(_query);
}

async function saveCategory(category_name) {
    try {
        let category = new Category({ category_name });
        return await categoryDao.save(category);
    } catch (error) {
        throw new Error(error.message);
    }
};

async function categoryList() {
    return await categoryDao.find();
}

async function getCategoryWithSubCategory() {
    return await categoryDao.aggregate([
        { $match: { status: true } },
        {
            $lookup: {
                from: "subcategories",
                as: "subCategories",
                let: { subCategories: "$subCategories" },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $in: ["$_id", "$$subCategories"] },
                                    { $eq: ["$status", true] },
                                ]
                            }
                        }
                    },
                    { $project: { status: 0, updatedAt: 0, createdAt: 0, __v: 0 } }
                ]
            }
        },
        { $project: { status: 0, updatedAt: 0, createdAt: 0, __v: 0 } },
    ])
}

async function updateCategory(data, categoryData) {
    try {
        let query = {};
        query._id = data._id;   
        let categoryRoute = "/" + categoryData.category_name.trim().toLowerCase().split(" ").join("-");
        let _update = { $set: { ...categoryData, categoryRoute } };
        return await categoryDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function updateCategoryStatus(data, status) {
    try {
        let query = {};
        query._id = data._id;

        let _update = { $set: { status } }
        return await categoryDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};
async function deleteCategory(data) {
    try {
        let query = {};
        query._id = data._id;


        return await categoryDao.remove(query);
    } catch (err) {
        return err;
    }
};



module.exports = {
    categoryById,
    saveCategory,
    categoryList,
    updateCategory,
    updateCategoryStatus,
    deleteCategory,
    checkAdmin,
    getCategoryWithSubCategory
};
