
const responseHandler = require('./../commonHandler/responseHandler');
const corporateAdminRouter = require('../module/corporate-admin');
const adminRouter = require('../module/admin');
const licenseRouter = require('../module/licenses');
const purchaseLicenseRouter = require('../module/corporate-purchase-license');
// const uploadRouter = require('./module/upload/upload');

module.exports = function (app) {

    // Attach User Routes
    app.use('/api/corporate-admin', corporateAdminRouter);
    app.use('/api/admin', adminRouter);

    //license routes
    app.use('/api/license', licenseRouter);
    app.use('/api/corporate-admin/purchaseLicense', purchaseLicenseRouter)

    app.use(responseHandler.hndlError);
};
