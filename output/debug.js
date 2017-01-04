let moment = require('moment');
let log = require('./log');
let _ = require('lodash');

module.exports = (...args) => {
  let time = moment().format('hh:mm:ss a').bold.blue;
  let allArgs = args.join(' ');

  _.each(allArgs.split('\n'), (line) => {
    log(`[${time}]`, line);
  });
};
