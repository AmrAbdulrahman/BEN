let notifier = require('node-notifier');
let path = require('path');
let _ = require('lodash');

module.exports = (options) => {
  _.defaults(options, {
    title: 'BEN',
    message: 'Hello papa!',
    icon: path.join(__dirname, '/img/ben.jpg'),
    sound: true,
  });

  notifier.notify(options);
};
