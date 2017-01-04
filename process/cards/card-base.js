
class CardBase {
  constructor() {}

  getNextEventTime(config) {
    let rangeInMilliSeconds = config.tick.every * this.unitInMilliSeconds(config.tick.unit);
    let now = new Date();
    return now.getTime() + rangeInMilliSeconds;
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
