class AbstractObserver {
  constructor() {
    this._observers = new Set();
  }

  addObserver(observer) {
    this._observers.add(observer);
  }

  removeObserver(observer) {
    this._observers.delete(observer);
  }

  _notify(event, payload, additional) {
    this._observers.forEach((observer) => observer(event, payload, additional));
  }
}

export default AbstractObserver;
