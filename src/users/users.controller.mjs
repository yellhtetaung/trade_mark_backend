import prisma from "../../database/db.config.mjs";
import emailValidator from "email-validator";

export const getAllUsers = async (req, res) => {
	try {
		const { page, pageSize, sortField, sortOrder } = req.query;
		const skip = Number(page) * Number(pageSize);

		const [users, totalUsers] = await prisma.$transaction([
			prisma.user.findMany({
				skip,
				take: Number(pageSize),
				orderBy: {
					[sortField]: Number(sortOrder) === 1 ? "asc" : "desc",
				},
			}),
			prisma.user.count(),
		]);

		if (!users.length) {
			throw new Error("Users not found");
		}

		res.status(200).json({ data: users, totalUsers });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const searchUser = async (req, res) => {
	try {
		const { page, pageSize, filteredValue, searchField } = req.query;
		const skip = Number(page) * Number(pageSize);

		console.log(skip);

		if (filteredValue !== "null") {
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
				throw new Error("User not found");
			}

			res.status(200).json({ data: user, totalUsers });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const createUser = async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new Error("Content cannot be empty!");
		}

		const { username, email, password, phoneNumber, nrc, address } = req.body;

		if (!emailValidator.validate(email)) {
			throw new Error("Invalid email");
		}

		const existingUser = await prisma.user.findUnique({ where: { email } });

		if (existingUser) {
			throw new Error("Email already exists");
		}

		const user = await prisma.user.create({
			data: {
				username,
				email,
				password,
				phone_no: phoneNumber,
				nrc,
				address,
			},
		});

		res.status(201).json({ message: "User created successfully", data: user });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

export const updateUser = async (req, res) => {
	try {
		const id = req.params.id;

		if (Object.keys(req.body).length === 0) {
			throw new Error("Content cannot be empty!");
		}

		const { username, email, password, phone_no, nrc, address, active } =
			req.body;
		const updateUser = {
			username,
			email,
			password,
			phone_no,
			nrc,
			address,
			active,
		};

		const user = await prisma.user.update({
			where: { id },
			data: updateUser,
		});

		res.status(200).json({ message: "User updated successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
