// load all dependencies
const Promise = require("bluebird");
const jwt = Promise.promisifyAll(require("jsonwebtoken"));
const exceptions = require('./customException');
const appConstants = require('./constants');
const TOKEN_EXPIRATION_SEC = appConstants.TOKEN_EXPIRATION_TIME * 60;

const EMAIL_LINK_EXP_TIME = '2d';
const JWT_ALGORITHM = 'RS256';
const JWT_SECRET_KEY = "a1p2a3r4t5m6y7n8t9s10";

const genUsrToken = async function (user) {
    var options = { expiresIn: '7w' };

    try {
        const token = await jwt.signAsync(user, JWT_SECRET_KEY, options);

        if (token) {
            return token;
        }
    } catch (err) {
        return new exceptions.tokenGenException();        
    }
};

const genAdminToken = function (admin, setExpire) {
    var options = {};

    return jwt.signAsync(admin, JWT_SECRET_KEY, options)
        .then(function (jwtToken) {
            return jwtToken;
        })
        .catch(function (err) {
            throw new exceptions.tokenGenException();
        });
};

const verifyUsrToken = function (acsTokn) {    
    return jwt.verifyAsync(acsTokn, JWT_SECRET_KEY)
        .then(function (tokenPayload) {
            return this.tokenPayload = tokenPayload;
        })
        .catch(function (err) {
            throw new exceptions.unauthorizeAccess(err);
        });
};

const verifyUsrForgotPassToken = function (acsTokn) {
    return jwt.verifyAsync(acsTokn, JWT_SECRET_KEY)
        .then(function (tokenPayload) {
            return tokenPayload;
        })
        .catch(function (err) {
            throw new exceptions.unauthorizeAccess(err);
        });
};

const expireToken = function (req) {
    var token = req.get('accessToken');
    console.log(token);
    
    if (token) {
        //blacklist token in redis db
        //it will be removed after 6 months
        redisClient.setValue(token, true);
        redisClient.expire(token, TOKEN_EXPIRATION_SEC);
    }
};
module.exports = {
    genUsrToken,
    verifyUsrToken,
    expireToken,
    genAdminToken,
    verifyUsrForgotPassToken
};
