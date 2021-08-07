import {createElement} from '../js/utils.js';

const movieCardTemplate = (filmCard) => {
  const {name, rating, details, duration, genre, description, comments, poster, isInWatchList, isWatched, isFavourite} = filmCard;

  const formatMovieReleaseDate = (movieReleaseDate) => movieReleaseDate.format('YYYY');

  return `<article class="film-card">
            <h3 class="film-card__title">${name}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${formatMovieReleaseDate(details.releaseDate)}</span>
              <span class="film-card__duration">${duration}</span>
              <span class="film-card__genre">${genre}</span>
            </p>
            <img src="${poster}" alt="" class="film-card__poster">
            <p class="film-card__description">${description}</p>
            <a class="film-card__comments">${comments.length} comments</a>
            <div class="film-card__controls">
              <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${isInWatchList ? 'film-card__controls-item--active' : ''}" type="button">Add to watchlist</button>
              <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${isWatched ? 'film-card__controls-item--active' : ''}" type="button">Mark as watched</button>
              <button class="film-card__controls-item film-card__controls-item--favorite ${isFavourite ? 'film-card__controls-item--active' : ''}" type="button">Mark as favorite</button>
            </div>
          </article>`;
};

class MovieCard {
  constructor(movie) {
    this._element = null;
    this._movie = movie;
  }

  getTemplate() {
    return movieCardTemplate(this._movie);
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

export default MovieCard;
