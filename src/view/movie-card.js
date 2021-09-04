import AbstractView from './abstract.js';
import dayjs from 'dayjs';

const createMovieCardTemplate = (filmCard) => {
  const {name, rating, details, duration, description, comments, poster, isInWatchList, isWatched, isFavourite} = filmCard;

  const formatMovieReleaseDate = (movieReleaseDate) => dayjs(movieReleaseDate).format('YYYY');
  const formatDuration = (movieDuration) => dayjs().startOf('day').add(movieDuration, 'minute').format('H[h] mm[m]');

  return `<article class="film-card">
            <h3 class="film-card__title">${name}</h3>
            <p class="film-card__rating">${rating}</p>
            <p class="film-card__info">
              <span class="film-card__year">${formatMovieReleaseDate(details.releaseDate)}</span>
              <span class="film-card__duration">${formatDuration(duration)}</span>
              <span class="film-card__genre">${details.genres[0]}</span>
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

class MovieCard extends AbstractView {
  constructor(movie) {
    super();
    this._movie = movie;

    this._movieCardClick = this._movieCardClick.bind(this);
    this._favouriteButtonClick = this._favouriteButtonClick.bind(this);
    this._addToWatchlistButtonClick = this._addToWatchlistButtonClick.bind(this);
    this._markAsWatchedButtonClick = this._markAsWatchedButtonClick.bind(this);
  }

  getTemplate() {
    return createMovieCardTemplate(this._movie);
  }

  _movieCardClick(evt) {
    evt.preventDefault();
    this._callback.movieCardClick();
  }

  _favouriteButtonClick() {
    this._callback.favouriteButtonClick();
  }

  _addToWatchlistButtonClick() {
    this._callback.addToWatchListButtonClick();
  }

  _markAsWatchedButtonClick() {
    this._callback.markAsWatchedButtonClick();
  }

  setMovieCardClick(callback) {
    this._callback.movieCardClick = callback;
    this.getElement().querySelectorAll('.film-card__title, .film-card__poster, .film-card__comments').forEach((element) => element.addEventListener('click', this._movieCardClick));
  }

  setFavouriteButtonClick(callback) {
    this._callback.favouriteButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--favorite').addEventListener('click', this._favouriteButtonClick);
  }

  setAddToWatchlistButtonClick(callback) {
    this._callback.addToWatchListButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--add-to-watchlist').addEventListener('click', this._addToWatchlistButtonClick);
  }

  setMarkAsWatchedButtonClick(callback) {
    this._callback.markAsWatchedButtonClick = callback;
    this.getElement().querySelector('.film-card__controls-item--mark-as-watched').addEventListener('click', this._markAsWatchedButtonClick);
  }
}

export default MovieCard;
