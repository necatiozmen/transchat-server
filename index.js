const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const router = require('./router');

app.use(router);

http.listen(5000, () => console.log('App listening on port 5000!'));

exports.io = io;
