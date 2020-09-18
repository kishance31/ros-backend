const productService = require('./productService');


function productAdd(data) {
    return productService.productAdd(data).then(result => result)
    
}

function productDeleteById(data) {
    return productService.deleteProduct(data).then(data=> data)
      
}

function getProductList(req) {
    return productService.productList(req).then(result =>result)
}

function getProductById(req) {
    return productService.getProductById(req).then(result => result)
}


async function updateProductById(req,updateData,reqs) {
   
        if (reqs.files) {
            if (reqs.files.product_image) {
                var str = reqs.files.product_image.name
                reqs.files.product_image.name = str.replace(/\s/g, "_");
                await uploadImage(reqs.files.product_image).then((result) => {
                    updateData.product_image = result
                })
            }

        }
  
    return productService.productEditById(req,updateData).then(result => 
        result)
}

function getProductByLicense(req){
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


module.exports = {
    productAdd,
    productDeleteById,
    getProductList,
    getProductById,
    updateProductById,
    uploadImage,
    getProductByLicense
}