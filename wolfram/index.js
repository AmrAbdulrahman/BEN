let _ = require('lodash');
let Client = require('node-wolfram');
let config = require('../config');
let Wolfram = new Client(config.WOLFRAM_APP_ID);
let say = require('../say');
let q = require('q');
let hooks = require('./hooks');

module.exports = (query) => {
  let defer = q.defer();
  console.log('One second...\n'.grey);

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
      let hook = null;

      _.each(result.queryresult.pod, (pod) => {
        let podTitle = pod.$.title;
        textResult += '\n' + podTitle + ': ';

        _.each(pod.subpod, (subpod) => {
          _.each(subpod.plaintext, (text) => {
            textResult += '\n\t' + text;

            let resultProperties = [
              'result',
              'response',
              'recorded weather',
            ];

            if (_.find(resultProperties, (prop) => podTitle.toLowerCase().indexOf(prop) !== -1)) {
              audioResult += ` ${text}`;
            }

            let inputInterpretationProperty = 'input interpretation';

            if (inputInterpretationProperty === podTitle.toLowerCase() && hooks[text]) {
              hook = hooks[text];
            }
          });
        });
      });

      audioResult = audioResult.trim();

      if (audioResult) {
        say(`well, "${query}" is`, {format: 'cyan', silent: true})
          .then(() => say(audioResult, {format: 'bold.cyan'}))
          .then(() => console.log(textResult.grey))
          .then(() => hook && hook())
          .then(defer.resolve);
      } else if (textResult) {
        say('Can\'t find something to say out loud, you better read.');
        console.log(textResult);
        defer.resolve();
      } else {
        say('Sorry, can\'t find something about this.');
        defer.resolve();
      }
    }
  });

  return defer.promise;
};
