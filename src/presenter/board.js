import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Заглушка на случай отсутсвия фильмов
import SortView from '../view/sort.js';
// import MovieListExtra from './view/film-list-extra.js'; // Поле для 2-х экстра блоков
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import {render, RenderPosition, remove, updateItem, replace, sortByDate, sortByrating, SORT_BUTTONS} from '../js/utils.js';
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
  constructor(container, movieModel) {
    this._boardContainer = container;
    this._movieModel = movieModel;
    this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    this._currentSort = SORT_BUTTONS.default;
    this._moviePresenterMap = new Map();
    this._sortComponent = null;

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    this._emptyFilmListComponent = new EmptyFilmListView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleMovieUpdate = this._handleMovieUpdate.bind(this);
    this._handleModechange = this._handleModechange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);
  }

  init(movies) {
    this._boardMovies = movies.slice();
    this._sourcedBoardMovies = movies.slice();

    this._renderBoard();
  }

  _getMovies() {
    return this._movieModel.getMovies();
  }

  _handleModechange() {
    this._moviePresenterMap.forEach((presenter) => presenter.resetView());
  }

  _handleSortChange(sortType) {
    // - Сортируем задачи
    if (this._currentSort === sortType) {
      return;
    }

    this._sortMovies(sortType);

    // - Очищаем список
    this._clearMovieList();

    // Заменим View-компонент сортировки, чтобы подсветить нажатую кнопку
    this._renderSort();

    // - Рендерим список заново
    this._renderMovieList();
  }

  _renderSort() {
    const prevSortComponent = this._sortComponent;
    this._sortComponent = new SortView(this._currentSort);

    if(prevSortComponent !== null) {
      if (this._boardContainer.contains(prevSortComponent.getElement())) {
        replace(this._sortComponent, prevSortComponent);
      }
    }

    if (prevSortComponent === null) {
      render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    }

    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
  }

  _sortMovies(sortType) {
    switch (sortType) {
      case SORT_BUTTONS.byDate:
        this._boardMovies.sort(sortByDate);
        break;
      case SORT_BUTTONS.byRating:
        this._boardMovies.sort(sortByrating);
        break;
      default:
        this._boardMovies = this._sourcedBoardMovies.slice();
    }

    this._currentSort = sortType;
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
    this._sourcedBoardMovies = updateItem(this._sourcedBoardMovies, updateMovie);
    this._moviePresenterMap.get(updateMovie.id).init(updateMovie);
  }

  _renderBoard() {
    this._renderSort();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    if(this._boardMovies.length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderMovieList();
  }
}

export default Board;
