const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    try {
        const { authorization } = req.headers;
        const token = authorization.split(' ')[1];
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        const { username, userId } = decode;
        req.username = username;
        req.userId = userId;
        next();
    } catch (error) {
        next('Authentication Failure!');
    }
};

module.exports = checkLogin;
