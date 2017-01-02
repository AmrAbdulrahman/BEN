let _ = require('lodash');
let Client = require('node-wolfram');
let config = require('../config');
let Wolfram = new Client(config.WOLFRAM_APP_ID);
let say = require('../say');
let q = require('q');
let hooks = require('./hooks');
let utils = require('../utils');

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
        textResult += '\n' + (podTitle + ': ').bold;

        _.each(pod.subpod, (subpod) => {
          _.each(subpod.plaintext, (text) => {
            // format subtext, indent it one tab
            textResult += '\n\t' + text.replace(new RegExp('\n', 'ig'), '\n\t');

            let resultProperties = utils.readList('./wolfram/result-keys.txt');

            if (_.find(resultProperties, (prop) => podTitle.toLowerCase().indexOf(prop) !== -1)) {
              audioResult += ` ${text}`;
            }

            // check if hook is registered for this input
            // i use 'input interpretation' to make use of wolfram unifying
            // hundreds of cases to a single key
            if (podTitle.toLowerCase() === 'input interpretation' && hooks[text]) {
              hook = hooks[text]; // just save it, we call it later, after displying the result
            }
          });
        });

        textResult += '\n';
      });

      audioResult = audioResult.trim();

      if (audioResult) {
        console.log(`well, "${query}" is`.cyan);

        say(formatAudioResult(audioResult), {format: 'bold.cyan'})
          .then(() => console.log(textResult.grey))
          .then(() => hook && hook())
          .then(defer.resolve)
          .catch(defer.reject);

      } else if (textResult) {
        say('Can\'t find something to say out loud, you better read. : |', {format: 'blue'});
        console.log(textResult);
        defer.resolve();
      } else {
        say('Sorry, can\'t find something about this. : (', {format: 'red'});
        defer.resolve();
      }
    }
  });

  return defer.promise;
};

function formatAudioResult(text) {
  let ignoreList = utils.readList('./wolfram/ignore.txt');

  // process ignored list
  _.each(ignoreList, (ignoreTerm) => {
    // found a match, remove it
    if (text.indexOf(ignoreTerm) !== -1) {
      text = text.replace(ignoreTerm, '');
    }
  });

  return text;
}
