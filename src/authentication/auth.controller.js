const mysql = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        mysql.query(`SELECT * FROM User WHERE email='${email}'`, (error, data) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            if (data.length === 0) {
                return res.status(500).json({ message: 'This email does not registered' });
            }

            if (!data[0].active) {
                return res.status(500).json({ message: 'This user is inactive' });
            }

            const comparePassword = bcrypt.compareSync(password, data[0].password);

            if (!comparePassword) {
                return res.status(500).json({ message: 'Incorrect password' });
            }

            const token = jwt.sign(data[0], 'trademark', {
                expiresIn: 24 * 60 * 60 * 1000,
            });

            return res.status(200).json({ message: 'Login successful', token });
        });
    }
};

exports.authorization = (req, res) => {
    const token = req.headers.authorization;

    jwt.verify(token, 'trademark', { complete: true }, (error, decoded) => {
        if (error) {
            return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ message: decoded.payload.role });
    });
};
