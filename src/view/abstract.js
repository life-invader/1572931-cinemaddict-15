import {createElement} from '../js/utils.js';

class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error('Can\'t instantiate Abstract, only concrete one.');
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error('В новом классе определи свой метод!');
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

export default Abstract;
