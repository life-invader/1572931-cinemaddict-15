import MovieCardView from '../view/movie-card.js'; // Карточка фильма
import MovieDetailsView from '../view/film-details.js'; // Показ подробной информации о фильме
import {render, RenderPosition, remove} from '../js/utils.js';

class Movie {
  constructor(movieListContainer) {
    this._movieListContainer = movieListContainer;

    this._movieComponent = null;
    this._movieDetailsComponent = null;

    this._handleOpenMovieDetails = this._handleOpenMovieDetails.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieComponent = new MovieCardView(movie);
    this._movieDetailsComponent = new MovieDetailsView(movie);


    this._movieComponent.setMovieCardClick(this._handleOpenMovieDetails);

    render(this._movieListContainer, this._movieComponent, RenderPosition.BEFOREEND);
  }

  //=================================================================================================================

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closeMovieDetailsPopup();
    }
  }

  _closeMovieDetailsPopup() {
    document.body.classList.remove('hide-overflow');
    remove(this._movieDetailsComponent);
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _renderMovieDetails() {
    const footerElement = document.querySelector('.footer');

    document.addEventListener('keydown', this._onEscKeyDown);

    this._movieDetailsComponent.setCloseMovieDetailsPopup(() => {
      this._closeMovieDetailsPopup();
    });

    render(footerElement, this._movieDetailsComponent, RenderPosition.BEFOREEND);
  }

  _handleOpenMovieDetails() {
    if (document.body.classList.contains('hide-overflow')) {
      return;
    }
    document.body.classList.add('hide-overflow');
    this._renderMovieDetails();
  }

}

export default Movie;
