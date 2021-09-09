import AbstractView from './abstract.js';
import {FilterType} from '../js/const.js';

const createMenuTemplate = (filters, currentFilter) => {
  const watchListAmount = filters.find((filter) => filter.name === FilterType.WATCHLIST).count;
  const watchedAmount = filters.find((filter) => filter.name === FilterType.HISTORY).count;
  const isFavourite = filters.find((filter) => filter.name === FilterType.FAVOURITE).count;

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" data-filter='${FilterType.ALL}' class="main-navigation__item main-navigation__item-all ${currentFilter === FilterType.ALL ? 'main-navigation__item--active' : ''}">All movies</a>
              <a href="#watchlist" data-filter='${FilterType.WATCHLIST}' class="main-navigation__item main-navigation__item-watchlist ${currentFilter === FilterType.WATCHLIST ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${watchListAmount}</span></a>
              <a href="#history" data-filter='${FilterType.HISTORY}' class="main-navigation__item main-navigation__history ${currentFilter === FilterType.HISTORY ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${watchedAmount}</span></a>
              <a href="#favorites" data-filter='${FilterType.FAVOURITE}' class="main-navigation__item main-navigation__item-favourites ${currentFilter === FilterType.FAVOURITE ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${isFavourite}</span></a>
            </div>
            <a href="#stats" data-filter='${FilterType.STATISTIC}' class="main-navigation__additional ${currentFilter === FilterType.STATISTIC ? 'main-navigation__item--active' : ''}">Stats</a>
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

