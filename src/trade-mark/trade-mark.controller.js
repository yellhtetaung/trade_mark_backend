const mysql = require('../config/db.config');
const fs = require('fs');
const path = require('path');

exports.getAllHandler = (req, res) => {
    const { page, pageSize } = req.query;
    const skip = Number(page) * Number(pageSize);

    if (!page && !pageSize) {
        mysql.query('SELECT * FROM TradeMarkInfo', (error, data) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            if (!data.length) {
                return res.status(500).json({ message: 'Trade Mark not found' });
            }

            return res.status(200).json({ data: data });
        });

        return null;
    }

    mysql.query(`SELECT * FROM TradeMarkInfo LIMIT ${skip}, ${Number(pageSize)}`, (error, data) => {
        if (error) return res.status(500).json({ message: 'Something Wrong!' });

        if (!data.length) {
            return res.status(500).json({ message: 'Trade Mark not found' });
        }

        mysql.query('SELECT COUNT(*) AS count FROM TradeMarkInfo', (error, count) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            return res.status(200).json({ data: data, totalTradeMark: count[0].count });
        });
    });
};

exports.searchHandler = (req, res) => {
    const { page, pageSize, filteredValue, searchField, id } = req.query;
    const skip = Number(page) * Number(pageSize);

    if (id) {
        mysql.query(`SELECT * FROM TradeMarkInfo WHERE id=${id}`, (error, tradeMark) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            if (!tradeMark.length) {
                return res.status(200).json({ message: 'Trade Mark not found' });
            }

            return res.status(200).json(tradeMark[0]);
        });
        return null;
    }

    if (filteredValue !== 'null') {
        if (filteredValue === 'created_at') {
            const { start_date, end_date } = searchField;

            const startDate = start_date && new Date(start_date);
            const startDateFormat = startDate && `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate().toString().padStart(2, '0')}`;

            const endDate = end_date && new Date(end_date);
            const endDateFormat = endDate && `${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate().toString().padStart(2, '0')}`;

            mysql.query(`SELECT * FROM TradeMarkInfo WHERE created_at >= '${startDateFormat}' AND created_at <= '${endDateFormat}' LIMIT ${skip}, ${Number(pageSize)}`, (error, tradeMark) => {
                if (error) {
                    console.log(error);
                    return res.status(500).json({ message: 'Something Wrong!' });
                }

                if (!tradeMark.length) {
                    console.log('working...');
                    return res.status(500).json({ message: 'Trade Mark not found' });
                }

                mysql.query(`SELECT COUNT(*) AS count FROM TradeMarkInfo WHERE created_at >= '${startDateFormat}' AND created_at <= '${endDateFormat}'`, (error, totalTradeMark) => {
                    if (error) return res.status(500).json({ message: 'Something Wrong!' });

                    return res.status(200).json({ data: tradeMark, totalTradeMark: totalTradeMark[0].count });
                });
            });

            return null;
        }

        if (filteredValue === 'submittion_type') {
            mysql.query(`SELECT * FROM TradeMarkInfo WHERE JSON_EXTRACT(submittion_type , '$.${searchField}') = true LIMIT ${skip}, ${Number(pageSize)}`, (error, tradeMark) => {
                if (error) return res.status(500).json({ message: 'Something Wrong!' });

                if (!tradeMark.length) {
                    return res.status(500).json({ message: 'Trade Mark not found' });
                }

                mysql.query(`SELECT COUNT(*) AS count FROM TradeMarkInfo WHERE JSON_EXTRACT(submittion_type , '$.${searchField}') = true`, (error, totalTradeMark) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Something Wrong!' });
                    }

                    return res.status(200).json({ data: tradeMark, totalTradeMark: totalTradeMark[0].count });
                });
            });

            return null;
        }

        mysql.query(`SELECT * FROM TradeMarkInfo WHERE ${filteredValue} LIKE '${searchField}%' LIMIT ${skip}, ${Number(pageSize)}`, (error, tradeMark) => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });
            if (!tradeMark.length) {
                return res.status(500).json({ message: 'Trade Mark not found' });
            }
            mysql.query(`SELECT COUNT(*) AS count FROM TradeMarkInfo WHERE ${filteredValue} LIKE '${searchField}%'`, (error, totalTradeMark) => {
                if (error) return res.status(500).json({ message: 'Something Wrong!' });
                return res.status(200).json({ data: tradeMark, totalTradeMark: totalTradeMark[0].count });
            });
        });
    }
};

