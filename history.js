class History {
  constructor() {
    this.history = [];
    this.index = null;
    this.currentQuery = '';
  }

  addCurrentQueryToHistory() {
    this.history.push(this.currentQuery);
    this.index = null;
    this.currentQuery = '';
  }

  setCurrentQuery(key) {
    if (key.name === 'backspace' && this.currentQuery.length) {
      this.currentQuery.splice(this.currentQuery.length - 1, 1);
    } else {
      this.currentQuery += key.name;
    }

    return this.getCurrentQuery();
  }

  getCurrentQuery() {
    return this.currentQuery;
  }

  goUp() {
    if (this.history.length === 0) {
      return '';
    }

    if (this.index === null) {
      this.index = this.history.length - 1;
    } else if (this.index !== 0) {
      this.index --;
    }

    return this.history[this.index];
  }
}
