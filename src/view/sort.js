import AbstractView from './abstract.js';
import {SortButton} from '../js/const.js';

const createSortTemplate = (sortType) => (
  `<ul class="sort">
    <li><a href="#" data-sort='${SortButton.DEFAULT}' class="sort__button sort__button-default ${sortType === SortButton.DEFAULT ? 'sort__button--active' : ''}">Sort by default</a></li>
    <li><a href="#" data-sort='${SortButton.BY_DATE}' class="sort__button sort__button-date ${sortType === SortButton.BY_DATE ? 'sort__button--active' : ''}" >Sort by date</a></li>
    <li><a href="#" data-sort='${SortButton.BY_RATING}' class="sort__button sort__button-rating ${sortType === SortButton.BY_RATING ? 'sort__button--active' : ''}">Sort by rating</a></li>
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
