const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http)
const router = require('./router');

app.use(router);

io.set('origins', 'http://localhost:3000');
io.on('connection', client => {
  console.log(client.id);

  client.on('SEND_MESSAGE', data => console.log(data))
  /*
    Burada işlemlerimizi yapacağız..
  */
})


http.listen(5000, () => console.log('App listening on port 5000!'));
