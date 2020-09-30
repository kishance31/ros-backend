'use strict';


const mongoose = require('mongoose')
const cartDao = require('./cartDao');
const productDao = require('../product/productDao');
const cartMapper = require('./cartMapper');
const cartConstants = require("./cartConstants");

function cartAdd(cartDetails) {
    logger.debug(`Inside cartservices`);
    try {

        return cartDao.saveCart(cartDetails).then((data) => {

            return cartMapper.responseMappingData(cartConstants.CODE.Success, cartConstants.MESSAGES.Cart_Added, data)


        }).catch((err) => {

            console.log({ err })
            return cartMapper.responseMapping(cartConstants.CODE.INTRNLSRVR, cartConstants.MESSAGES.internalServerError)
        })

    } catch (err) {
        return err;
    }
};


function cartList() {
    try {
        return cartDao.cartList().then((data) => {
            return cartMapper.responseMappingData(cartConstants.CODE.Success, cartConstants.MESSAGES.Cart_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return cartMapper.responseMapping(cartConstants.CODE.INTRNLSRVR, cartConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getCartById(id) {
    try {
        return cartDao.cartById(id).then((data) => {
            return cartMapper.responseMappingData(cartConstants.CODE.Success, cartConstants.MESSAGES.Cart_By_Id, data)

        }).catch((err) => {
            return cartMapper.responseMapping(cartConstants.CODE.INTRNLSRVR, cartConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}


function deleteCart(id) {
    try {
        return cartDao.deleteCart(id).then((data) => {
            return cartMapper.responseMapping(cartConstants.CODE.Success, cartConstants.MESSAGES.Cart_Deleted)

        }).catch((err)=>{
            return cartMapper.responseMapping(cartConstants.CODE.INTRNLSRVR, cartConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}
async function getCartByEmployeeId(id){
   

        let query = {
            employeeId:  mongoose.Types.ObjectId(id)
        }
        let agrgegateQuery = [{
            $match: query
        },
        {
            $lookup: {
                from: 'products',
                localField: 'products',
                foreignField: '_id',
                as: 'productDetails'
            }
        },
        // {
        //     $unwind: {
        //         path: '$productDetails',
        //         preserveNullAndEmptyArrays: true
        //     }
        // },
        {
            $project:{
              quantity:1 ,"productDetails._id":1,"productDetails.product_name":1,"productDetails.product_description":1,"productDetails.product_image":1,"productDetails.product_code":1,
              "productDetails.product_cost":1
            }
        }
       
        ]
       
            return cartDao.aggregateCart(agrgegateQuery).then((productDetail) => {                    
                        
                        
                        return cartMapper.responseMappingData(cartConstants.CODE.Success, cartConstants.MESSAGES.Cart_By_EmployeeId, productDetail)
    
                    
                }).catch((err) => {
                    return cartMapper.responseMapping(cartConstants.CODE.INTRNLSRVR, cartConstants.MESSAGES.internalServerError)
        
                });
   
}

module.exports = {
    cartAdd,
    cartList,
    getCartById,
    deleteCart,
    getCartByEmployeeId

};