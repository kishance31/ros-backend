const employeeService = require('./employeeService');

function employeeAdd(data) {
    return employeeService.employeeAdd(data).then(result => result)
    
}

function employeeDeleteById(data) {
    return employeeService.deleteEmployee(data).then(data=> data)
      
}

function getEmployeeList(req) {
    return employeeService.employeeList(req).then(result =>result)
}

function getEmployeeById(req) {
    return employeeService.getEmployeeById(req).then(result => result)
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
    updateEmployeeById
}