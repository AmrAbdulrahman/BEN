let wolfram = require('../wolfram');
let { say, notify } = require('../output');
let q = require('q');
let CardBase = require('./card-base');

class Card extends CardBase {
  constructor() {
    super();

    this.key = 'joke';
    this.config = {
      say: true,
      tick: {
        every: 60,
        unit: 'seconds',
        startingFrom: new Date(0, 0, 0, 20, 21, 22), // Y, M, D, h, m, s
      },
    };
  }

  run() {
    let defer = q.defer();

    wolfram.query('tell me a joke')
      .then(({shortResult}) => {
        notify({
          title: 'Joke!',
          message: shortResult,
        });

        if (this.config.say) {
          say(shortResult).then(defer.resolve, defer.reject);
        } else {
          defer.resolve();
        }
      }, (error) => {
        console.log(error);
      })
      .catch((ex) => console.log(ex));

    return defer.promise;
  }

  getNextEventTime() {
    return super.getNextEventTime(this.config);
  }
};

module.exports = new Card();
