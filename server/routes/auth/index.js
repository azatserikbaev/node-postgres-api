const express = require('express'),
    bcrypt = require('bcrypt'),
    pool = require('../../utils/pool'),
    jwt = require('../../utils/jwt');

require('dotenv').config();


const router = express.Router();


router.post('/', async (req, res, next) => {
    var user = {},
      pass_from_db;

    user.username = req.body.username;
    user.password = req.body.password;
    if(user.username) {
        try {
            const {rowCount, rows} = await pool.query('SELECT u.password FROM "User" u WHERE username = $1;', [user.username]);
            if (rowCount === 0) {
                return res.status(400).send( {error: 'User not found'});
            }
            pass_from_db = rows[0].password;

            bcrypt.compare(user.password, pass_from_db, (err, result) => {
                if (result) {
                    const token = jwt.generateAcessToken({username: user.username});
                    res.status(200).send({ message: 'Authenticated successfully', token: token});
                } else {
                    res.status(401).send({ error: 'Wrong password'});
                }
            });
        } catch(err) {
            return next(err);
        }

    } else {
        res.status(400).send({ error: 'username not specified.'})
    }
});

module.exports = router;