const fs = require("fs");
const path = require("path");
const prisma = require("../config/db.config");
const axios = require("axios");

exports.regonitionHandler = async (req, res) => {
	let fileName;

	try {
		if (!req.files || Object.keys(req.files).length === 0) {
			throw new Error("No file uploaded");
		}

		const file = req.files.files;
		// const result = [];

		const publicDir = fs.existsSync(path.join(__dirname, "..", "..", "public"));
		const tempDir = fs.existsSync(
			path.join(__dirname, "..", "..", "public", "temp")
		);

		if (!publicDir) {
			fs.mkdirSync(path.join(__dirname, "..", "..", "public"));
		}

		if (!tempDir) {
			fs.mkdirSync(path.join(__dirname, "..", "..", "public", "temp"));
		}

		file.mv(
			path.join(__dirname, "..", "..", "public", "temp", file.name),
			async (error) => {
				if (error) throw new Error(error);
				fileName = file.name;

				if (
					fs.existsSync(
						path.join(__dirname, "..", "..", "public", "temp", file.name)
					)
				) {
					const existingTradeMark = await prisma.tradeMarkInfo.findMany({
						select: { id: true, trademark_sample: true, trademark: true },
					});

					if (!existingTradeMark) {
						throw new Error("Trade mark not found");
					}

					const result = [];

					await Promise.all(
						existingTradeMark.flatMap(async (tm) => {
							const response = await axios.post(
								"https://api.deepai.org/api/image-similarity",
								{
									image1: fs.createReadStream(
										path.join(
											__dirname,
											"..",
											"..",
											"public",
											tm.trademark_sample
										)
									),
									image2: fs.createReadStream(
										path.join(
											__dirname,
											"..",
											"..",
											"public",
											"temp",
											file.name
										)
									),
								},
								{
									headers: {
										"Content-Type": "multipart/form-data",
										"Api-Key": "129272ba-8ecf-4ffa-9af2-b8e2568722c7",
									},
								}
							);

							if (response.data.output.distance < 25) {
								result.push({
									id: tm.id,
									name: tm.trademark,
									image: "http://192.168.100.29:8000/" + tm.trademark_sample,
									distance: response.data.output.distance,
								});
							}
						})
					).finally(() => {
						fs.rmSync(
							path.join(__dirname, "..", "..", "public", "temp", file.name)
						);
					});

					res.status(200).json(result);
				}
			}
		);
	} catch (error) {
		if (
			fs.existsSync(
				path.join(__dirname, "..", "..", "public", "temp", fileName)
			)
		) {
			fs.rmSync(path.join(__dirname, "..", "..", "public", "temp", fileName));
		}

		console.log(error);
		res.status(500).json({ message: error.message });
	}
};
