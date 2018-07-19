const express = require('express');
const router = express.Router();
const controller = require('./controller');

router.get('/speechcall', controller);

router.get('/test', controller);


module.exports = router;
