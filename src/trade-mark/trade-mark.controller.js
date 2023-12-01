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
		const { page, pageSize, filteredValue, searchField, id } = req.query;
		const skip = Number(page) * Number(pageSize);

		if (id) {
			const tradeMark = await prisma.tradeMarkInfo.findUnique({
				where: {
					id: Number(id),
				},
			});

			if (!tradeMark) {
				throw new Error("Trade Mark not found");
			}

			return res.status(200).json(tradeMark);
		}

		if (filteredValue !== "null") {
			if (filteredValue === "created_at") {
				const date = searchField.split("/");
				const year = date[2];
				const month = date[0];
				const day = date[1] < "10" ? `0${date[1]}` : date[1];

				const [tradeMark, totalTradeMark] = await prisma.$transaction([
					prisma.tradeMarkInfo.findMany({
						skip,
						take: Number(pageSize),
						where: {
							created_at: {
								equals: new Date(`${year}-${month}-${day}`),
							},
						},
					}),
					prisma.tradeMarkInfo.count({
						where: {
							created_at: {
								equals: new Date(`${year}-${month}-${day}`),
							},
						},
					}),
				]);

				if (!tradeMark.length) {
					throw new Error("Trade Mark not found");
				}

				return res.status(200).json({ data: tradeMark, totalTradeMark });
			}

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

			return res.status(200).json({ data: tradeMark, totalTradeMark });
		}
	} catch (error) {
		console.log(error);
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
					created_at: new Date(),
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
	let fileName;

	try {
		if (Object.keys(req.body).length === 0 || !req.body) {
			throw new Error("Content cannot be empty!");
		}

		if (!req.files || Object.keys(req.files).length === 0) {
			const newTradeMark = {
				trademark: req.body.trademark,
				trademark_sample: req.body.trademark_sample,
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

			const tradeMark = await prisma.tradeMarkInfo.update({
				where: {
					id: Number(req.params.id),
				},
				data: newTradeMark,
			});
			res.status(201).json({
				message: "Trade Mark updated successfully",
				data: tradeMark,
			});
		}

		if (req.files) {
			const file = req.files.trademark_sample;
			fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${
				file.name
			}`;

			const previousData = await prisma.tradeMarkInfo.findUnique({
				where: { id: Number(req.params.id) },
			});

			if (
				fs.existsSync(
					path.join(
						__dirname,
						"..",
						"..",
						"public",
						previousData.trademark_sample
					)
				)
			) {
				fs.rmSync(
					path.join(
						__dirname,
						"..",
						"..",
						"public",
						previousData.trademark_sample
					)
				);
			}

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

					const tradeMark = await prisma.tradeMarkInfo.update({
						where: {
							id: Number(req.params.id),
						},
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
		}
	} catch (error) {
		if (error.message !== "No file uploaded") {
			fs.rmSync(path.join(__dirname, "..", "..", "public", fileName));
		}

		res.status(500).json({ message: error.message });
	}
};

exports.deleteHandler = async (req, res) => {
	try {
		if (!req.params.id) {
			throw new Error("Id is required");
		}

		const existingTradeMark = await prisma.tradeMarkInfo.findUnique({
			where: { id: Number(req.params.id) },
		});

		if (!existingTradeMark) {
			throw new Error("Trade Mark not found");
		}

		if (
			fs.existsSync(
				path.join(
					__dirname,
					"..",
					"..",
					"public",
					existingTradeMark.trademark_sample
				)
			)
		) {
			fs.rmSync(
				path.join(
					__dirname,
					"..",
					"..",
					"public",
					existingTradeMark.trademark_sample
				)
			);
		}

		await prisma.tradeMarkInfo.delete({
			where: { id: Number(existingTradeMark.id) },
		});

		res
			.status(200)
			.json({ message: "Trade Mark has benn deleted successfully" });
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
