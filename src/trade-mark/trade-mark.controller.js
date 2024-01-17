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
    } else if (filteredValue !== 'null') {
        if (filteredValue === 'created_at') {
            mysql.query(
                `SELECT * FROM TradeMarkInfo WHERE created_at >= '${new Date(searchField.start_date).toJSON().slice(0, 19).replace('T', ' ')}' AND created_at <= '${new Date(searchField.end_date)
                    .toJSON()
                    .slice(0, 19)
                    .replace('T', ' ')}' LIMIT ${skip}, ${Number(pageSize)}`,
                (error, tradeMark) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Something Wrong!' });
                    }

                    console.log(!tradeMark.length);

                    if (!tradeMark.length) {
                        console.log('working...');
                        return res.status(500).json({ message: 'Trade Mark not found' });
                    }

                    mysql.query(
                        `SELECT COUNT(*) AS count FROM TradeMarkInfo WHERE created_at >= '${new Date(searchField.start_date).toJSON().slice(0, 19).replace('T', ' ')}' AND created_at <= '${new Date(searchField.end_date)
                            .toJSON()
                            .slice(0, 19)
                            .replace('T', ' ')}'`,
                        (error, totalTradeMark) => {
                            if (error) return res.status(500).json({ message: 'Something Wrong!' });

                            return res.status(200).json({ data: tradeMark, totalTradeMark: totalTradeMark[0].count });
                        },
                    );
                },
            );
        } else if (filteredValue === 'submittion_type') {
            mysql.query(`SELECT * FROM tradeMarkInfo WHERE JSON_EXTRACT(submittion_type , '$.${searchField}') = true LIMIT ${skip}, ${Number(pageSize)}`, (error, tradeMark) => {
                if (error) return res.status(500).json({ message: 'Something Wrong!' });

                if (!tradeMark.length) {
                    return res.status(500).json({ message: 'Trade Mark not found' });
                }

                mysql.query(`SELECT COUNT(*) AS count FROM tradeMarkInfo WHERE JSON_EXTRACT(submittion_type , '$.${searchField}') = true`, (error, totalTradeMark) => {
                    if (error) {
                        console.log(error);
                        return res.status(500).json({ message: 'Something Wrong!' });
                    }

                    return res.status(200).json({ data: tradeMark, totalTradeMark: totalTradeMark[0].count });
                });
            });
        } else {
            mysql.query(`SELECT * FROM tradeMarkInfo WHERE ${filteredValue} LIKE '${searchField}%' LIMIT ${skip}, ${Number(pageSize)}`, (error, tradeMark) => {
                if (error) return res.status(500).json({ message: 'Something Wrong!' });
                if (!tradeMark.length) {
                    return res.status(500).json({ message: 'Trade Mark not found' });
                }
                mysql.query(`SELECT COUNT(*) AS count FROM tradeMarkInfo WHERE ${filteredValue} LIKE '${searchField}%'`, (error, totalTradeMark) => {
                    if (error) return res.status(500).json({ message: 'Something Wrong!' });
                    return res.status(200).json({ data: tradeMark, totalTradeMark: totalTradeMark[0].count });
                });
            });
        }
    }
};

