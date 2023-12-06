const prisma = require('../config/db.config.js');
const emailValidator = require('email-validator');
const bcrypt = require('bcrypt');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize, sortField, sortOrder } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const users = await prisma.user.findMany({
                select: {
                    username: true,
                    email: true,
                    phone_no: true,
                    nrc: true,
                    address: true,
                    active: true,
                    role: true,
                },
            });

            if (!users) {
                throw new Error('User not found');
            }

            return res.status(200).json({ data: users });
        }

        const [users, totalUsers] = await prisma.$transaction([
            prisma.user.findMany({
                skip,
                take: Number(pageSize),
                orderBy: {
                    [sortField]: Number(sortOrder) === 1 ? 'asc' : 'desc',
                },
            }),
            prisma.user.count(),
        ]);

        if (!users.length) {
            throw new Error('Users not found');
        }

        res.status(200).json({ data: users, totalUsers });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.searchHandler = async (req, res) => {
    try {
        const { page, pageSize, filteredValue, searchField } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (filteredValue !== 'null') {
            const [user, totalUsers] = await prisma.$transaction([
                prisma.user.findMany({
                    skip,
                    take: Number(pageSize),
                    where: {
                        [filteredValue]: {
                            contains: searchField,
                        },
                    },
                }),
                prisma.user.count({
                    where: {
                        [filteredValue]: {
                            contains: searchField,
                        },
                    },
                }),
            ]);

            if (!user.length) {
                throw new Error('User not found');
            }

            res.status(200).json({ data: user, totalUsers });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createHandler = async (req, res) => {
    try {
        if (Object.keys(req.body).length === 0) {
            throw new Error('Content cannot be empty!');
        }

        const { username, email, password, phoneNumber, nrc, address } = req.body;

        if (!emailValidator.validate(email)) {
            throw new Error('Invalid email');
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) {
            throw new Error('Email already exists');
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashPassword,
                phone_no: phoneNumber,
                nrc,
                address,
            },
        });

        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    try {
        const id = req.params.id;

        if (Object.keys(req.body).length === 0) {
            throw new Error('Content cannot be empty!');
        }

        const { username, email, password, phone_no, nrc, address, active, role } = req.body;
        const updateUser = {
            username,
            email,
            password,
            phone_no,
            nrc,
            address,
            active,
            role,
        };

        await prisma.user.update({
            where: { id },
            data: updateUser,
        });

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Id is required');
        }

        const existingUser = await prisma.user.findUnique({
            where: { id: req.params.id },
        });

        if (!existingUser) {
            throw new Error('User not found');
        }

        await prisma.user.delete({ where: { id: existingUser.id } });

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
