const jwt = require('jsonwebtoken');

require('dotenv').config();

const generateAcessToken = (username) => {
    return jwt.sign(username, process.env.TOKEN_SECRET, {});
}

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401); // if there's no token

    jwt.verify(token, process.env.TOKEN_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    })
}

module.exports = {
    generateAcessToken,
    authenticateToken
};