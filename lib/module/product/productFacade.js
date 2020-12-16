const productService = require('./productService');


function productAdd(data) {
    return productService.productAdd(data).then(result => result)

}

function productDeleteById(data) {
    return productService.deleteProduct(data).then(data => data)

}

function getAllProductList(req, batch, limit, role) {
    return productService.getAllProductList(req, batch, limit, role).then(result => result)
}

function getProductList(req, batch, limit, role) {
    return productService.productList(req, batch, limit, role).then(result => result)
}

function getProductById(req) {
    return productService.getProductById(req).then(result => result)
}


async function updateProductById(req, updateData, reqs) {

    // if (reqs.files) {
    //     if (reqs.files.product_image) {
    //         var str = reqs.files.product_image.name
    //         reqs.files.product_image.name = str.replace(/\s/g, "_");
    //         await uploadImage(reqs.files.product_image).then((result) => {
    //             updateData.product_image = result
    //         })
    //     }
    // }
    if (reqs.files && reqs.files.product_images) {
        updateData.product_images = reqs.files.product_images
    }
    return productService.productEditById(req, updateData).then(result =>
        result)
}

function getProductByLicense(req) {
    return productService.getproductBylicenseId(req).then(result => result)

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

function productAddToCart(data) {
    return productService.productAddToCart(data).then(result => result)

}

module.exports = {
    productAdd,
    productDeleteById,
    getProductList,
    getAllProductList,
    getProductById,
    updateProductById,
    uploadImage,
    getProductByLicense,
    productAddToCart
}