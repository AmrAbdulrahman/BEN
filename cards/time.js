let { say, notify } = require('../output');
let q = require('q');
let CardBase = require('./card-base');
let moment = require('moment');

class Card extends CardBase {
  constructor() {
    super();

    this.key = 'time';
    this.config = {
      say: true,
      tick: {
        every: 1,
        unit: 'minutes',
      },
    };
  }

  run() {
    let defer = q.defer();
    let formatedTime = moment().format('hh:mm a');
    let message = `It's ${formatedTime} now`;

    notify({
      title: 'Time',
      message,
    });

    if (this.config.say) {
      say(message).then(defer.resolve, defer.reject);
    } else {
      defer.resolve();
    }

    return defer.promise;
  }

  getNextEventTime() {
    return super.getNextEventTime(this.config);
  }
};

module.exports = new Card();
