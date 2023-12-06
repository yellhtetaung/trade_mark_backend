const router = require('express').Router();
const { login, authorization } = require('./auth.controller');

router.post('/login', login);
router.get('/verify', authorization);

module.exports = router;
