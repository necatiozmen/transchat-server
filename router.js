const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/speechcall', controller.speechcall);

router.get('/test', controller.test)

module.exports = router;
