const cartService = require('./cartService');


// skv_adminpanal : add project
function cartAdd(data) {
    return cartService.cartAdd(data).then(result => result)
    
}

function cartDeleteById(data) {
    return cartService.deleteCart(data).then(data=> data)
      
}

function getCartList(req) {
    return cartService.cartList(req).then(result =>result)
}

function getCartById(req) {
    return cartService.getCartById(req).then(result => result)
}

function getCartByEmployeeId(req) {
    return cartService.getCartByEmployeeId(req).then(result => result)
}
function removeProductFromCart(...args) {
    return cartService.removeProductFromCart(...args).then(result => result)
}

module.exports = {
    cartAdd,
    cartDeleteById,
    getCartList,
    getCartById,
    removeProductFromCart,
    getCartByEmployeeId,
   
}