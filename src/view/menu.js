import AbstractView from './abstract.js';
import {FILTER_TYPE} from '../js/utils.js';

const createMenuTemplate = (filters, currentFilter) => {
  const watchListAmount = filters.find((filter) => filter.name === FILTER_TYPE.watchlist).count;
  const watchedAmount = filters.find((filter) => filter.name === FILTER_TYPE.history).count;
  const isFavourite = filters.find((filter) => filter.name === FILTER_TYPE.favourites).count;

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" data-filter='${FILTER_TYPE.all}' class="main-navigation__item main-navigation__item-all ${currentFilter === FILTER_TYPE.all ? 'main-navigation__item--active' : ''}">All movies</a>
              <a href="#watchlist" data-filter='${FILTER_TYPE.watchlist}' class="main-navigation__item main-navigation__item-watchlist ${currentFilter === FILTER_TYPE.watchlist ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${watchListAmount}</span></a>
              <a href="#history" data-filter='${FILTER_TYPE.history}' class="main-navigation__item main-navigation__history ${currentFilter === FILTER_TYPE.history ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${watchedAmount}</span></a>
              <a href="#favorites" data-filter='${FILTER_TYPE.favourites}' class="main-navigation__item main-navigation__item-favourites ${currentFilter === FILTER_TYPE.favourites ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${isFavourite}</span></a>
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

class Menu extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}

export default Menu;

