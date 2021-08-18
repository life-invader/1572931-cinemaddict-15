import AbstractView from './abstract.js';
import {SORT_BUTTONS} from '../js/utils.js';

const createSortTemplate = () => (
  `<ul class="sort">
    <li><a href="#" data-sort='${SORT_BUTTONS.default}' class="sort__button sort__button-default sort__button--active">Sort by default</a></li>
    <li><a href="#" data-sort='${SORT_BUTTONS.byDate}' class="sort__button sort__button-date">Sort by date</a></li>
    <li><a href="#" data-sort='${SORT_BUTTONS.byRating}' class="sort__button sort__button-rating">Sort by rating</a></li>
  </ul>`
);

class Sort extends AbstractView {
  constructor() {
    super();

    this._sortChangeHandler = this._sortChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate();
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
