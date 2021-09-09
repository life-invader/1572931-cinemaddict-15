import AbstractView from './abstract.js';
import {FilterType} from '../js/const.js';

const _noMoviesComponentText = {
  [FilterType.all]: 'There are no movies in our database',
  [FilterType.watchlist]: 'There are no movies to watch now',
  [FilterType.history]: 'There are no watched movies now',
  [FilterType.favourites]: 'There are no favorite movies now',
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
