import {createElement} from '../js/utils.js';

const statisticsTemplate = () => '<p>130 291 movies inside</p>';

class Statistics {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return statisticsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default Statistics;
