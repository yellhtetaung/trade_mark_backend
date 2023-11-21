import prisma from "../../database/db.config.mjs";

export const createTradeMark = async (req, res) => {
	try {
		if (Object.keys(req.body).length === 0) {
			throw new Error("Content cannot be empty!");
		}

		const {} = req.body;
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
};
