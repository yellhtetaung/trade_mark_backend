const router = require('express').Router();
const { downloadHandler } = require('./controler');

router.route('/:folder/:filename').get(downloadHandler);

module.exports = router;