exports.createHandler = (req, res) => {
    let fileName;
    let attachmentFileName;

    if (!req.files?.trademark_sample) {
        return res.status(500).json({ message: 'No file uploaded' });
    }

    if (Object.keys(req.body).length === 0 || !req.body) {
        return res.status(500).json({ message: 'Content cannot be empty!' });
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
            return res.status(500).json({ message: 'Something Wrong!' });
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
            re_filling_date: new Date(req.body.re_filling_date).toJSON().slice(0, 19).replace('T', ' '),
            re_filling_WIPO_no: req.body.re_filling_WIPO_no,
            app_no: req.body.app_no,
            off_fill_date: new Date(req.body.off_fill_date).toJSON().slice(0, 19).replace('T', ' '),
            payment_WIPO_no: req.body.payment_WIPO_no,
            other_procedure: req.body.other_procedure,
            granting_date: new Date(req.body.granting_date).toJSON().slice(0, 19).replace('T', ' '),
            reg_no: req.body.reg_no,
            time_renewal: req.body.time_renewal,
            renewal_date: new Date(req.body.renewal_date).toJSON().slice(0, 19).replace('T', ' '),
            renewal_no: req.body.renewal_no,
            val_period: new Date(req.body.val_period).toJSON().slice(0, 19).replace('T', ' '),
            date_of_public: new Date(req.body.date_of_public).toJSON().slice(0, 19).replace('T', ' '),
            exp_date: new Date(req.body.exp_date).toJSON().slice(0, 19).replace('T', ' '),
            reason_exp: req.body.reason_exp,
            tm2: req.body.tm2,
            submittion_type: JSON.stringify({
                'Mark': req.body['submittion_type[Mark]'] === 'true' && true,
                'OldMark': req.body['submittion_type[OldMark]'] === 'true' && true,
                'ReRegistration': req.body['submittion_type[ReRegistration]'] === 'true' && true,
            }),
            created_at: new Date().toJSON().slice(0, 19).replace('T', ' '),
        };

        mysql.query(
            `INSERT INTO TradeMarkInfo SET trademark='${newTradeMark.trademark}', trademark_sample='${typeof fileName === 'undefined' ? null : fileName}', applicant='${newTradeMark.applicant}', address='${newTradeMark.address}', classes='${
                newTradeMark.classes
            }', goods_services='${newTradeMark.goods_services}', no_ent_reg_cer='${newTradeMark.no_ent_reg_cer}', nonlatin_char_trans='${newTradeMark.nonlatin_char_trans}', trans_mean='${newTradeMark.trans_mean}', color_claim='${
                newTradeMark.color_claim
            }', re_filling_date='${newTradeMark.re_filling_date}', re_filling_WIPO_no='${newTradeMark.re_filling_WIPO_no}', app_no='${newTradeMark.app_no}', off_fill_date='${newTradeMark.off_fill_date}', payment_WIPO_no='${
                newTradeMark.payment_WIPO_no
            }', other_procedure='${newTradeMark.other_procedure}', granting_date='${newTradeMark.granting_date}', reg_no='${newTradeMark.reg_no}', time_renewal='${newTradeMark.time_renewal}', renewal_date='${
                newTradeMark.renewal_date
            }', renewal_no='${newTradeMark.renewal_no}', val_period='${newTradeMark.val_period}', date_of_public='${newTradeMark.date_of_public}', exp_date='${newTradeMark.exp_date}', reason_exp='${newTradeMark.reason_exp}', tm2='${
                newTradeMark.tm2
            }', submittion_type='${newTradeMark.submittion_type}', attachment='${typeof attachmentFileName === 'undefined' ? null : attachmentFileName}', created_at='${newTradeMark.created_at}'`,
            (error, data) => {
                if (error) {
                    console.log(error);
                    fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName));

                    return res.status(500).json({ message: 'Something Wrong!' });
                }

                console.log(data);

                res.status(201).json({
                    message: 'Trade Mark created successfully',
                    data: data[0],
                });
            },
        );
    });
};

