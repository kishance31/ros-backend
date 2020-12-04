const { ObjectId } = require('mongoose').Types;
const Product = require('../../model/productModel');
const Cart = require('../../model/cartModel');
const BaseDao = require('../../dao/baseDao');
const productDao = new BaseDao(Product);
const cartDao = new BaseDao(Cart);

async function productById(_query) {
    return await productDao.findOne(_query);
}
async function getproductBylicenseId(_query) {
    return await productDao.find(_query);

}
async function saveProduct(productInfo) {
    let product = new Product(productInfo);
    return await productDao.save(product);
};

async function productList(prodDetails, batch = 0, limit = 5, role) {
    let query = {};

    if (prodDetails.product_name) {
        query = {
            product_name: {
                $regex: prodDetails.product_name,
            },
        };
    }
    if (prodDetails.category_id) {
        query.category_id = ObjectId(prodDetails.category_id)
    };
    if (prodDetails.sub_category_id) {
        query.sub_category_id = ObjectId(prodDetails.sub_category_id)
    };
    if (prodDetails.license_id) {
        query.license_id = ObjectId(prodDetails.license_id)
    }
    if(prodDetails.status) {
        query.status = prodDetails.status
    }
    let projection = {__v: 0};
    if(role !== "ADMIN") {
        projection = {...projection, product_cost: 0, product_code: 0,}
    }
    return await productDao.aggregate([
        {
            $facet: {
                list: [
                    { $match: query },
                    {
                        $lookup: {
                            from: "licenses",
                            let: { license_id: "$license_id" },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$_id", "$$license_id"],
                                        }
                                    }
                                },
                                {
                                    $project: { type: 1 }
                                }
                            ],
                            as: "license_id"
                        }
                    },
                    { $unwind: "$license_id" },
                    {$project: projection},
                    { $sort: { updatedAt: -1 } },
                    { $skip: batch * limit },
                    { $limit: limit }
                ],
                total: [
                    { $match: query },
                    { "$count": "count" }
                ],
            }
        }

    ])
    // return await productDao.find(query);
}

async function updateProduct(data, _update) {
    try {
        let query = {};
        query._id = data._id;


        return await productDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function deleteProduct(data) {
    try {
        let query = {};
        query._id = data._id;


        return await productDao.remove(query);
    } catch (err) {
        return err;
    }
};

module.exports = {
    productById,
    getproductBylicenseId,
    saveProduct,
    productList,
    updateProduct,
    deleteProduct

};
