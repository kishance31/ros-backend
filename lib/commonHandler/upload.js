const uploadRouter = require('express').Router();
const responseHandler = require('../responseHandler');
let fileUpload = require('express-fileupload');
uploadRouter.use(fileUpload({
    useTempFiles: true
}));
var cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dljkawvlg',
    api_key: '228612331659815',
    api_secret: 'kbXvRMrdv4UV9NCbqcX29_m8zJI'
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