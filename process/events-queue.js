
class EventsQueue {
  constructor() {
    this.events = [];
  }

  top() {
    if (!this.events.length) {
      return null;
    }

    return this.events[0];
  }

  pop() {
    if (!this.events.length) {
      return null;
    }

    return this.events.splice(0, 1)[0];
  }

  add(event) {
    let index = 0;

    while (index < this.events.length && this.events[index].time < event.time) {
      index ++;
    }

    this.events.splice(index, 0, event);
  }

  get count() {
    return this.events.length;
  }
};

module.exports = EventsQueue;
