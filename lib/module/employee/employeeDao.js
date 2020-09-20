
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

async function loginEmployee(loginInfo) {
    try {
        let query = {};
        query._id = loginInfo.userId;

        let update = {};
        update['$addToSet'] = { tokens: loginInfo.tokens };

        employeeDao.findOneAndUpdate(query, update);
    } catch (err) {
        console.log(err);
        return null
    }
}

//logout
function logoutUser(data) {
    try {
        let query = {};
        query._id = data.userId;

        let update = {};
        if (data.tokens) {
            update.$pull = { tokens: data.tokens };
        }

        let options = {};
        options.returnNewDocument = data.returnNewDocument;

        return employeeDao.findOneAndUpdate(query, update, options);
    } catch (err) {
        logger.info(err);
    }
};

async function setPassword(data, projection) {
    try {
        let query = {
            _id: data.userId,
            email: data.email,
        };
        let update = {
            // $pull: {tokens: data.oldToken},
            // $addToSet: {tokens: data.newToken},
            $set: {password: data.newPassword, isFirstLogin: false},
        };
        const options = {
            returnNewDocument: true,
            returnOriginal: false,
            upsert: false,
            projection: {...projection}
        }
        return employeeDao.findOneAndUpdate(query, update, options);
    } catch (error) {
        logger.warn(error);
        return null;
    }
}

module.exports = {
    employeeById,
    saveEmployee,
    employeeList,
    updateEmployee,
    deleteEmployee
  
};
