import AbstractView from './abstract.js';
import {FilterType} from '../js/const.js';

const createMenuTemplate = (filters, currentFilter) => {
  const watchListAmount = filters.find((filter) => filter.name === FilterType.watchlist).count;
  const watchedAmount = filters.find((filter) => filter.name === FilterType.history).count;
  const isFavourite = filters.find((filter) => filter.name === FilterType.favourites).count;

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" data-filter='${FilterType.all}' class="main-navigation__item main-navigation__item-all ${currentFilter === FilterType.all ? 'main-navigation__item--active' : ''}">All movies</a>
              <a href="#watchlist" data-filter='${FilterType.watchlist}' class="main-navigation__item main-navigation__item-watchlist ${currentFilter === FilterType.watchlist ? 'main-navigation__item--active' : ''}">Watchlist <span class="main-navigation__item-count">${watchListAmount}</span></a>
              <a href="#history" data-filter='${FilterType.history}' class="main-navigation__item main-navigation__history ${currentFilter === FilterType.history ? 'main-navigation__item--active' : ''}">History <span class="main-navigation__item-count">${watchedAmount}</span></a>
              <a href="#favorites" data-filter='${FilterType.favourites}' class="main-navigation__item main-navigation__item-favourites ${currentFilter === FilterType.favourites ? 'main-navigation__item--active' : ''}">Favorites <span class="main-navigation__item-count">${isFavourite}</span></a>
            </div>
            <a href="#stats" data-filter='${FilterType.statistics}' class="main-navigation__additional ${currentFilter === FilterType.statistics ? 'main-navigation__item--active' : ''}">Stats</a>
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

