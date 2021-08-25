import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Заглушка на случай отсутсвия фильмов
import SortView from '../view/sort.js';
// import MovieListExtra from './view/film-list-extra.js'; // Поле для 2-х экстра блоков
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import {render, RenderPosition, remove, replace, sortByDate, sortByrating, SORT_BUTTONS} from '../js/utils.js';
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

  init() {
    this._renderBoard();
  }



  _getMovies() {
    switch (this._currentSort) {
      case SORT_BUTTONS.byDate:
        return this._movieModel.getMovies().slice().sort(sortByDate);
      case SORT_BUTTONS.byRating:
        return this._movieModel.getMovies().slice().sort(sortByrating);
    }
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

    this._currentSort = sortType;

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

  _renderMovieCard(movie) {
    const movieContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    const moviePresenter = new MoviePresenter(movieContainer, this._handleMovieUpdate, this._handleModechange);
    moviePresenter.init(movie);
    this._moviePresenterMap.set(movie.id, moviePresenter);
  }

  _renderMovieCards(movies) {
    movies.forEach((movie) => this._renderMovieCard(movie));
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
    const movieCount = this._getMovies().length;
    const newRenderMovieCount = Math.min(movieCount, this._renderedMoviesCount + SHOW_MORE_MOVIES_BUTTON_STEP);
    const movies = this._getMovies().slice(this._renderedMoviesCount, newRenderMovieCount);

    this._renderMovieCards(movies);
    this._renderedMoviesCount = newRenderMovieCount;

    if (this._renderedMoviesCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._filmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setShowMoreButtonClick(this._handleShowMoreButtonClick);
  }

  _renderMovieList() {
    const movieCount = this._getMovies().length;
    const movies = this._getMovies().slice(0, Math.min(movieCount, SHOW_MORE_MOVIES_BUTTON_STEP));

    this._renderMovieCards(movies);

    if(movieCount > SHOW_MORE_MOVIES_BUTTON_STEP) {
      this._renderShowMoreButton();
    }
  }

  _handleMovieUpdate(updateMovie) {
    this._moviePresenterMap.get(updateMovie.id).init(updateMovie);
  }

  _renderBoard() {
    this._renderSort();

    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    if(this._getMovies().length === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderMovieList();
  }
}

export default Board;
