import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Заглушка на случай отсутсвия фильмов
// import MovieListExtra from './view/film-list-extra.js'; // Поле для 2-х экстра блоков
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import {render, RenderPosition, remove, updateItem} from '../js/utils.js';
import MoviePresenter from './movie.js';


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
    this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    this._moviePresenterMap = new Map();

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    this._emptyFilmListComponent = new EmptyFilmListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleMovieUpdate = this._handleMovieUpdate.bind(this);
    this._handleModechange = this._handleModechange.bind(this);
  }

  init(movies) {
    this._boardMovies = movies.slice();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderBoard();
  }

  _handleModechange() {
    this._moviePresenterMap.forEach((presenter) => presenter.resetView());
  }

  _renderMovieCard(movie) {
    const movieContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    const moviePresenter = new MoviePresenter(movieContainer, this._handleMovieUpdate, this._handleModechange);
    moviePresenter.init(movie);
    this._moviePresenterMap.set(movie.id, moviePresenter);
  }

  _renderMovieCards(from, to) {
    this._boardMovies
      .slice(from, to)
      .forEach((movie) => this._renderMovieCard(movie));
  }

  _clearMovieList() {
    this._moviePresenterMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterMap.clear();
    this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderNoMovies() {
    render(this._boardComponent, this._emptyFilmListComponent, RenderPosition.BEFOREEND);
  }

  _handleShowMoreButtonClick() {
    this._renderMovieCards(this._renderedMoviesCount, this._renderedMoviesCount + SHOW_MORE_MOVIES_BUTTON_STEP);
    this._renderedMoviesCount += SHOW_MORE_MOVIES_BUTTON_STEP;

    if (this._renderedMoviesCount >= this._boardMovies.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setShowMoreButtonClick(this._handleShowMoreButtonClick);
  }

  _renderMovieList() {
    this._renderMovieCards(0, SHOW_MORE_MOVIES_BUTTON_STEP);

    if(this._boardMovies.length > SHOW_MORE_MOVIES_BUTTON_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleMovieUpdate(updateMovie) {
    this._boardMovies = updateItem(this._boardMovies, updateMovie);
    this._moviePresenterMap.get(updateMovie.id).init(updateMovie);
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
