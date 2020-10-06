const mongoose = require('mongoose');
const constants = require('../constants');

const Schema = mongoose.Schema;

const AdminRolesSchema = new Schema({
    adminId: {
        type: String,
        require: true,
    },
    roleName: {
        type: String,
        require: true,
    },
    permissions: [{
        type: Object,
        default: []
    }]                         
    // permissions: {
    //     type: [
    //         Schema({
    //             formName: String,
    //             route: String,
    //             perimission: [{
    //                 type: String,
    //                 default: []
    //             }]
    //         })
    //     ],
    //     default: []
    // }
}, {
    timestamps: true,
});



module.exports = mongoose.model(constants.DB_MODEL_REF.ADMIN_ROLES, AdminRolesSchema);