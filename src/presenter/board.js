import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Заглушка на случай отсутсвия фильмов
import SortView from '../view/sort.js';
// import MovieListExtra from './view/film-list-extra.js'; // Поле для 2-х экстра блоков
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import {render, RenderPosition, remove, replace, sortByDate, sortByrating, SORT_BUTTONS, UPDATE_TYPE, USER_ACTION, filter} from '../js/utils.js';
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
  constructor(container, movieModel, filterModel) {
    this._boardContainer = container;
    this._movieModel = movieModel;
    this._filterModel = filterModel;
    this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    this._currentSort = SORT_BUTTONS.default;
    this._moviePresenterMap = new Map();

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    // this._emptyFilmListComponent = new EmptyFilmListView();

    // this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent = null;
    this._sortComponent = null;
    this._noMoviesComponent = new EmptyFilmListView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModechange = this._handleModechange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

    this._movieModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderBoard();
  }

  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const movies = this._movieModel.getMovies();
    const filteredMovies = filter[filterType](movies);

    switch (this._currentSort) {
      case SORT_BUTTONS.byDate:
        // return this._movieModel.getMovies().slice().sort(sortByDate);
        return filteredMovies.sort(sortByDate);
      case SORT_BUTTONS.byRating:
        // return this._movieModel.getMovies().slice().sort(sortByrating);
        return filteredMovies.sort(sortByrating);
    }
    return filteredMovies;
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

    // // - Очищаем список
    // this._clearMovieList();

    // // Заменим View-компонент сортировки, чтобы подсветить нажатую кнопку
    // this._renderSort();

    // // - Рендерим список заново
    // this._renderMovieList();

    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSort() {
    // const prevSortComponent = this._sortComponent;
    // this._sortComponent = new SortView(this._currentSort);

    // if(prevSortComponent !== null) {
    //   if (this._boardContainer.contains(prevSortComponent.getElement())) {
    //     replace(this._sortComponent, prevSortComponent);
    //   }
    // }

    // if (prevSortComponent === null) {
    //   render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
    // }

    // this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);

    //==================>

    if(this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSort);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderMovieCard(movie) {
    const movieContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    const moviePresenter = new MoviePresenter(movieContainer, this._handleViewAction, this._handleModechange);
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
    this._noMoviesComponent = new EmptyFilmListView();
    render(this._boardComponent, this._noMoviesComponent, RenderPosition.BEFOREEND);
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
    if(this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setShowMoreButtonClick(this._handleShowMoreButtonClick);

    render(this._filmListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

  }

  // _renderMovieList() {
  //   const movieCount = this._getMovies().length;
  //   const movies = this._getMovies().slice(0, Math.min(movieCount, SHOW_MORE_MOVIES_BUTTON_STEP));

  //   this._renderMovieCards(movies);

  //   if(movieCount > SHOW_MORE_MOVIES_BUTTON_STEP) {
  //     this._renderShowMoreButton();
  //   }
  // }

  _handleViewAction(actionType, updateMovie, updateType) {
    // Здесь будем вызывать обновление модели.
    // actionType - действие пользователя, нужно чтобы понять, какой метод модели вызвать
    // updateType - тип изменений, нужно чтобы понять, что после нужно обновить
    // update - обновленные данные
    switch (actionType) {
      case USER_ACTION.UPDATE_MOVIE:
        this._movieModel.updateMovie(updateType, updateMovie);
        break;
      case USER_ACTION.ADD_COMMENT:
        this._movieModel.addComment(updateType, updateMovie);
        break;
      case USER_ACTION.DELETE_COMMENT:
        this._movieModel.deleteComment(updateType, updateMovie);
        break;
    }
  }

  _handleModelEvent(updateType, updateMovie) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._moviePresenterMap.get(updateMovie.id).init(updateMovie);
        console.log('PATCH');
        break;
      case UPDATE_TYPE.MINOR:
        this._clearBoard();
        this._renderBoard();
        console.log('MINOR');
        break;
      case UPDATE_TYPE.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        console.log('MAJOR');
        break;
    }
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    this._moviePresenterMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterMap.clear();

    remove(this._sortComponent);
    remove(this._showMoreButtonComponent);

    if(this._noMoviesComponent) {
      remove(this._noMoviesComponent);
    }

    if(resetRenderedTaskCount) {
      this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    } else {
      this._renderedMoviesCount = Math.min(movieCount, this._renderedMoviesCount);
    }

    if (resetSortType) {
      this._currentSort = SORT_BUTTONS.default;
    }
  }

  _renderBoard() {
    const movies = this._getMovies();
    const moviesCount = movies.length;

    this._renderSort();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    if(moviesCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderMovieCards(movies.slice(0, Math.min(moviesCount, this._renderedMoviesCount)));

    if(moviesCount > this._renderedMoviesCount) {
      this._renderShowMoreButton();
    }

    // this._renderMovieList();
  }
}

export default Board;
