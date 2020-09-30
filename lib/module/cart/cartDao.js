
const mongoose = require("mongoose");
const Cart = require('../../model/cartModel');
const BaseDao = new require('./../../dao/baseDao');
const cartDao = new BaseDao(Cart);

async function cartById(_query) {
    return await cartDao.findOne(_query);
}
async function cartByEmployeeId(_query) {
    return await cartDao.find(_query);
}
async function saveCart(cartInfo) {
    let cart = new Cart(cartInfo);
    return await cartDao.save(cart);
};

async function cartList() {
    return await cartDao.find();
}

async function deleteCart(data) {
    try {
        let query = {};
        query._id = data._id;

      
        return await cartDao.remove(query);
    } catch (err) {
        return err;
    }
};

 function aggregateCart(aggregateQuery) {
     console.log('in cart Dao')
    return  cartDao.aggregate(aggregateQuery);
}

module.exports = {
    cartById,
    cartByEmployeeId,
    saveCart,
    cartList,
    deleteCart,
    aggregateCart
  
};
