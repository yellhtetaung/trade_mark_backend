const prisma = require('../config/db.config');
const fs = require('fs');
const path = require('path');

exports.getAllHandler = async (req, res) => {
    try {
        const { page, pageSize } = req.query;
        const skip = Number(page) * Number(pageSize);

        if (!page && !pageSize) {
            const tradeMark = await prisma.tradeMarkInfo.findMany();
            return res.status(200).json({ data: tradeMark });
        }

        const [tradeMark, totalTradeMark] = await prisma.$transaction([
            prisma.tradeMarkInfo.findMany({
                skip,
                take: Number(pageSize),
            }),
            prisma.tradeMarkInfo.count(),
        ]);

        if (!tradeMark.length) {
            throw new Error('Trade Mark not found');
        }

        return res.status(200).json({ data: tradeMark, totalTradeMark });
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
                throw new Error('Trade Mark not found');
            }

            return res.status(200).json(tradeMark);
        }

        if (filteredValue !== 'null') {
            if (filteredValue === 'created_at') {
                const start_date = searchField.start_date.split('/');
                const start_year = start_date[2];
                const start_month = start_date[0];
                const start_day = Number(start_date[1]) < 10 ? `0${start_date[1]}` : start_date[1];

                const end_date = searchField.end_date.split('/');
                const end_year = end_date[2];
                const end_month = end_date[0];
                const end_day = Number(end_date[1]) < 10 ? `0${end_date[1]}` : end_date[1];

                const [tradeMark, totalTradeMark] = await prisma.$transaction([
                    prisma.tradeMarkInfo.findMany({
                        skip,
                        take: Number(pageSize),
                        where: {
                            created_at: {
                                gte: new Date(`${start_year}-${start_month}-${start_day}`),
                                lte: new Date(`${end_year}-${end_month}-${end_day}`),
                            },
                        },
                    }),
                    prisma.tradeMarkInfo.count({
                        where: {
                            created_at: {
                                gte: new Date(`${start_year}-${start_month}-${start_day}`),
                                lte: new Date(`${end_year}-${end_month}-${end_day}`),
                            },
                        },
                    }),
                ]);

                if (!tradeMark.length) {
                    throw new Error('Trade Mark not found');
                }

                return res.status(200).json({ data: tradeMark, totalTradeMark });
            }

            if (filteredValue === 'submittion_type') {
                const [tradeMark, totalTradeMark] = await prisma.$transaction([
                    prisma.tradeMarkInfo.findMany({
                        where: {
                            submittion_type: {
                                path: `$.${searchField}`,
                                equals: true,
                            },
                        },
                    }),
                    prisma.tradeMarkInfo.count({
                        where: {
                            submittion_type: {
                                path: `$.${searchField}`,
                                equals: true,
                            },
                        },
                    }),
                ]);

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
                throw new Error('User not found');
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
    let attachmentFileName;

    try {
        if (!req.files?.trademark_sample) {
            throw new Error('No file uploaded');
        }

        if (Object.keys(req.body).length === 0 || !req.body) {
            throw new Error('Content cannot be empty!');
        }

        const file = req.files.trademark_sample;
        fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${file.name}`;

        if (req.files.attachment) {
            const attachmentFile = req.files.attachment;
            attachmentFileName = attachmentFile.md5 + '.' + attachmentFile.mimetype.split('/')[1];

            attachmentFile.mv(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName));
        }

        file.mv(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName), async error => {
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
                    Mark: req.body['submittion_type[Mark]'] === 'true' && true,
                    OldMark: req.body['submittion_type[OldMark]'] === 'true' && true,
                    ReRegistration: req.body['submittion_type[ReRegistration]'] === 'true' && true,
                },
                created_at: new Date(),
            };

            const tradeMark = await prisma.tradeMarkInfo.create({
                data: {
                    ...newTradeMark,
                    trademark_sample: fileName,
                    attachment: attachmentFileName,
                },
            });

            res.status(201).json({
                message: 'Trade Mark created successfully',
                data: tradeMark,
            });
        });
    } catch (error) {
        fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName));

        res.status(500).json({ message: error.message });
    }
};

exports.updateHandler = async (req, res) => {
    let fileName;
    let attachmentFileName;

    try {
        if (Object.keys(req.body).length === 0 || !req.body) {
            throw new Error('Content cannot be empty!');
        }

        if (!req.files) {
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
                    Mark: req.body['submittion_type[Mark]'] === 'true' && true,
                    OldMark: req.body['submittion_type[OldMark]'] === 'true' && true,
                    ReRegistration: req.body['submittion_type[ReRegistration]'] === 'true' && true,
                },
                attachment: req.body.attachment,
            };

            const tradeMark = await prisma.tradeMarkInfo.update({
                where: {
                    id: Number(req.params.id),
                },
                data: newTradeMark,
            });

            return res.status(201).json({
                message: 'Trade Mark updated successfully',
                data: tradeMark,
            });
        }

        if (req.files) {
            const previousData = await prisma.tradeMarkInfo.findUnique({
                where: { id: Number(req.params.id) },
            });

            if (req.files.trademark_sample) {
                console.log('working....');
                const file = req.files.trademark_sample;
                fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${file.name}`;

                if (fileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', previousData.trademark_sample))) {
                    fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', previousData.trademark_sample));
                }

                if (!fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName))) {
                    file.mv(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName), error => {
                        if (error) {
                            console.log(error);
                        }
                    });
                }
            }

            if (req.files.attachment) {
                console.log('attachment working...');
                const attachmentFile = req.files.attachment;
                attachmentFileName = attachmentFile.md5 + '.' + attachmentFile.mimetype.split('/')[1];

                if (attachmentFileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', previousData.attachment))) {
                    fs.rmSync(path.join(__dirname, '..', '..', 'public', 'attachment', previousData.attachment));
                }

                if (!fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName))) {
                    attachmentFile.mv(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName), error => {
                        if (error) {
                            throw new Error('Something wrong!');
                        }
                    });
                }
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
                    Mark: req.body['submittion_type[Mark]'] === 'true' && true,
                    OldMark: req.body['submittion_type[OldMark]'] === 'true' && true,
                    ReRegistration: req.body['submittion_type[ReRegistration]'] === 'true' && true,
                },
            };

            const tradeMark = await prisma.tradeMarkInfo.update({
                where: {
                    id: Number(req.params.id),
                },
                data: {
                    ...newTradeMark,
                    trademark_sample: fileName ? fileName : req.body.trademark_sample,
                    attachment: attachmentFileName ? attachmentFileName : req.body.attachment,
                },
            });

            return res.status(201).json({ message: 'Trade mark updated successfully', data: tradeMark });
        }
    } catch (error) {
        if (error) {
            if (fileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName))) {
                fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName));
            }

            if (attachmentFileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName))) {
                fs.rmSync(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName));
            }
        }

        res.status(500).json({ error: error.message });
    }
};

exports.deleteHandler = async (req, res) => {
    try {
        if (!req.params.id) {
            throw new Error('Id is required');
        }

        const existingTradeMark = await prisma.tradeMarkInfo.findUnique({
            where: { id: Number(req.params.id) },
        });

        if (!existingTradeMark) {
            throw new Error('Trade Mark not found');
        }

        if (fs.existsSync(path.join(__dirname, '..', '..', 'public', existingTradeMark.trademark_sample))) {
            fs.rmSync(path.join(__dirname, '..', '..', 'public', existingTradeMark.trademark_sample));
        }

        await prisma.tradeMarkInfo.delete({
            where: { id: Number(existingTradeMark.id) },
        });

        res.status(200).json({ message: 'Trade Mark has benn deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
