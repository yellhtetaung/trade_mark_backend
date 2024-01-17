const mysql = require('../config/db.config.js');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

exports.getAllHandler = (req, res) => {
    const { page, pageSize, sortField, sortOrder } = req.query;
    const skip = Number(page) * Number(pageSize);

    if (!page && !pageSize) {
        mysql.query(`SELECT * FROM user WHERE email!='admin@gmail.com'`, (error, data) => {
            if (error) return res.status(500).json({ message: 'Something Wrong' });

            if (data.length === 0) {
                return res.status(500).json({ message: 'User not found' });
            }

            return res.status(200).json({ data: data });
        });
    } else {
        mysql.query(`SELECT * FROM User WHERE email!='admin@gmail.com' ORDER BY ${sortField} ${Number(sortOrder) === 1 ? 'ASC' : 'DESC'} LIMIT ${skip}, ${Number(pageSize)}`, (error, users) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            mysql.query(`SELECT COUNT(*) AS totalUsers FROM User WHERE email!='admin@gmail.com'`, (error, data) => {
                if (error) return res.status(500).json({ message: 'Something Wrong!' });

                return res.status(200).json({ data: users, totalUsers: data[0].totalUsers });
            });
        });
    }
};

exports.searchHandler = async (req, res) => {
    const { page, pageSize, filteredValue, searchField } = req.query;
    const skip = Number(page) * Number(pageSize);

    mysql.query(`SELECT * FROM User WHERE ${filteredValue} LIKE '${searchField}%' AND email!='admin@gmail.com' LIMIT ${skip}, ${Number(pageSize)}`, (error, user) => {
        if (error) return res.status(500).json({ message: 'Something Wrong!' });

        if (!user.length) {
            return res.status(200).json({ message: 'User not found' });
        }

        mysql.query(`SELECT COUNT(*) AS count FROM User WHERE ${filteredValue} LIKE '${searchField}%' AND email!='admin@gmail.com'`, (error, count) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            return res.status(200).json({ data: user, totalUsers: count.count });
        });
    });
};

exports.createHandler = (req, res) => {
    if (Object.keys(req.body).length === 0) {
        throw new Error('Content cannot be empty!');
    }

    const { username, email, password, phoneNumber, nrc, address, role } = req.body;

    if (!emailValidator.validate(email)) {
        return res.status(500).json({ message: 'Invalid email' });
    }

    mysql.query(`SELECT * FROM User WHERE email='${email}'`, (error, data) => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something Wrong!' });
        }

        if (data.length > 0) {
            return res.status(500).json({ message: 'Email already existed.' });
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        mysql.query('INSERT INTO User SET ?', { username, email, password: hashPassword, phone_no: phoneNumber, nrc, address, role }, error => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something Wrong!' });
            }
            return res.status(201).json({ message: 'User created successfully' });
        });
    });
};

exports.updateHandler = async (req, res) => {
    const id = req.params.id;

    if (Object.keys(req.body).length === 0) {
        throw new Error('Content cannot be empty!');
    }

    const { username, email, password, phone_no, nrc, address, active, role } = req.body;

    mysql.query(`UPDATE User SET username='${username}', email='${email}', password='${password}', phone_no=${phone_no}, nrc='${nrc}', address='${address}', active=${active === 1 ? true : false}, role='${role}' WHERE id='${id}'`, error => {
        if (error) {
            console.log(error);
            return res.status(500).json({ message: 'Something Wrong!' });
        }
        return res.status(200).json({ message: 'User updated successfully' });
    });
};

exports.deleteHandler = async (req, res) => {
    if (!req.params.id) {
        throw new Error('Id is required');
    }

    mysql.query(`SELECT * FROM User WHERE id='${req.params.id}'`, (error, data) => {
        if (error) {
            console.log(error);
            return res.status(200).json({ message: 'Something Wrong' });
        }

        if (data.length === 0) {
            return res.status(500).json({ message: 'User not found' });
        }

        mysql.query(`DELETE FROM User WHERE id='${req.params.id}'`, error => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            return res.status(200).json({ message: 'User deleted successfully' });
        });
    });
};
