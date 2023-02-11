class EventBus {
  constructor() {
    this.eventTopics = {};
  }

  addEventListener(eventName, listener) {
    if (!this.eventTopics[eventName] || this.eventTopics[eventName].length < 1) {
      this.eventTopics[eventName] = [];
    }
    this.eventTopics[eventName].push(listener);
  };

  fireEvent(eventName, params) {
    if (!this.eventTopics[eventName] || this.eventTopics[eventName].length < 1)
      return;
    this.eventTopics[eventName].forEach(function (listener) {
      listener(!!params ? params : {});
    });
  }

  removeListener(eventName, listener) {
    if (!this.eventTopics[eventName] || this.eventTopics[eventName].length < 1)
      return;
    // delete listener by event name
    delete this.eventTopics[eventName];
  };

  getListener(eventName) {
    return this.eventTopics[eventName];
  }
}

export { EventBus };