let { say, log } = require('../output');
let q = require('q');
let _ = require('lodash');

module.exports = (options) => {
  let defer = q.defer();
  let time = (new Date()).getHours();

  options = _.defaults(options, {
    say: true,
  });

  let message = '';

  if (time >= 4 && time <= 11) {
    message = 'Good morning Amr!';
  } else if (time >= 12 && time <= 14) {
    message = 'Good afternoon Amr!';
  } else if (time >= 18 && time <= 23) {
    message = 'Good evening Amr!';
  } else if (time >= 0 && time <= 3) {
    message = 'It\'s after midnight Amr, hope everything is okay!';
  }

  log(message.cyan);

  if (options.say) {
    say(message).then(defer.resolve, defer.reject);
  } else {
    defer.resolve();
  }

  return defer.promise;
}
