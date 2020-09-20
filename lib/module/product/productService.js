'use strict';


const productDao = require('./productDao');
const productMapper = require('./productMapper');
const productConstants = require("./productConstants");


async function productAdd(productDetails) {
    logger.debug(`Inside productservices`);
    try {
        let productImage = productDetails.files;
        // if (productImage) {
        //     const resultTemp = await cloudinary.uploader.upload(productImage.tempFilePath)
        //     productDetails.product_image = resultTemp.secure_url

        // }
        if (typeof (productImage) != "undefined" && productImage != null) {

            if (typeof (productImage) != "undefined") {

                var str = productImage.name
                productImage.name = str.replace(/\s/g, "_");
                await uploadImage(productImage).then((result) => {
                    productDetails.product_image = result
                   
                })
            } else {
                productDetails.product_image = ''
            }
        }

        return productDao.saveProduct(productDetails).then((data) => {

            return productMapper.responseMappingData(productConstants.CODE.Success, productConstants.MESSAGES.Product_Added, data)


        }).catch((err) => {

            console.log({ err })
            return productMapper.responseMapping(productConstants.CODE.INTRNLSRVR, productConstants.MESSAGES.internalServerError)
        })

    } catch (err) {
        return err;
    }
};


function productList() {
    try {
        return productDao.productList().then((data) => {
            return productMapper.responseMappingData(productConstants.CODE.Success, productConstants.MESSAGES.Product_Listed, data)


        }).catch((err) => {

            console.log({ err })
            return branchMapper.responseMapping(productConstants.CODE.INTRNLSRVR, productConstants.MESSAGE.internalServerError)
        })
    } catch (err) {
        return err;
    }

}
function getProductById(id) {
    try {
        return productDao.productById(id).then((data) => {
            return productMapper.responseMappingData(productConstants.CODE.Success, productConstants.MESSAGES.Product_By_Id, data)

        }).catch((err) => {
            return productMapper.responseMapping(productConstants.CODE.INTRNLSRVR, productConstants.MESSAGES.internalServerError)

        })                                                                                                                                                     
    } catch (err) {
        return err;
    }

}
async function productEditById(id, data) {
    try {
        return  productDao.updateProduct(id, data).then((data) => {
            return productMapper.responseMappingData(productConstants.CODE.Success, productConstants.MESSAGES.Product_Update, data)

        }).catch((err)=>{
            return productMapper.responseMapping(productConstants.CODE.INTRNLSRVR, productConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

function deleteProduct(id) {
    try {
        return productDao.deleteProduct(id).then((data) => {
            return productMapper.responseMapping(productConstants.CODE.Success, productConstants.MESSAGES.Product_Deleted)

        }).catch((err)=>{
            return productMapper.responseMapping(productConstants.CODE.INTRNLSRVR, productConstants.MESSAGES.internalServerError)


        })
    } catch (err) {
        return err;
    }
}

async function uploadImage(image) {

    let filename = image.name;
    await image.mv('./uploads/' + filename, function (err) {

        if (err) {
            return err
        }
    });
    return filename;
}

module.exports = {
    productAdd,
    productList,
    getProductById,
    productEditById,
    deleteProduct,
    uploadImage

};