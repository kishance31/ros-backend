// 'use strict';

//===============================Load Modules Start========================

const bodyParser = require("body-parser"),//parses information from POST
cors = require('cors'), //sets cors headers
helmet = require('helmet'), //set secure headers
morganMiddleware = require('../middlewares/morganMiddleware'); 
const fileUpload = require("express-fileupload");//parses information from POST
//logs every incoming requests
module.exports = function (app, env) {
     // parses application/json bodies
     app.use(bodyParser.json());
     // parses application/x-www-form-urlencoded bodies
     // use queryString lib to parse urlencoded bodies
     app.use(bodyParser.urlencoded({ extended: false }));
     app.use(fileUpload());

    //set cors headers
    app.use(cors());

    //set secure headers
    app.use(helmet());
    
    //to log every incoming request details
    app.use(morganMiddleware);

    // parses application/json bodies

};