exports.updateHandler = async (req, res) => {
    let fileName;
    let attachmentFileName;

    if (Object.keys(req.body).length === 0 || !req.body) {
        throw new Error('Content cannot be empty!');
    }

    if (!req.files) {
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
            re_filling_date: new Date(req.body.re_filling_date).toJSON().slice(0, 19).replace('T', ' '),
            re_filling_WIPO_no: req.body.re_filling_WIPO_no,
            app_no: req.body.app_no,
            off_fill_date: new Date(req.body.off_fill_date).toJSON().slice(0, 19).replace('T', ' '),
            payment_WIPO_no: req.body.payment_WIPO_no,
            other_procedure: req.body.other_procedure,
            granting_date: new Date(req.body.granting_date).toJSON().slice(0, 19).replace('T', ' '),
            reg_no: req.body.reg_no,
            time_renewal: req.body.time_renewal,
            renewal_date: new Date(req.body.renewal_date).toJSON().slice(0, 19).replace('T', ' '),
            renewal_no: req.body.renewal_no,
            val_period: new Date(req.body.val_period).toJSON().slice(0, 19).replace('T', ' '),
            date_of_public: new Date(req.body.date_of_public).toJSON().slice(0, 19).replace('T', ' '),
            exp_date: new Date(req.body.exp_date).toJSON().slice(0, 19).replace('T', ' '),
            reason_exp: req.body.reason_exp,
            tm2: req.body.tm2,
            submittion_type: JSON.stringify({
                'Mark': req.body['submittion_type[Mark]'] === 'true' && true,
                'OldMark': req.body['submittion_type[OldMark]'] === 'true' && true,
                'ReRegistration': req.body['submittion_type[ReRegistration]'] === 'true' && true,
            }),
            created_at: new Date().toJSON().slice(0, 19).replace('T', ' '),
        };

        mysql.query(
            `UPDATE TradeMarkInfo SET trademark='${newTradeMark.trademark}', trademark_sample='${req.body.trademark_sample}', applicant='${newTradeMark.applicant}', address='${newTradeMark.address}', classes='${newTradeMark.classes}', goods_services='${newTradeMark.goods_services}', no_ent_reg_cer='${newTradeMark.no_ent_reg_cer}', nonlatin_char_trans='${newTradeMark.nonlatin_char_trans}', trans_mean='${newTradeMark.trans_mean}', color_claim='${newTradeMark.color_claim}', re_filling_date='${newTradeMark.re_filling_date}', re_filling_WIPO_no='${newTradeMark.re_filling_WIPO_no}', app_no='${newTradeMark.app_no}', off_fill_date='${newTradeMark.off_fill_date}', payment_WIPO_no='${newTradeMark.payment_WIPO_no}', other_procedure='${newTradeMark.other_procedure}', granting_date='${newTradeMark.granting_date}', reg_no='${newTradeMark.reg_no}', time_renewal='${newTradeMark.time_renewal}', renewal_date='${newTradeMark.renewal_date}', renewal_no='${newTradeMark.renewal_no}', val_period='${newTradeMark.val_period}', date_of_public='${newTradeMark.date_of_public}', exp_date='${newTradeMark.exp_date}', reason_exp='${newTradeMark.reason_exp}', tm2='${newTradeMark.tm2}', submittion_type='${newTradeMark.submittion_type}', attachment='${req.body.attachment}', created_at='${newTradeMark.created_at}' WHERE id = ${req.params.id}`,
            (error, data) => {
                if (error) {
                    return res.status(500).json({ message: 'Something Wrong!' });
                }

                res.status(201).json({
                    message: 'Trade Mark update successfully',
                    data: data[0],
                });
            },
        );
    } else if (req.files) {
        mysql.query(`SELECT * FROM TradeMarkInfo WHERE id = ${Number(req.params.id)}`, (error, previousData) => {
            if (error) return res.status(200).json({ message: 'Something Wrong!' });

            if (!previousData.length) {
                return res.status(500).json({ message: `This ID ${req.params.id} not found in trade mark` });
            }

            if (req.files.trademark_sample) {
                const file = req.files.trademark_sample;
                fileName = `image-${Date.now()}${Math.floor(Math.random() * 99999)}-${file.name}`;

                if (fileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', previousData[0].trademark_sample))) {
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

                if (attachmentFileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', previousData[0].attachment))) {
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
                re_filling_date: new Date(req.body.re_filling_date).toJSON().slice(0, 19).replace('T', ' '),
                re_filling_WIPO_no: req.body.re_filling_WIPO_no,
                app_no: req.body.app_no,
                off_fill_date: new Date(req.body.off_fill_date).toJSON().slice(0, 19).replace('T', ' '),
                payment_WIPO_no: req.body.payment_WIPO_no,
                other_procedure: req.body.other_procedure,
                granting_date: new Date(req.body.granting_date).toJSON().slice(0, 19).replace('T', ' '),
                reg_no: req.body.reg_no,
                time_renewal: req.body.time_renewal,
                renewal_date: new Date(req.body.renewal_date).toJSON().slice(0, 19).replace('T', ' '),
                renewal_no: req.body.renewal_no,
                val_period: new Date(req.body.val_period).toJSON().slice(0, 19).replace('T', ' '),
                date_of_public: new Date(req.body.date_of_public).toJSON().slice(0, 19).replace('T', ' '),
                exp_date: new Date(req.body.exp_date).toJSON().slice(0, 19).replace('T', ' '),
                reason_exp: req.body.reason_exp,
                tm2: req.body.tm2,
                submittion_type: JSON.stringify({
                    'Mark': req.body['submittion_type[Mark]'] === 'true' && true,
                    'OldMark': req.body['submittion_type[OldMark]'] === 'true' && true,
                    'ReRegistration': req.body['submittion_type[ReRegistration]'] === 'true' && true,
                }),
                created_at: new Date().toJSON().slice(0, 19).replace('T', ' '),
            };

            mysql.query(
                `UPDATE TradeMarkInfo SET trademark='${newTradeMark.trademark}', trademark_sample='${fileName ? fileName : req.body.trademark_sample}', applicant='${newTradeMark.applicant}', address='${newTradeMark.address}', classes='${
                    newTradeMark.classes
                }', goods_services='${newTradeMark.goods_services}', no_ent_reg_cer='${newTradeMark.no_ent_reg_cer}', nonlatin_char_trans='${newTradeMark.nonlatin_char_trans}', trans_mean='${newTradeMark.trans_mean}', color_claim='${
                    newTradeMark.color_claim
                }', re_filling_date='${newTradeMark.re_filling_date}', re_filling_WIPO_no='${newTradeMark.re_filling_WIPO_no}', app_no='${newTradeMark.app_no}', off_fill_date='${newTradeMark.off_fill_date}', payment_WIPO_no='${
                    newTradeMark.payment_WIPO_no
                }', other_procedure='${newTradeMark.other_procedure}', granting_date='${newTradeMark.granting_date}', reg_no='${newTradeMark.reg_no}', time_renewal='${newTradeMark.time_renewal}', renewal_date='${
                    newTradeMark.renewal_date
                }', renewal_no='${newTradeMark.renewal_no}', val_period='${newTradeMark.val_period}', date_of_public='${newTradeMark.date_of_public}', exp_date='${newTradeMark.exp_date}', reason_exp='${newTradeMark.reason_exp}', tm2='${
                    newTradeMark.tm2
                }', submittion_type='${newTradeMark.submittion_type}', attachment='${attachmentFileName ? attachmentFileName : req.body.attachment}', created_at='${newTradeMark.created_at}' WHERE id = ${req.params.id}`,
                (error, data) => {
                    if (error) {
                        if (fileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName))) {
                            fs.rmSync(path.join(__dirname, '..', '..', 'public', 'trademark_sample', fileName));
                        }

                        if (attachmentFileName && fs.existsSync(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName))) {
                            fs.rmSync(path.join(__dirname, '..', '..', 'public', 'attachment', attachmentFileName));
                        }
                        return res.status(500).json({ message: 'Something Wrong!' });
                    }

                    res.status(201).json({
                        message: 'Trade Mark update successfully',
                        data: data[0],
                    });
                },
            );
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

        if (fs.existsSync(path.join(__dirname, '..', '..', 'public', existingTradeMark[0].trademark_sample))) {
            fs.rmSync(path.join(__dirname, '..', '..', 'public', existingTradeMark[0].trademark_sample));
        }

        mysql.query(`DELETE FROM TradeMarkInfo WHERE id = ${req.params.id}`, error => {
            if (error) return res.status(500).json({ message: 'Something Wrong!' });

            return res.status(200).json({ message: 'Trade Mark has benn deleted successfully' });
        });
    });
};
