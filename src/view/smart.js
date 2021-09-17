import Abstract from './abstract.js';

class Smart extends Abstract {
  constructor() {
    super();
    this._data = {};
  }

  get data() {
    return Object.assign({}, this._data);
  }

  updateData(update, justDataUpdating) {
    if(!update) {
      return;
    }

    this._data = Object.assign({}, this._data, update);

    if(justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  updateElement() {
    const prevElement = this.getElement();
    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();

    if(parent) {
      parent.replaceChild(newElement, prevElement);
      this.getElement().scrollTop = this._data.scrollTop;
    }
    this.restoreHandlers();
  }

  restoreHandlers() {

  }

}

export default Smart;
