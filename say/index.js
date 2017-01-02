let say = require('say');
let q = require('q');
let _ = require('lodash');
let fs = require('fs');

// read ignored list
let ignoreListFile = fs.readFileSync(__dirname + '/ignore.txt').toString();
let ignoreList = ignoreListFile
  .split('\n\n')
  .map((term) => term.replace(new RegExp('\n', 'ig'), ''));

module.exports = (text, options) => {
  let defer = q.defer();

  options = options || {};

  // pretty console log
  console.log(_.get(text, options.format, text));

  if (options.silent) {
    defer.resolve();
    return defer.promise;
  }

  // process ignored list
  _.each(ignoreList, (ignoreTerm) => {
    // found a match, remove it
    if (text.indexOf(ignoreTerm) !== -1) {
      text = text.replace(ignoreTerm, '');
    }
  });

  if (text) {
    // speak then resolve the promise
    say.speak(text, null, 1.1, defer.resolve);
  } else {
    defer.resolve(); // nothing to say anyway
  }

  return defer.promise;
};
