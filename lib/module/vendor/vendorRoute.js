const vendorRouter = require('express').Router();
const vendorFacade = require('./vendorFacade');
const authMiddleware = require('../../middlewares/auth');
const responseHandler = require('../../commonHandler/responseHandler');
const validators = require('./vendorValidators')
let fileUpload = require('express-fileupload');
vendorRouter.use(fileUpload({
    useTempFiles: true
}));
vendorRouter.route('/saveVendor').post([validators.validateVendor,authMiddleware.autntctAdminTkn],(req, res) => {
    let vendorObj = req.body;
    vendorFacade.vendorAdd(vendorObj)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            logger.error(`ERROR `, err );
            responseHandler.sendError(res, err);
        });
});
//validators.checkUsrValidation,validators.validateVendor
vendorRouter.route('/getVendorList').get([authMiddleware.autntctAdminTkn],(req, res) => {
   
    vendorFacade.getVendorList()
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
});

vendorRouter.route('/getVendorById/:id').get([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    vendorFacade.getVendorById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

vendorRouter.route('/updateVendor/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    vendorFacade.updateVendorById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

vendorRouter.route('/deleteVendor/:id').delete([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    vendorFacade.vendorDeleteById(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})
vendorRouter.route('/getVendorByCorporateId/:id').get([authMiddleware.autntctTkn],(req, res) => {
    const data = {
        corporate_admin_id: req.params.id
    };
    vendorFacade.getVendorByCorporateId(data)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

vendorRouter.route('/updateVendorStatus/:id').put([authMiddleware.autntctAdminTkn],(req, res) => {
    const data = {
        _id: req.params.id
    };
    vendorFacade.updateVendorStatusById(data,req.body)
        .then(result => {
            responseHandler.sendSuccess(res, result);
        })
        .catch(err => {
            responseHandler.sendError(res, err);
        });
})

module.exports = vendorRouter;