const router = require("express").Router();
const { regonitionHandler } = require("./recognition.controller");

router.post("/", regonitionHandler);

module.exports = router;
