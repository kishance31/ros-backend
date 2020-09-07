
const Product = require('../../model/productModel');
const BaseDao = new require('./../../dao/baseDao');
const productDao = new BaseDao(Product);

async function productById(_query) {
    return await productDao.findOne(_query);
}

async function saveProduct(productInfo) {
    let product = new Product(productInfo);
    return await productDao.save(product);
};

async function productList() {
    return await productDao.find();
}

async function updateProduct(data,_update) {
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
    saveProduct,
    productList,
    updateProduct,
    deleteProduct
  
};
