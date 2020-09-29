
const responseHandler = require('./../commonHandler/responseHandler');
const corporateAdminRouter = require('../module/corporate-admin');
const adminRouter = require('../module/admin');
const vendorRouter = require('../module/vendor/vendorRoute');
const branchRouter = require('../module/branch/branchRoute');
const employeeRouter = require('../module/employee/employeeRoute');
const categoryRouter = require('../module/category/categoryRoute');
const subcategoryRouter = require('../module/subcategory/subcategoryRoute');
const productRouter = require('../module/product/productRoute');
const cartRouter = require('../module/cart/cartRoute');
const licenseRouter = require('../module/licenses');
const purchaseLicenseRouter = require('../module/corporate-purchase-license');

// const uploadRouter = require('./module/upload/upload');

module.exports = function (app) {

    // Attach User Routes
    app.use('/api/admin', adminRouter);
    app.use('/api/admin/vendor', vendorRouter);
    app.use('/api/corporate-admin', corporateAdminRouter);
    app.use('/api/corporate-admin/employee',employeeRouter)
    app.use('/api/corporate-admin/category',categoryRouter)
    app.use('/api/corporate-admin/sub-category',subcategoryRouter)
    app.use('/api/corporate-admin/product',productRouter)
    app.use('/api/employee/cart',cartRouter)

    //license routes
    app.use('/api/license', licenseRouter);
    app.use('/api/corporate-admin/purchaseLicense', purchaseLicenseRouter)

    app.use('/api/branch',branchRouter)
    app.use(responseHandler.hndlError);
};
