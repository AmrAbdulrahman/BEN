let say = require('../say');
let q = require('q');

module.exports = (query) => {
  let defer = q.defer();
  let time = (new Date()).getHours();

  if (time >= 4 && time <= 11) {
    say('Good morning Amr!').then(defer.resolve);
  } else if (time >= 12 && time <= 17) {
    say('Good afternoon Amr!').then(defer.resolve);
  } else if (time >= 18 && time <= 23) {
    say('Good evening Amr!').then(defer.resolve);
  } else if (time >= 0 && time <= 3) {
    say('It\'s after midnight Amr, hope everything is okay!').then(defer.resolve);
  }

  return defer.promise;
}
