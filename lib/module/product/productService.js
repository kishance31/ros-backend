"use strict";

const productDao = require("./productDao");
const productMapper = require("./productMapper");
const productConstants = require("./productConstants");

async function productAdd(productDetails) {
  logger.debug(`Inside productservices`);
  try {
    let productImage = productDetails.files;

    let productFirstThreemonthCost = (parseInt(productDetails.product_cost) / 12) * 3;

    productDetails.first_three_month_cost = productFirstThreemonthCost
    // if (productImage) {
    //     const resultTemp = await cloudinary.uploader.upload(productImage.tempFilePath)
    //     productDetails.product_image = resultTemp.secure_url

    // }
    if (typeof productImage != "undefined" && productImage != null) {
      if (typeof productImage != "undefined") {
        var str = productImage.name;
        productImage.name = str.replace(/\s/g, "_");
        await uploadImage(productImage).then((result) => {
          productDetails.product_image = result;
        });
      } else {
        productDetails.product_image = "";
      }
    }

    return productDao
      .saveProduct(productDetails)
      .then((data) => {
        return productMapper.responseMappingData(
          productConstants.CODE.Success,
          productConstants.MESSAGES.Product_Added,
          data
        );
      })
      .catch((err) => {
        console.log({ err });
        return productMapper.responseMapping(
          productConstants.CODE.INTRNLSRVR,
          productConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return err;
  }
}

function productList(req) {

  let query = {};

  if (req.body.product_name) {
    query = {
      product_name: {
        $regex: req.body.product_name,
      },
    };
  }
  if (req.body.category_id) {
    
    query.category_id = req.body.category_id

    };
    if (req.body.sub_category_id) {
    
      query.sub_category_id = req.body.sub_category_id
  
      };

  return productDao
    .productList(query)
    .then((data) => {
      return productMapper.responseMappingData(
        productConstants.CODE.Success,
        productConstants.MESSAGES.Product_Listed,
        data
      );
    })
    .catch((err) => {
      console.log({ err });
      return branchMapper.responseMapping(
        productConstants.CODE.INTRNLSRVR,
        productConstants.MESSAGE.internalServerError
      );
    });
}
function getProductById(id) {
  try {
    return productDao
      .productById(id)
      .then((data) => {
        return productMapper.responseMappingData(
          productConstants.CODE.Success,
          productConstants.MESSAGES.Product_By_Id,
          data
        );
      })
      .catch((err) => {
        return productMapper.responseMapping(
          productConstants.CODE.INTRNLSRVR,
          productConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return err;
  }
}
async function productEditById(id, data) {
  try {
    return productDao
      .updateProduct(id, data)
      .then((data) => {
        return productMapper.responseMappingData(
          productConstants.CODE.Success,
          productConstants.MESSAGES.Product_Update,
          data
        );
      })
      .catch((err) => {
        return productMapper.responseMapping(
          productConstants.CODE.INTRNLSRVR,
          productConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return err;
  }
}

function deleteProduct(id) {
  try {
    return productDao
      .deleteProduct(id)
      .then((data) => {
        return productMapper.responseMapping(
          productConstants.CODE.Success,
          productConstants.MESSAGES.Product_Deleted
        );
      })
      .catch((err) => {
        return productMapper.responseMapping(
          productConstants.CODE.INTRNLSRVR,
          productConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return err;
  }
}

async function uploadImage(image) {
  let filename = image.name;
  await image.mv("./uploads/" + filename, function (err) {
    if (err) {
      return err;
    }
  });
  return filename;
}
function getproductBylicenseId(id) {
  try {
    return productDao
      .getproductBylicenseId(id)
      .then((data) => {
        return productMapper.responseMappingData(
          productConstants.CODE.Success,
          productConstants.MESSAGES.Product_By_License,
          data
        );
      })
      .catch((err) => {
        return productMapper.responseMapping(
          productConstants.CODE.INTRNLSRVR,
          productConstants.MESSAGES.internalServerError
        );
      });
  } catch (err) {
    return err;
  }
}

module.exports = {
  productAdd,
  productList,
  getProductById,
  productEditById,
  deleteProduct,
  uploadImage,
  getproductBylicenseId,
};
