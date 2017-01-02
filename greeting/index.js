let say = require('../say');
let q = require('q');
let _ = require('lodash');

module.exports = (options) => {
  let defer = q.defer();
  let time = (new Date()).getHours();

  _.defaults(options, {
    format: 'cyan',
    silent: false,
  });

  if (time >= 4 && time <= 11) {
    say('Good morning Amr!', options).then(defer.resolve);
  } else if (time >= 12 && time <= 17) {
    say('Good afternoon Amr!', options).then(defer.resolve);
  } else if (time >= 18 && time <= 23) {
    say('Good evening Amr!', options).then(defer.resolve);
  } else if (time >= 0 && time <= 3) {
    say('It\'s after midnight Amr, hope everything is okay!', options).then(defer.resolve);
  }

  return defer.promise;
}
