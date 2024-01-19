const fs = require('fs');
const path = require('path');

exports.downloadHandler = (req, res) => {
    const { folder, filename } = req.params;

    if (!fs.existsSync(path.join(__dirname, '..', '..', 'public', folder, filename))) {
        res.status(404).send('File not found');
    } else {
        const file = `${__dirname}/../../public/${folder}/${filename}`;
        res.download(file, filename);
    }
};
