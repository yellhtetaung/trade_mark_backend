const prisma = require('../config/db.config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (!existingUser) {
            throw new Error('This email does not registered');
        }

        if (!existingUser.active) {
            throw new Error('This user is inactive');
        }

        if (existingUser) {
            const comparePassword = bcrypt.compareSync(password, existingUser.password);

            if (!comparePassword) {
                throw new Error('Incorrect password');
            }

            const token = jwt.sign(existingUser, 'trademark', {
                expiresIn: 24 * 60 * 60 * 1000,
            });

            res.status(200).json({ message: 'Login successful', token });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.authorization = async (req, res) => {
    try {
        const token = req.headers.authorization;
        jwt.verify(token, 'trademark', { complete: true }, (error, decoded) => {
            if (error) {
                throw new Error(error);
            }

            res.status(200).json({ message: decoded.payload.role });
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};
