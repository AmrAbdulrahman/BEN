let q = require('q');
let { say } = require('../output');

module.exports = {
  'Goodbye.': function() {
    let defer = q.defer();

    say('\nGoodbye Amr!\n', {format: 'cyan'}).then(process.exit);

    return defer.promise;
  }
}
