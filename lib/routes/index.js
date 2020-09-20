
const responseHandler = require('./../commonHandler/responseHandler');
const corporateAdminRouter = require('../module/corporate-admin');
const adminRouter = require('../module/admin');
const branchRouter = require('../module/branch/branchRoute');
const employeeRouter = require('../module/employee/employeeRoute');
const licenseRouter = require('../module/licenses');
const purchaseLicenseRouter = require('../module/corporate-purchase-license');
const adminRolesRouter = require('../module/admin-roles');

// const uploadRouter = require('./module/upload/upload');

module.exports = function (app) {

    // Attach User Routes
    app.use('/api/admin', adminRouter);
    app.use('/api/admin/role', adminRolesRouter);
    app.use('/api/corporate-admin', corporateAdminRouter);
    app.use('/api/admin', adminRouter);
   

    //license routes
    app.use('/api/license', licenseRouter);
    app.use('/api/corporate-admin/purchaseLicense', purchaseLicenseRouter)
    app.use('/api/branch',branchRouter)
    app.use('/api/corporate-admin/employee',employeeRouter)
    app.use(responseHandler.hndlError);
};
