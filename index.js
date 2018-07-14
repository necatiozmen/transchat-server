const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const cors = require('cors');
const router = require('./router');
const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const Translate = require('@google-cloud/translate');
const translate = new Translate();

app.use(cors());
app.use(router);

const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

let request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  single_utterance: true,
  interimResults: false, // If you want interim results, set this to true
};

let text = '';



// app.use((req,res,next) => {
//   console.log('maer');
//   next();
// });

app.post('/speechlang', (req, res, next) => {
  request.config.languageCode = req.query.lng;
  res.send(JSON.stringify(req.query.lng));
});





app.get('/', (req, res, next) => {
  const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data => text = data.results[0] && data.results[0].alternatives[0]
      ? `Transcription: ${data.results[0].alternatives[0].transcript}` : `
    Reached transcription time limit, press Ctrl+C
    `
);

  record
    .start({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // thresholdEnd:1,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
  })
    .on('error', console.error)
    .pipe(recognizeStream);
  console.log('Listening, press Ctrl+C to stop.');

res.send(JSON.stringify('tr'));
});


io.set('origins', 'http://localhost:3000');
io.on('connection', socket => {
  console.log(socket.id);
  socket.on('SEND_TEXT_MESSAGE', data => {

    data.socketId = socket.id,
    io.emit('SEND_MESSAGE_TOCLIENT', data);//send text which is coming from client to all client listeners
  });

  socket.on('GET_SPEECH_TEXT', data => {
    const target = 'tr';
    let translatedText = '';
    translate
    .translate(text, target)
    .then(results => {
      let translations = results[0];
      console.log(`Translations: ${translations}`);
      return translations;
    })
    .then(transText => io.emit('GET_SPEECH_TEXT', `${text} => ${transText}`))
    .catch(err => {
      console.error('ERROR:', err);
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

http.listen(5000, () => console.log('App listening on port 5000!'));
