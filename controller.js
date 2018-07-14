const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();

const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);


const Translate = require('@google-cloud/translate');
const translate = new Translate();


const text = 'NEW, world!';
const target = 'tr';

// const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
// const encoding = 'LINEAR16';
// const sampleRateHertz = 16000;
// const languageCode = 'en-US';
//
// const request = {
//   config: {
//     encoding: encoding,
//     sampleRateHertz: sampleRateHertz,
//     languageCode: languageCode,
//   },
//   single_utterance: true,
//   interimResults: false, // If you want interim results, set this to true
// };
//
//
exports.speechcall = (req, res, next) => {
//     let text ='ver';
//     const recognizeStream = client
//     .streamingRecognize(request)
//     .on('error', console.error)
//     .on('data', data => process.stdout.write( data.results[0] && data.results[0].alternatives[0]
//         ? `Transcription: ${data.results[0].alternatives[0].transcript}` : `
//     Reached transcription time limit, press Ctrl+C
//     `
//   ));
//
//
//     record
//       .start({
//       sampleRateHertz: sampleRateHertz,
//       threshold: 0,
//       // thresholdEnd:1,
//       // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
//       verbose: false,
//       recordProgram: 'rec', // Try also "arecord" or "sox"
//       silence: '10.0',
//     })
//       .on('error', console.error)
//       .pipe(recognizeStream);
//     console.log('Listening, press Ctrl+C to stop.');
//
//
//
res.send('only test');
  };

exports.test = (req, res, next) => {


  res.send('test controller');
  // translate
  // .translate(text, target)
  // .then(results => {
  //   let translations = results[0];
  //
  //   translations = Array.isArray(translations)
  //     ? translations
  //     : [translations];
  //
  //   console.log(`Translations: ${translations}`);
  //   translations.forEach((translation, i) => {
  //     res.send(`${text[i]} => (${target}) ${translation}`);
  //   });
  //   return 'internal promise';
  // })
  // .then(el => console.log(el))
  // .catch(err => {
  //   console.error('ERROR:', err);
  // });


};
