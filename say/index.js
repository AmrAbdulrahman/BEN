let say = require('say');
let q = require('q');
let _ = require('lodash');

module.exports = (text, options) => {
  let defer = q.defer();

  options = options || {};

  // pretty console log
  console.log(_.get(text, options.format, text));

  if (options.silent) {
    defer.resolve();
    return defer.promise;
  }

  if (text) {
    // speak then resolve the promise
    say.speak(text, null, 1.1, defer.resolve);
  } else {
    defer.resolve(); // nothing to say anyway
  }

  return defer.promise;
};
