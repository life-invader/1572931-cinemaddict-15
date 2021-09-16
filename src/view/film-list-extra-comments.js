import AbstractView from './abstract.js';

const createFilmListExtraTemplate = () => (
  `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container"></div>
  </section>`
);

class MovieListExtra extends AbstractView {
  getTemplate() {
    return createFilmListExtraTemplate();
  }
}

export default MovieListExtra;
