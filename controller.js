const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();
const io = require('./index');
const Translate = require('@google-cloud/translate');
const translate = new Translate();

const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'en-US';

let target = 'tr';
let text = '';

let request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  single_utterance: true,
  interimResults: false,
};

exports.speechLang = (req, res, next) => {
    console.log('controller req', req.query);
    req.query.speaker ? request.config.languageCode = req.query.speaker : '';
    req.query.translation ?  target = req.query.translation : '';
    res.send(JSON.stringify(req.query));
  };

exports.speechRecord = (req, res, next) => {
    const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => text = data.results[0] && data.results[0].alternatives[0]
        ? `${data.results[0].alternatives[0].transcript}` : `
      Reached transcription time limit, press Ctrl+C
      `
  );
    record
      .start({
      sampleRateHertz: sampleRateHertz,
      threshold: 0,
      verbose: false,
      recordProgram: 'rec',
      silence: '10.0',
    })
      .on('error', console.error)
      .pipe(recognizeStream);
    console.log('Listening, press Ctrl+C to stop.');
    res.send(JSON.stringify('tr'));
  };

exports.socketConnect = (req, res, next) => {
  io.io.set('origins', 'http://localhost:3000');
  io.io.on('connection', socket => {
    console.log(socket.id);
    socket.on('SEND_TEXT_MESSAGE', data => {
      data.socketId = socket.id,
      io.io.emit('SEND_MESSAGE_TOCLIENT', data);//send text which is coming from client to all client listeners
    });

    socket.on('GET_SPEECH_TEXT', data => {
      data.text ? text = data.text : ''; //if something written in input
      let translatedText = '';
      translate
      .translate(text, target)
      .then(results => {
        let translations = results[0];
        console.log(`Translations: ${translations}`);
        return translations;
      })
      .then(transText => io.io.emit('GET_SPEECH_TEXT', `${text} => ${transText}`))
      .catch(err => {
        console.error('ERROR:', err);
      });
    });

    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
};
