const record = require('node-record-lpcm16');
const speech = require('@google-cloud/speech');
const client = new speech.SpeechClient();


const filename = 'Local path to audio file, e.g. /path/to/audio.raw';
const encoding = 'LINEAR16';
const sampleRateHertz = 16000;
const languageCode = 'tr';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  single_utterance: true,
  interimResults: false, // If you want interim results, set this to true
};

// res.set({
//   'Cache-Control': 'no-store'
// });

exports.speechcall = (req, res, next) => {

    const recognizeStream = client
    .streamingRecognize(request)
    .on('error', console.error)
    .on('data', data => res.send(data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}` : `
Reached transcription time limit, press Ctrl+C
`)
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

  };

  exports.test = (req,res) => {

    res.send('tekrar dene');
  }
