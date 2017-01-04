let _ = require('lodash');
let Client = require('node-wolfram');
let config = require('../config');
let WolframClient = new Client(config.WOLFRAM_APP_ID);
let q = require('q');
let hooks = require('./hooks');
let utils = require('../utils');

module.exports = (query) => {
  let defer = q.defer();

  WolframClient.query(query, (err, result) => {
    if (err) {
      defer.reject('Something went wrong while looking up Wolfram!');
    } else if (!result.queryresult) {
      defer.reject('Couldn\'t find answers, maybe internet problem!');
    } else {
      let shortResultProperties = utils.readList('./wolfram/experience/result-keys.txt');
      let shortResult = '';
      let fullResult = {};
      let hook = null;

      _.each(result.queryresult.pod, (pod) => {
        let podTitle = pod.$.title;
        fullResult[podTitle] = '';

        _.each(pod.subpod, (subpod) => {
          _.each(subpod.plaintext, (text) => {
            fullResult[podTitle] += text;

            if (_.find(shortResultProperties, (prop) => podTitle.toLowerCase() === prop)) {
              shortResult += ` ${text}`;
            }

            // check if hook is registered for this input
            // i use 'input interpretation' to make use of wolfram unifying
            // hundreds of cases to a single key
            if (podTitle.toLowerCase() === 'input interpretation' && hooks[text]) {
              hook = hooks[text]; // just save it, we call it later, after displying the result
            }
          });
        });
      });

      shortResult = shortResult.trim();
      shortResult = removeIgnoredPhrases(shortResult);

      defer.resolve({
        fullResult,
        shortResult,
        hook,
      });
    }
  });

  return defer.promise;
}

function removeIgnoredPhrases(text) {
  let ignoreList = utils.readList('./wolfram/experience/ignore.txt');

  // process ignored list
  _.each(ignoreList, (ignoreTerm) => {
    // found a match, remove it
    if (text.indexOf(ignoreTerm) !== -1) {
      text = text.replace(ignoreTerm, '');
    }
  });

  return text;
}
