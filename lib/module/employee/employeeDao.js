
const User = require('../../model/userModel');
// const appUtil = require("../../appUtils");
const BaseDao = new require('./../../dao/baseDao');
const employeeDao = new BaseDao(User);

async function employeeById(_query) {
    return await employeeDao.findOne(_query);
}

 function saveEmployee(userInfo) {
    let user = new User(userInfo);
    return  employeeDao.save(user);
};

async function employeeList() {
    return await employeeDao.find();
}

async function updateEmployee(data,_update) {
    try {
        let query = {};
        query._id = data._id;
        
       
        return await employeeDao.findOneAndUpdate(query, _update);
    } catch (err) {
        return err;
    }
};

async function deleteEmployee(data) {
    try {
        let query = {};
        query._id = data._id;

      
        return await employeeDao.remove(query);
    } catch (err) {
        return err;
    }
};

module.exports = {
    employeeById,
    saveEmployee,
    employeeList,
    updateEmployee,
    deleteEmployee
  
};
