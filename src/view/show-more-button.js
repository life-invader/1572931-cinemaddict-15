import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

class ShowMoreButton extends AbstractView {
  constructor() {
    super();
    this._showMoreButtonClick = this._showMoreButtonClick.bind(this);
  }

  getTemplate() {
    return createShowMoreButtonTemplate();
  }

  _showMoreButtonClick() {
    this._callback.showMoreButtonClick();
  }

  setShowMoreButtonClick(callback) {
    this._callback.showMoreButtonClick = callback;
    this.getElement().addEventListener('click', this._showMoreButtonClick);
  }

}

export default ShowMoreButton;
