import {createElement} from '../js/utils.js';

const menuTemplate = (movies) => {
  const watchListAmount = movies.filter((movie) => movie.isInWatchList === true);
  const watchedAmount = movies.filter((movie) => movie.isWatched === true);
  const isFavourite = movies.filter((movie) => movie.isFavourite === true);

  return `<nav class="main-navigation">
            <div class="main-navigation__items">
              <a href="#all" class="main-navigation__item main-navigation__item-all main-navigation__item--active">All movies</a>
              <a href="#watchlist" class="main-navigation__item main-navigation__item-watchlist">Watchlist <span class="main-navigation__item-count">${watchListAmount.length}</span></a>
              <a href="#history" class="main-navigation__item main-navigation__history">History <span class="main-navigation__item-count">${watchedAmount.length}</span></a>
              <a href="#favorites" class="main-navigation__item main-navigation__item-favourites">Favorites <span class="main-navigation__item-count">${isFavourite.length}</span></a>
            </div>
            <a href="#stats" class="main-navigation__additional">Stats</a>
          </nav>`;
};

class Menu {
  constructor(movies) {
    this._element = null;
    this._movies = movies;
  }

  getTemplate() {
    return menuTemplate(this._movies);
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

export default Menu;

