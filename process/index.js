let tickIntervalSeconds = 30; // tick every minute
let processStartupTime = new Date();
let secondsToNextTick = tickIntervalSeconds - (processStartupTime.getSeconds() % tickIntervalSeconds);

let _ = require('lodash');
let moment = require('moment');
let { debug } = require('../output');

debug('Process started');
debug(`Tick interval: ${tickIntervalSeconds}`);
debug('First tick after', secondsToNextTick, 'seconds');

// forever, tick every 'tickIntervalSeconds'
// @TODO: make it smart not to tick at night for example
setTimeout(() => {
  tick();
  setInterval(tick, tickIntervalSeconds * 1000)
}, secondsToNextTick * 1000)

let EventsQueue = require('./events-queue');
let Q = new EventsQueue();

let cards = [
  require('./cards/time'),
  require('./cards/joke'),
];

// initially fill in the queue with all cards
_.each(cards, (card) => {
  Q.add({
    time: (new Date()).getTime(),
    card: card,
  });

  debug(`\nScheduled first event for '${card.key}' card.`);
  debug(`It runs every ${(card.config.repeat.every + '').bold} ${card.config.repeat.unit.bold}`);
});

debug(`\nScheduled ${cards.length} events.`)

// 1. check for all instances that's less than or equal current time
// 2. run them all in order
// 3. add next event for each
function tick() {
  let now = (new Date()).getTime();
  let events = [];

  debug('\nTick...');

  // 1. get them all
  while (Q.top() && Q.top().time <= now) {
    events.push(Q.pop());
  }

  debug(`Got ${(events.length + '').bold} event(s) to run | Queue has ${(Q.count + '').bold} scheduled events`);

  // recursively because we depend on promises
  // every event execution has to wait the one before
  // that's only because it may be "speaking"
  // we don't want different events to speak all at one time
  if (events.length) {
    (function runEvent(index) {
      let card = events[index].card;
      let cardRunningStartTime = (new Date()).getTime();

      debug(`\nStarted '${card.key}' ...`);

      card
        .run()
        .then(() => {
          let event = {card, time: card.getNextEventTime()};
          let nextEventTime = moment(event.time).format('MMM Do, YY, h:mm:ss a');
          debug(`Scheduling next event for '${card.key.bold}' at [${nextEventTime.bold}]`);
          Q.add(event);
        }, (error) => console.log(error))

        // anyway, eaither succeeded or failed, run next one.
        .fin(() => {
          let duration = (new Date()).getTime() - cardRunningStartTime;
          debug(`Finish '${card.key.bold}' | Duration: ${(duration / 1000 + '').bold} seconds`);
          runEvent(index + 1);
        });
    })(0);
  }
}
