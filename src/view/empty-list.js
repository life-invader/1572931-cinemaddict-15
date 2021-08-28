import AbstractView from './abstract.js';
import {FILTER_TYPE} from '../js/utils.js';

const _noMoviesComponentText = {
  [FILTER_TYPE.all]: 'There are no movies in our database',
  [FILTER_TYPE.watchlist]: 'There are no movies to watch now',
  [FILTER_TYPE.history]: 'There are no watched movies now',
  [FILTER_TYPE.favourites]: 'There are no favorite movies now',
};

const createEmptyFilmListTemplate = (filter) => {
  const noMoviesText = _noMoviesComponentText[filter];

  return (
    `<section class="films">
      <section class="films-list">
        <h2 class="films-list__title">${noMoviesText}</h2>
      </section>
    </section>`);
};

class EmptyFilmList extends  AbstractView {
  constructor(filter) {
    super();
    this._filter = filter;
  }

  getTemplate() {
    return createEmptyFilmListTemplate(this._filter);
  }
}

export default EmptyFilmList;
