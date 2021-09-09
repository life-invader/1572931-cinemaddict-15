import AbstractObserver from '../js/abstract-observer.js';
import {FilterType} from '../js/const.js';

class MenuFilter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FilterType.all;
  }

  setFilter(updateType, filter, renderStatistics) {
    this._activeFilter = filter;
    this._notify(updateType, filter, renderStatistics);
  }

  getFilter() {
    return this._activeFilter;
  }
}

export default MenuFilter;
