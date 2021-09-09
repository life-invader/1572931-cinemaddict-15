import AbstractView from './abstract.js';
import {SortButtons} from '../js/const.js';

const createSortTemplate = (sortType) => (
  `<ul class="sort">
    <li><a href="#" data-sort='${SortButtons.default}' class="sort__button sort__button-default ${sortType === SortButtons.default ? 'sort__button--active' : ''}">Sort by default</a></li>
    <li><a href="#" data-sort='${SortButtons.byDate}' class="sort__button sort__button-date ${sortType === SortButtons.byDate ? 'sort__button--active' : ''}" >Sort by date</a></li>
    <li><a href="#" data-sort='${SortButtons.byRating}' class="sort__button sort__button-rating ${sortType === SortButtons.byRating ? 'sort__button--active' : ''}">Sort by rating</a></li>
  </ul>`
);

class Sort extends AbstractView {
  constructor(sortType) {
    super();

    this._sortType = sortType;
    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sortType);
  }

  _sortChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sort);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortChangeHandler);
  }
}

export default Sort;
