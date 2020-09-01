const employeeService = require('./employeeService');

function employeeAdd(data) {
    return employeeService.employeeAdd(data).then(result => result)
    
}

function employeeDeleteById(data, userDetails) {
    return employeeService.deleteEmployee(data, userDetails).then(data=> data)
      
}

function getEmployeeList(req) {
    return employeeService.employeeList(req).then(result =>result)
}

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


module.exports = {
    employeeAdd,
    employeeDeleteById,
    getEmployeeList,
    getEmployeeById,
    updateEmployeeById,
    getCorporateEmployees
}