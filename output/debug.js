let moment = require('moment');
let log = require('./log');

module.exports = (...args) => {
  let time = moment().format('hh:mm:ss a').bold.blue;
  log(`[${time}]`, args.join(' '));
};
