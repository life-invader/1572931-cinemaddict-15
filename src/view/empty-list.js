import AbstractView from './abstract.js';

const createEmptyFilmListTemplate = () => (
  `<section class="films">
    <section class="films-list">
      <h2 class="films-list__title">There are no movies in our database</h2>
    </section>
  </section>`
);

class EmptyFilmList extends  AbstractView {
  getTemplate() {
    return createEmptyFilmListTemplate();
  }
}

export default EmptyFilmList;
