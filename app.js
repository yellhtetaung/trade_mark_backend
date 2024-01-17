require('dotenv/config');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const bcrypt = require('bcrypt');

const router = require('./src/router');
const mysql = require('./src/config/db.config');

const app = express();
const port = process.env.PORT || 8000;

// middlewares
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
app.use(fileUpload({ limits: { fileSize: 10 * 1024 * 1024 }, createParentPath: 'public' }));

app.get('/create', (req, res) => {
    mysql.query(`SELECT * FROM user WHERE email='admin@gmail.com'`, (error, data) => {
        if (error) throw error;

        if (data.length === 0) {
            const hashPassword = bcrypt.hashSync('admin@1234', 10);

            mysql.query(
                'INSERT INTO User SET ?',
                {
                    username: 'admin',
                    password: hashPassword,
                    email: 'admin@gmail.com',
                    role: 'Admin',
                },
                error => {
                    if (error) return res.status(500).json({ error: 'Something Wrong!' });
                    return res.status(200).json({ message: 'Admin account has been created' });
                },
            );
        }
    });
});

app.use(router);

app.listen(port, () => console.log(`Server is listening on port ${port}`));

module.exports = app;
