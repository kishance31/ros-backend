"use strict";

const productDao = require("./productDao");
const productMapper = require("./productMapper");
const productConstants = require("./productConstants");
const { streamUploadToCloudinary, writeFilesAsync } = require('../../appUtils');

async function productAdd(productDetails) {
	logger.debug(`Inside productservices`);
	try {
		let productImage = productDetails.files;
		if (productImage.length || productImage.data) {
			if(productImage.data) {
				productImage = [productImage];
			}
			logger.info(productImage);
			// productDetails.product_image = await Promise.all(productImage.map(prod => streamUploadToCloudinary(prod.data)));
			productDetails.product_image = await Promise.all(productImage.map(prod => writeFilesAsync(prod, 'products')));

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
					console.log(err);
					return productMapper.responseMapping(
						productConstants.CODE.INTRNLSRVR,
						productConstants.MESSAGES.internalServerError
					);
				});
		}
	} catch (err) {
		console.log(err);
		return err;
	}
}

function getAllProductList(prodDetails, batch, limit, role) {
	return productDao
		.productList(prodDetails, batch, limit, role)
		.then((data) => {
			return productMapper.responseMappingList(
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

function productList(prodDetails, batch, limit, role) {
	prodDetails.status = true;
	return productDao
		.productList(prodDetails, batch, limit, role)
		.then((data) => {
			return productMapper.responseMappingList(
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
		if (data.product_images) {
			let resultArr = await Promise.all(data.product_images.map(prod => streamUploadToCloudinary(prod.data)));
			data.product_image = [...data.product_image, ...resultArr];
		}
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
		console.log(err);
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
	getAllProductList,
	getProductById,
	productEditById,
	deleteProduct,
	uploadImage,
	getproductBylicenseId,
};
