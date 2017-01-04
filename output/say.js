let say = require('say');
let q = require('q');

module.exports = (text) => {
  let defer = q.defer();

  if (text) {
    // speak then resolve the promise
    say.speak(text, null, 1.1, defer.resolve);
  } else {
    defer.resolve(); // nothing to say anyway
  }

  return defer.promise;
};
