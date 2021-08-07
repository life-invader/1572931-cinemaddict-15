import {createElement} from '../js/utils.js';

const createFilmListExtraTemplate = (block) => {
  const {name} = block;
  return `<section class="films-list films-list--extra">
            <h2 class="films-list__title">${name}</h2>

            <div class="films-list__container"></div>
          </section>`;
};

class MovieListExtra {
  constructor(block) {
    this._element = null;
    this._block = block;
  }

  getTemplate() {
    return createFilmListExtraTemplate(this._block);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

export default MovieListExtra;
