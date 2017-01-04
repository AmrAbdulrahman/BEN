
class CardBase {
  constructor() {}

  getNextEventTime(config) {
    let currentTime = (new Date()).getTime();
  	let timeSinceStart = currentTime - config.startAt;
    let repeatEvery = config.repeat.every * this.unitInMilliSeconds(config.repeat.unit);

  	//This means that there is an event from the same conf
  	//will get execute in the current second, but we will not consider it.
  	if (timeSinceStart % repeatEvery == 0) {
      // @TODO handle this
    }

  	let eventsCount = Math.floor(timeSinceStart / repeatEvery);
  	return (eventsCount + 1) * repeatEvery + config.startAt;
  }

  unitInMilliSeconds(unit) {
    if (unit === 'seconds') {
      return 1000;
    }

    if (unit === 'minutes') {
      return 1000 * 60;
    }

    if (unit === 'hours') {
      return 1000 * 60 * 60;
    }

    if (unit === 'days') {
      return 1000 * 60 * 60 * 24;
    }

    if (unit === 'weeks') {
      return 1000 * 60 * 60 * 24 * 7;
    }

    throw new Error(`unkown unit ${unit}`);
  }
}

module.exports = CardBase;
