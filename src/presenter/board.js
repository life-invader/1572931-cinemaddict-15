import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Занлушка на случай отсутсвия фильмов
// import MovieListExtra from './view/film-list-extra.js'; // Поле для 2-х экстра блоков
import MovieCardView from '../view/movie-card.js'; // Карточка фильма
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import MovieDetailsView from '../view/film-details.js'; // Показ подробной информации о фильме
import {render, RenderPosition, remove} from '../js/utils.js';

const SHOW_MORE_MOVIES_BUTTON_STEP = 5;
// const MOVIE_CARD_COUNT_EXTRA = 2;

// const EXTRA_MOVIES_BLOCKS = [
//   {
//     name: 'Top rated',
//     getMovies() {
//       return moviesMockCopy.sort((a, b) => b.rating - a.rating);
//     },
//   },
//   {
//     name: 'Most commented',
//     getMovies() {
//       return moviesMockCopy.sort((a, b) => b.comments.length - a.comments.length);
//     },
//   },
// ];

class Board {
  constructor(container) {
    this._boardContainer = container;

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    this._emptyFilmListComponent = new EmptyFilmListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
  }

  init(movies) {
    this._boardMovies = movies.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _renderMovieCard(movie) {
    const movieCard = new MovieCardView(movie);
    const movieContainer = this._filmListComponent.getElement().querySelector('.films-list__container');

    movieCard.setMovieCardClick(() => {
      if (document.body.classList.contains('hide-overflow')) {
        return;
      }
      document.body.classList.add('hide-overflow');
      this._renderMovieDetails(movie);
    });

    render(movieContainer, movieCard, RenderPosition.BEFOREEND);
  }

  _renderMovieDetails(movie) {
    const movieDetails = new MovieDetailsView(movie);
    const footerElement = document.querySelector('.footer');

    function closeMovieDetailsPopup() {
      document.body.classList.remove('hide-overflow');
      remove(movieDetails);
      document.removeEventListener('keydown', onEscKeyDown);
    }

    function onEscKeyDown(evt) {
      if (evt.key === 'Escape' || evt.key === 'Esc') {
        evt.preventDefault();
        closeMovieDetailsPopup();
      }
    }

    document.addEventListener('keydown', onEscKeyDown);

    movieDetails.setCloseMovieDetailsPopup(() => {
      closeMovieDetailsPopup();
    });

    render(footerElement, movieDetails, RenderPosition.BEFOREEND);
  }

  _renderMovieCards(from, to) {
    this._boardMovies
      .slice(from, to)
      .forEach((movie) => this._renderMovieCard(movie));
  }

  _renderNoMovies() {
    render(this._boardComponent, this._emptyFilmListComponent, RenderPosition.BEFOREEND);
  }

  _renderShowMoreButton() {
    render(this._filmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    let renderedMovieCount = SHOW_MORE_MOVIES_BUTTON_STEP;

    this._showMoreButtonComponent.setShowMoreButtonClick(() => {
      this._boardMovies
        .slice(renderedMovieCount, renderedMovieCount + SHOW_MORE_MOVIES_BUTTON_STEP)
        .forEach((movie) => this._renderMovieCard(movie));

      renderedMovieCount += SHOW_MORE_MOVIES_BUTTON_STEP;

      if (renderedMovieCount >= this._boardMovies.length) {
        this._showMoreButtonComponent.getElement().classList.add('visually-hidden');
      }
    });
  }

  _renderMovieList() {
    this._renderMovieCards(0, SHOW_MORE_MOVIES_BUTTON_STEP);

    if(this._boardMovies.length > SHOW_MORE_MOVIES_BUTTON_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderBoard() {
    if(this._boardMovies.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderMovieList();
  }
}

export default Board;
