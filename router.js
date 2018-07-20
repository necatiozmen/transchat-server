const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.post('/speechlang', controller.speechLang);
router.get('/record', controller.speechRecord);
router.get('/socketconnect', controller.socketConnect);

module.exports = router;