exports.createHandler = (req, res) => {
    let fileName;
    let attachmentFileName;

    if (Object.keys(req.body).length === 0 || !req.body) {
        return res.status(500).json({ message: 'Content cannot be empty!' });
    }

    const re_filling_date = req.body.re_filling_date && new Date(req.body.re_filling_date);
    const re_filling_date_format = re_filling_date && `${re_filling_date.getFullYear()}-${re_filling_date.getMonth() + 1}-${re_filling_date.getDate().toString().padStart(2, '0')}`;

    const off_fill_date = req.body.off_fill_date && new Date(req.body.off_fill_date);
    const off_fill_date_format = off_fill_date && `${off_fill_date.getFullYear()}-${off_fill_date.getMonth() + 1}-${off_fill_date.getDate().toString().padStart(2, '0')}`;

    const granting_date = req.body.granting_date && new Date(req.body.granting_date);
    const granting_date_format = granting_date && `${granting_date.getFullYear()}-${granting_date.getMonth() + 1}-${granting_date.getDate().toString().padStart(2, '0')}`;

    const renewal_date = req.body.renewal_date && new Date(req.body.renewal_date);
    const renewal_date_format = renewal_date && `${renewal_date.getFullYear()}-${renewal_date.getMonth() + 1}-${renewal_date.getDate().toString().padStart(2, '0')}`;

    const val_period = req.body.val_period && new Date(req.body.val_period);
    const val_period_format = val_period && `${val_period.getFullYear()}-${val_period.getMonth() + 1}-${val_period.getDate().toString().padStart(2, '0')}`;

    const date_of_public = req.body.date_of_public && new Date(req.body.date_of_public);
    const date_of_public_format = date_of_public && `${date_of_public.getFullYear()}-${date_of_public.getMonth() + 1}-${date_of_public.getDate().toString().padStart(2, '0')}`;

    const exp_date = req.body.exp_date && new Date(req.body.exp_date);
    const exp_date_format = exp_date && `${exp_date.getFullYear()}-${exp_date.getMonth() + 1}-${exp_date.getDate().toString().padStart(2, '0')}`;

    const newTradeMark = {
        trademark: !req.body.trademark ? null : req.body.trademark,
        trademark_sample: null,
        applicant: !req.body.applicant ? null : req.body.applicant,
        address: !req.body.address ? null : req.body.address,
        classes: !req.body.classes ? null : req.body.classes,
        goods_services: !req.body.goods_services ? null : req.body.goods_services,
        no_ent_reg_cer: !req.body.no_ent_reg_cer ? null : req.body.no_ent_reg_cer,
        nonlatin_char_trans: !req.body.nonlatin_char_trans ? null : req.body.nonlatin_char_trans,
        trans_mean: !req.body.trans_mean ? null : req.body.trans_mean,
        color_claim: !req.body.color_claim ? null : req.body.color_claim,
        supporting_docs: !req.body.supporting_docs ? null : req.body.supporting_docs,
        re_filling_date: !req.body.re_filling_date ? null : re_filling_date_format,
        re_filling_WIPO_no: !req.body.re_filling_WIPO_no ? null : req.body.re_filling_WIPO_no,
        app_no: !req.body.app_no ? null : req.body.app_no,
        off_fill_date: !req.body.off_fill_date ? null : off_fill_date_format,
        payment_WIPO_no: !req.body.payment_WIPO_no ? null : req.body.payment_WIPO_no,
        other_procedure: !req.body.other_procedure ? null : req.body.other_procedure,
        granting_date: !req.body.granting_date ? null : granting_date_format,
        reg_no: !req.body.reg_no ? null : req.body.reg_no,
        time_renewal: !req.body.time_renewal ? null : req.body.time_renewal,
        renewal_date: !req.body.renewal_date ? null : renewal_date_format,
        renewal_no: !req.body.renewal_no ? null : req.body.renewal_no,
        val_period: !req.body.val_period ? null : val_period_format,
        date_of_public: !req.body.date_of_public ? null : date_of_public_format,
        exp_date: !req.body.exp_date ? exp_date_format : null,
        reason_exp: !req.body.reason_exp ? null : req.body.reason_exp,
        tm2: !req.body.tm2 ? null : req.body.tm2,
        submittion_type: JSON.stringify({
            'Mark': req.body['submittion_type[Mark]'] === 'true' && true,
            'OldMark': req.body['submittion_type[OldMark]'] === 'true' && true,
            'ReRegistration': req.body['submittion_type[ReRegistration]'] === 'true' && true,
        }),
        attachment: null,
    };

    const setQueryHandler = () => {
        mysql.query(`INSERT INTO TradeMarkInfo SET ?`, newTradeMark, (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something Wrong!' });
            }

            return res.status(201).json({
                message: 'Trade Mark created successfully',
                data: data[0],
            });
        });
    };

    if (!req.files) {
        setQueryHandler();
        return null;
    }

    if (req.files) {
        if (req.files.trademark_sample) {
            const file = req.files.trademark_sample;
            fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${file.name}`;
            newTradeMark.trademark_sample = fileName && fileName;
            file.mv(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName)).catch(error => {
                return res.status(500).json({ message: 'Something Wrong!' });
            });
        }

        if (req.files.attachment) {
            const attachmentFile = req.files.attachment;
            attachmentFileName = attachmentFile.md5 + '.' + attachmentFile.mimetype.split('/')[1];
            newTradeMark.attachment = attachmentFileName && attachmentFileName;

            attachmentFile.mv(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName)).catch(error => {
                return res.status(500).json({ message: 'Something Wrong!' });
            });
        }

        setQueryHandler();
    }
};

exports.updateHandler = async (req, res) => {
    let fileName;
    let attachmentFileName;

    if (Object.keys(req.body).length === 0 || !req.body) {
        throw new Error('Content cannot be empty!');
    }

    const re_filling_date = req.body.re_filling_date && new Date(req.body.re_filling_date);
    const re_filling_date_format = re_filling_date && `${re_filling_date.getFullYear()}-${re_filling_date.getMonth() + 1}-${re_filling_date.getDate().toString().padStart(2, '0')}`;

    const off_fill_date = req.body.off_fill_date && new Date(req.body.off_fill_date);
    const off_fill_date_format = off_fill_date && `${off_fill_date.getFullYear()}-${off_fill_date.getMonth() + 1}-${off_fill_date.getDate().toString().padStart(2, '0')}`;

    const granting_date = req.body.granting_date && new Date(req.body.granting_date);
    const granting_date_format = granting_date && `${granting_date.getFullYear()}-${granting_date.getMonth() + 1}-${granting_date.getDate().toString().padStart(2, '0')}`;

    const renewal_date = req.body.renewal_date && new Date(req.body.renewal_date);
    const renewal_date_format = renewal_date && `${renewal_date.getFullYear()}-${renewal_date.getMonth() + 1}-${renewal_date.getDate().toString().padStart(2, '0')}`;

    const val_period = req.body.val_period && new Date(req.body.val_period);
    const val_period_format = val_period && `${val_period.getFullYear()}-${val_period.getMonth() + 1}-${val_period.getDate().toString().padStart(2, '0')}`;

    const date_of_public = req.body.date_of_public && new Date(req.body.date_of_public);
    const date_of_public_format = date_of_public && `${date_of_public.getFullYear()}-${date_of_public.getMonth() + 1}-${date_of_public.getDate().toString().padStart(2, '0')}`;

    const exp_date = req.body.exp_date && new Date(req.body.exp_date);
    const exp_date_format = exp_date && `${exp_date.getFullYear()}-${exp_date.getMonth() + 1}-${exp_date.getDate().toString().padStart(2, '0')}`;

    const newTradeMark = {
        trademark: !req.body.trademark ? null : req.body.trademark,
        trademark_sample: !req.body.trademark_sample ? null : req.body.trademark_sample,
        applicant: !req.body.applicant ? null : req.body.applicant,
        address: !req.body.address ? null : req.body.address,
        classes: !req.body.classes ? null : req.body.classes,
        goods_services: !req.body.goods_services ? null : req.body.goods_services,
        no_ent_reg_cer: !req.body.no_ent_reg_cer ? null : req.body.no_ent_reg_cer,
        nonlatin_char_trans: !req.body.nonlatin_char_trans ? null : req.body.nonlatin_char_trans,
        trans_mean: !req.body.trans_mean ? null : req.body.trans_mean,
        color_claim: !req.body.color_claim ? null : req.body.color_claim,
        supporting_docs: !req.body.supporting_docs ? null : req.body.supporting_docs,
        re_filling_date: !req.body.re_filling_date ? re_filling_date_format : null,
        re_filling_WIPO_no: !req.body.re_filling_WIPO_no ? null : req.body.re_filling_WIPO_no,
        app_no: !req.body.app_no ? null : req.body.app_no,
        off_fill_date: !req.body.off_fill_date ? off_fill_date_format : null,
        payment_WIPO_no: !req.body.payment_WIPO_no ? null : req.body.payment_WIPO_no,
        other_procedure: !req.body.other_procedure ? null : req.body.other_procedure,
        granting_date: !req.body.granting_date ? granting_date_format : null,
        reg_no: !req.body.reg_no ? null : req.body.reg_no,
        time_renewal: !req.body.time_renewal ? null : req.body.time_renewal,
        renewal_date: !req.body.renewal_date ? renewal_date_format : null,
        renewal_no: !req.body.renewal_no ? null : req.body.renewal_no,
        val_period: !req.body.val_period ? val_period_format : null,
        date_of_public: !req.body.date_of_public ? date_of_public_format : null,
        exp_date: !req.body.exp_date ? exp_date_format : null,
        reason_exp: !req.body.reason_exp ? null : req.body.reason_exp,
        tm2: !req.body.tm2 ? null : req.body.tm2,
        submittion_type: JSON.stringify({
            'Mark': req.body['submittion_type[Mark]'] === 'true' && true,
            'OldMark': req.body['submittion_type[OldMark]'] === 'true' && true,
            'ReRegistration': req.body['submittion_type[ReRegistration]'] === 'true' && true,
        }),
        attachment: !req.body.attachment ? null : req.body.attachment,
    };

    const setQueryHandler = () => {
        mysql.query(`UPDATE TradeMarkInfo SET ? WHERE id=${Number(req.params.id)}`, newTradeMark, (error, data) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Something Wrong!' });
            }

            return res.status(201).json({
                message: 'Trade Mark created successfully',
                data: data[0],
            });
        });
    };

    if (!req.files) {
        setQueryHandler();
        return null;
    }

    if (req.files) {
        mysql.query(`SELECT * FROM TradeMarkInfo WHERE id = ${Number(req.params.id)}`, (error, previousData) => {
            if (error) return res.status(200).json({ message: 'Something Wrong!' });

            if (!previousData.length) {
                return res.status(500).json({ message: `This ID ${req.params.id} not found in trade mark` });
            }

            if (req.files.trademark_sample) {
                const file = req.files.trademark_sample;
                fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${file.name}`;
                newTradeMark.trademark_sample = fileName && fileName;

                if (previousData[0].trademark_sample && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', previousData[0].trademark_sample))) {
                    fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', previousData[0].trademark_sample));
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
                const attachmentFile = req.files.attachment;
                attachmentFileName = attachmentFile.md5 + '.' + attachmentFile.mimetype.split('/')[1];
                newTradeMark.attachment = attachmentFileName && attachmentFileName;

                if (previousData[0].attachment && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', previousData[0].attachment))) {
                    fs.rmSync(path.join(__dirname, '..', '..', 'public', 'attachment', previousData[0].attachment));
                }

                if (!fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName))) {
                    attachmentFile.mv(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName), error => {
                        if (error) {
                            throw new Error('Something wrong!');
                        }
                    });
                }
            }

            setQueryHandler();
        });
    }
};

exports.deleteHandler = async (req, res) => {
    if (!req.params.id) {
        throw new Error('Id is required');
    }

    mysql.query(`SELECT * FROM TradeMarkInfo WHERE id = ${Number(req.params.id)}`, (error, existingTradeMark) => {
        if (error) return res.status(500).json({ message: 'Something Wrong!' });

        if (!existingTradeMark.length) {
            return res.status(200).json({ message: 'Trade Mark not found' });
        }

        if (fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample'))) {
            if (fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', existingTradeMark[0].trademark_sample))) {
                fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', existingTradeMark[0].trademark_sample));
            }
        }

        if (fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment'))) {
            if (fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', existingTradeMark[0].attachment))) {
                fs.rmSync(path.join(__dirname, '..', '..', 'public', 'attachment', existingTradeMark[0].attachment));
            }
        }

        mysql.query(`DELETE FROM TradeMarkInfo WHERE id = ${req.params.id}`, error => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            return res.status(200).json({ message: 'Trade Mark has benn deleted successfully' });
        });
    });
};
