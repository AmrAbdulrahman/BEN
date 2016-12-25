let _ = require('lodash');
let Client = require('node-wolfram');
let config = require('../config');
let Wolfram = new Client(config.WOLFRAM_APP_ID);
let say = require('../say');
let colors = require('colors');
let q = require('q');

module.exports = (query) => {
  let defer = q.defer();
  console.log('One second...\n');

  Wolfram.query(query, (err, result) => {
    if (err) {
      say('I am sorry, something went wrong while looking up Wolfram!');
      console.log(err);
      defer.reject();
    } else if (!result.queryresult) {
      say('Couldn\'t find answers, maybe internet problem');
      defer.reject();
    } else {
      let audioResult = '';
      let textResult = '';

      _.each(result.queryresult.pod, (pod) => {
        textResult += '\n' + pod.$.title + ': ';

        _.each(pod.subpod, (subpod) => {
          _.each(subpod.plaintext, (text) => {
            textResult += '\n\t' + text;

            let keyProperties = [
              'result',
              'response',
              'recorded weather',
            ];

            if (_.find(keyProperties, (prop) => pod.$.title.toLowerCase().indexOf(prop) !== -1)) {
              audioResult += ` ${text}`;
            }
          });
        });
      });

      audioResult = audioResult.trim();

      if (audioResult) {
        say(audioResult, 'bold', 'green');
      } else {
        say('Can\'t find something to say, you better read.');
      }

      console.log(textResult);
      defer.resolve();
    }
  });

  return defer.promise;
};
