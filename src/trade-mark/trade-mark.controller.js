const prisma = require("../config/db.config");
const fs = require("fs");
const path = require("path");

exports.getAllHandler = async (req, res) => {
	try {
		const { page, pageSize } = req.query;
		const skip = Number(page) * Number(pageSize);

		const [tradeMark, totalTradeMark] = await prisma.$transaction([
			prisma.tradeMarkInfo.findMany({
				skip,
				take: Number(pageSize),
			}),
			prisma.tradeMarkInfo.count(),
		]);

		if (!tradeMark.length) {
			throw new Error("Trade Mark not found");
		}

		res.status(200).json({ data: tradeMark, totalTradeMark });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.searchHandler = async (req, res) => {
	try {
		const { page, pageSize, filteredValue, searchField } = req.query;
		const skip = Number(page) * Number(pageSize);

		if (filteredValue !== "null") {
			const [tradeMark, totalTradeMark] = await prisma.$transaction([
				prisma.tradeMarkInfo.findMany({
					skip,
					take: Number(pageSize),
					where: {
						[filteredValue]: {
							contains: searchField,
						},
					},
				}),
				prisma.tradeMarkInfo.count({
					where: {
						[filteredValue]: {
							contains: searchField,
						},
					},
				}),
			]);

			if (!tradeMark.length) {
				throw new Error("User not found");
			}

			res.status(200).json({ data: tradeMark, totalTradeMark });
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};

exports.createHandler = async (req, res) => {
	let fileName;

	try {
		if (!req.files || Object.keys(req.files).length === 0) {
			throw new Error("No file uploaded");
		}

		if (Object.keys(req.body).length === 0 || !req.body) {
			throw new Error("Content cannot be empty!");
		}

		const file = req.files.trademark_sample;
		fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${
			file.name
		}`;

		file.mv(
			path.join(__dirname, "..", "..", "public", fileName),
			async (error) => {
				if (error) {
					throw new Error(error);
				}

				const newTradeMark = {
					trademark: req.body.trademark,
					applicant: req.body.applicant,
					address: req.body.address,
					classes: req.body.classes,
					goods_services: req.body.goods_services,
					no_ent_reg_cer: req.body.no_ent_reg_cer,
					nonlatin_char_trans: req.body.nonlatin_char_trans,
					trans_mean: req.body.trans_mean,
					color_claim: req.body.color_claim,
					re_filling_date: req.body.re_filling_date,
					re_filling_WIPO_no: req.body.re_filling_WIPO_no,
					app_no: req.body.app_no,
					off_fill_date: req.body.off_fill_date,
					payment_WIPO_no: req.body.payment_WIPO_no,
					other_procedure: req.body.other_procedure,
					granting_date: req.body.granting_date,
					reg_no: req.body.reg_no,
					time_renewal: req.body.time_renewal,
					renewal_date: req.body.renewal_date,
					renewal_no: req.body.renewal_no,
					val_period: req.body.val_period,
					date_of_public: req.body.date_of_public,
					exp_date: req.body.exp_date,
					reason_exp: req.body.reason_exp,
					tm2: req.body.tm2,
					submittion_type: {
						Mark: req.body["submittion_type[Mark]"] === "true" && true,
						OldMark: req.body["submittion_type[OldMark]"] === "true" && true,
						ReRegistration:
							req.body["submittion_type[ReRegistration]"] === "true" && true,
					},
				};

				const tradeMark = await prisma.tradeMarkInfo.create({
					data: {
						...newTradeMark,
						trademark_sample: fileName,
					},
				});
				res.status(201).json({
					message: "Trade Mark created successfully",
					data: tradeMark,
				});
			}
		);
	} catch (error) {
		if (error.message !== "No file uploaded") {
			fs.rmSync(path.join(__dirname, "..", "..", "public", fileName));
		}

		res.status(500).json({ message: error.message });
	}
};

exports.updateHandler = async (req, res) => {
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
