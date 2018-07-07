const express = require('express');
const app = express();
const router = require('./router');

app.use(router);

app.listen(5000, () => console.log('App listening on port 3000!'));
