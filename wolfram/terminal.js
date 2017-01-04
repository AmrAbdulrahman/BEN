let _ = require('lodash');
let { say, log } = require('../output');
let q = require('q');
let wolframQuery = require('./query');

module.exports = (query) => {
  let defer = q.defer();

  log('One second...\n'.grey);

  wolframQuery(query)
    .then(({shortResult, fullResult, hook}) => {
      if (shortResult) {
        log(`well, "${query}" is`.cyan);

        log(shortResult.bold.cyan);
        say(shortResult)
          .then(() => {
            let formattedFullResult = formatFullResult(fullResult);
            log(formattedFullResult.grey);
          })
          .then(() => hook && hook())
          .then(defer.resolve)
          .catch(defer.reject);
      } else if (_.keys(fullResult).length !== 0) {
        let message = 'Can\'t find something to say out loud, you better read. : |';
        log(message.blue);
        say(message);
        log(formatFullResult(fullResult));
        defer.resolve();
      } else {
        let message = 'Sorry, can\'t find something about this. : (';
        log(message.red);
        say(message);
        defer.resolve();
      }
    }, (error) => {
      log(error.red);
      say(error);
      defer.reject(error);
    });

  return defer.promise;
}

function formatFullResult(fullResult) {
  let formattedFullResult = '';

  _.each(fullResult, (podValue, podTitle) => {
    formattedFullResult += '\n' + (podTitle + ': ').bold;
    formattedFullResult += '\n\t' + podValue.replace(new RegExp('\n', 'ig'), '\n\t');
  });

  return formattedFullResult;
}
