import AbstractView from './abstract.js';

const createFilmListExtraTemplate = (block) => {
  const {name} = block;
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">${name}</h2>

            <div class="films-list__container"></div>
          </section>`;
};

class MovieListExtra extends AbstractView {
  constructor(block) {
    super();
    this._block = block;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._block);
  }
}

export default MovieListExtra;
