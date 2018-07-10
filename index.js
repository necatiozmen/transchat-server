const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const router = require('./router');
const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

app.use(router);

const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  single_utterance: true,
  interimResults: false, // If you want interim results, set this to true
};

let text = '';

app.get('/', (req, res) => {

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

});

io.set('origins', 'http://localhost:3000');

io.on('connection', socket => {
  console.log(socket.id);

  socket.on('SEND_TEXT_MESSAGE', data => {
    console.log('data from client', data);
    io.emit('SEND_MESSAGE_TOCLIENT', data.message);//send text which is coming from client to all client listeners
  });

  socket.on('GET_SPEECH_TEXT', data => {
    console.log('transcript from speech', text);
    io.emit('GET_SPEECH_TEXT', text);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

});

http.listen(5000, () => console.log('App listening on port 5000!'));
