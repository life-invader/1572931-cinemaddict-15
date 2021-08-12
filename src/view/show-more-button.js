import AbstractView from './abstract.js';

const createShowMoreButtonTemplate = () => '<button class="films-list__show-more">Show more</button>';

class ShowMoreButton extends AbstractView {
  getTemplate() {
    return createShowMoreButtonTemplate();
  }
}

export default ShowMoreButton;
