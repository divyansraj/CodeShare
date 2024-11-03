const express = require('express');

const {compileCode} = require('../controller/compileController')
const router = express.Router();

router.route('/compile').post(compileCode);

module.exports = router;