const uploadRouter = require('express').Router();
const responseHandler = require('../responseHandler');
let fileUpload = require('express-fileupload');
uploadRouter.use(fileUpload({
    useTempFiles: true
}));
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'ncc-corporation-inc',
    api_key: '842737327941694',
    api_secret: 'Po-e6X_oq7iX70r9fqfVP4lsTOI'
})

uploadRouter.post('/upload', (req, res) => {
    let sampleFile = req.files.sampleFile;
    cloudinary.uploader.upload(sampleFile.tempFilePath)
        .then((result) => {
            responseHandler.sendSuccess(res, result);
        })
        .catch((err) => {
            responseHandler.sendError(res, err);
        });
});

module.exports = uploadRouter;