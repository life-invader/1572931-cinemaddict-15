import AbstractObserver from '../js/abstract-observer.js';
import {FILTER_TYPE} from '../js/utils.js';

class MenuFilter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FILTER_TYPE.all;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}

export default MenuFilter;
