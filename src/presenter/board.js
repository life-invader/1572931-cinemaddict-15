import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Заглушка на случай отсутсвия фильмов
import SortView from '../view/sort.js';
import LoadingView from '../view/loading.js';
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import UserStatisticsView from '../view/user-statistics.js'; // Кнопка показать еще
import {render, RenderPosition, remove, sortByDate, sortByrating, SORT_BUTTONS, UPDATE_TYPE, USER_ACTION, filter} from '../js/utils.js';
import MoviePresenter, {State} from './movie.js';

const SHOW_MORE_MOVIES_BUTTON_STEP = 5;

const mainElement = document.querySelector('.main');

class Board {
  constructor(container, movieModel, filterModel, api) {
    this._boardContainer = container;
    this._movieModel = movieModel;
    this._filterModel = filterModel;
    this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    this._currentSort = SORT_BUTTONS.default;
    this._isLoading = true;
    this._api = api;
    this._moviePresenterMap = new Map();

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    this._userStatisticsComponent = new UserStatisticsView();
    this._showMoreButtonComponent = null;
    this._sortComponent = null;
    this._noMoviesComponent = new EmptyFilmListView();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModechange = this._handleModechange.bind(this);
    this._handleSortChange = this._handleSortChange.bind(this);

  }

  init() {
    this._movieModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderBoard();
  }

  destroy() {
    this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});

    remove(this._boardComponent);
  }

  _getMovies() {
    this._filterType = this._filterModel.getFilter();
    const movies = this._movieModel.getMovies();
    const filteredMovies = filter[this._filterType](movies);

    switch (this._currentSort) {
      case SORT_BUTTONS.byDate:
        return filteredMovies.sort(sortByDate);
      case SORT_BUTTONS.byRating:
        return filteredMovies.sort(sortByrating);
    }
    return filteredMovies;
  }

  _handleModechange() {
    this._moviePresenterMap.forEach((presenter) => presenter.resetView());
  }

  _handleSortChange(sortType) {
    if (this._currentSort === sortType) {
      return;
    }

    this._currentSort = sortType;

    this._clearBoard({resetRenderedTaskCount: true});
    this._renderBoard();
  }

  _renderSort() {
    if(this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSort);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderMovieCard(movie) {
    const movieContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    const moviePresenter = new MoviePresenter(movieContainer, this._handleViewAction, this._handleModechange, this._api);
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
    this._noMoviesComponent = new EmptyFilmListView(this._filterType);
    render(mainElement, this._noMoviesComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    this._loadingComponent = new LoadingView();
    render(mainElement, this._loadingComponent, RenderPosition.BEFOREEND);
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

  _handleViewAction(actionType, updatedData, updateType) {
    const newData = Object.assign({}, updatedData);
    switch (actionType) {
      case USER_ACTION.UPDATE_MOVIE:
        this._api.updateMovie(updatedData)
          .then((response) => this._movieModel.updateMovie(updateType, response))
          .catch(() => {throw new Error('Ошибка рбновления карточки фильма');});
        break;
      case USER_ACTION.ADD_COMMENT:
        this._moviePresenterMap.get(updatedData.movieId).setViewState(State.ADDING);
        this._api.addComment(updatedData)
          .then((response) => {
            this._movieModel.addComment(updateType, response);
          })
          .catch(() => {
            this._moviePresenterMap.get(newData.movieId).setViewState(State.ABORTING_ADDING);
            throw new Error('Ошибка добавления коментария');
          });
        break;
      case USER_ACTION.DELETE_COMMENT:
        this._moviePresenterMap.get(updatedData.movieId).setViewState(State.DELETING);
        this._api.deleteComment(updatedData)
          .then(() => this._movieModel.deleteComment(updateType, updatedData))
          .catch(() => {
            this._moviePresenterMap.get(updatedData.movieId).setViewState(State.ABORTING_DELETING);
            throw new Error('Ошибка удаления коментария');
          });
        break;
    }
  }

  _handleModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UPDATE_TYPE.PATCH:
        this._moviePresenterMap.get(updatedData.id).init(updatedData);
        break;
      case UPDATE_TYPE.MINOR: {
        const isPopupOpened = this._moviePresenterMap.get(updatedData.id).isPopupOpened();
        this._clearBoard();
        this._renderBoard();

        let moviePresenter = this._moviePresenterMap.get(updatedData.id);
        if(!moviePresenter){
          moviePresenter = new MoviePresenter(null, this._handleViewAction, this._handleModechange, this._api);
          moviePresenter.init(updatedData);
          this._moviePresenterMap.set(updatedData.id, moviePresenter);
        }
        if (moviePresenter && isPopupOpened) {
          moviePresenter.openPopup();
        }
      }
        break;
      case UPDATE_TYPE.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UPDATE_TYPE.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    this._moviePresenterMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterMap.clear();

    remove(this._sortComponent);
    remove(this._loadingComponent);
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

  _renderStatistics() {
    render(mainElement, this._userStatisticsComponent, RenderPosition.BEFOREEND); // Статистика юзера
  }

  _renderBoard() {
    if(this._isLoading) {
      this._renderLoading();
      return;
    }

    const movies = this._getMovies();
    const moviesCount = movies.length;

    if(moviesCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderMovieCards(movies.slice(0, Math.min(moviesCount, this._renderedMoviesCount)));

    if(moviesCount > this._renderedMoviesCount) {
      this._renderShowMoreButton();
    }
  }
}

export default Board;
