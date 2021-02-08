// 'use strict';

//===============================Load Modules Start========================

const bodyParser = require("body-parser"),//parses information from POST
cors = require('cors'), //sets cors headers
helmet = require('helmet'), //set secure headers
morganMiddleware = require('../middlewares/morganMiddleware');  //logs every incoming requests
const fileUpload = require("express-fileupload");//parses information from POST
const path = require('path');

module.exports = function (app, env, express) {
     // parses application/json bodies
     app.use(bodyParser.json());
     // parses application/x-www-form-urlencoded bodies
     // use queryString lib to parse urlencoded bodies
     app.use(bodyParser.urlencoded({ extended: false }));
     app.use(fileUpload());

     app.use('/static', express.static(path.resolve(app.locals.rootDir, 'public')));

    //set cors headers
    app.use(cors());

    //set secure headers
    app.use(helmet());
    
    //to log every incoming request details
    app.use(morganMiddleware);

    // parses application/json bodies

};
