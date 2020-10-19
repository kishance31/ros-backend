const employeeService = require('./employeeService');

function employeeAdd(data) {
    return employeeService.employeeAdd(data).then(result => result)
    
}
function employeeAddMultiple(data) {
    return employeeService.employeeAddMultiple(data).then(result => result)
    
}
function employeeDeleteById(data, userDetails) {
    return employeeService.deleteEmployee(data, userDetails).then(data=> data)
      
}

function getEmployeeList(req) {
    return employeeService.employeeList(req).then(result =>result)
}
function sendMail(employee,req) {
    return  employeeService.sendMail(employee,req);
};

function getEmployeeById(req) {
    return employeeService.getEmployeeById(req).then(result => result)
}

function getCorporateEmployees(req, batch, limit) {
    return employeeService.getCorporateEmployees(req, batch, limit).then(result => result)
}

function updateEmployeeById(req,updateData) {
    return employeeService.employeeEditById(req,updateData).then(result => 
        result)
}

function loginEmployee(loginDetails) {
    return employeeService.loginEmployee(loginDetails).then(result => 
        result)
}

// Logout
async function logout(data) {
    try {
        return await employeeService.logout(data);
    } catch (err) {
        return err;
    }
};

async function setPassword(data) {
    try {
        return await employeeService.setPassword(data);
    } catch (err) {
        return err;
    }
};
function placeOrder(data) {
    return employeeService.placeOrder(data).then(result => result)
    
}
function updateOrderDetails(req,updateData) {
    return employeeService.orderEditById(req,updateData).then(result => 
        result)
}
function getOrderListByEmployee(req) {
    return employeeService.getOrderListByEmployee(req).then(result =>result)
}
function getEmployeeOrder(employeeId, batch, limit) {
    return employeeService.getEmployeeOrder(employeeId, batch, limit).then(result => 
        result)
}
function cancelEmployeeOrder(orderId) {
    return employeeService.cancelEmployeeOrder(orderId).then(result =>result)
}
function deactiveEmployee(id, data) {
    return employeeService.deactiveEmployee(id, data).then(result =>result)
}
module.exports = {
    employeeAdd,
    employeeAddMultiple,
    employeeDeleteById,
    getEmployeeList,
    getEmployeeById,
    updateEmployeeById,
    getCorporateEmployees,
    loginEmployee,
    logout,
    setPassword,
    placeOrder,
    updateOrderDetails,
    getOrderListByEmployee,
    getEmployeeOrder,
    cancelEmployeeOrder,
    deactiveEmployee,
    sendMail
}