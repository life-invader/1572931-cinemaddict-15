import AbstractView from './abstract.js';

const createFilmListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container"></div>

    </section>
  </section>`
);

class FilmList extends AbstractView {
  getTemplate() {
    return createFilmListTemplate();
  }
}

export default FilmList;
