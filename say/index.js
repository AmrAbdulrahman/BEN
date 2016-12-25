let say = require('say');
let q = require('q');
let _ = require('lodash');

module.exports = (string, format) => {
  let defer = q.defer();

  // pretty console log
  console.log(_.get(string, format, string));

  // speak then resolve the promise
  say.speak(string, null, 1.1, defer.resolve);

  return defer.promise;
};
