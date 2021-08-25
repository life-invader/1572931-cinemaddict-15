import AbstractView from './abstract.js';

const createMenuTemplate = (movies) => {
  const watchListAmount = movies.getMovies().filter((movie) => movie.isInWatchList === true);
  const watchedAmount = movies.getMovies().filter((movie) => movie.isWatched === true);
  const isFavourite = movies.getMovies().filter((movie) => movie.isFavourite === true);

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

class Menu extends AbstractView {
  constructor(movies) {
    super();
    this._movies = movies;
  }

  getTemplate() {
    return createMenuTemplate(this._movies);
  }
}

export default Menu;

