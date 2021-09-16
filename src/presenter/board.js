import BoardView from '../view/board.js'; // Поле с фильмами
import FilmListView from '../view/film-list.js'; // главный контейнер для карточек фильмов и кнопки
import EmptyFilmListView from '../view/empty-list.js'; // Заглушка на случай отсутсвия фильмов
import FilmListExtraView from '../view/film-list-extra.js'; // Дополнительный блок
import FilmListExtraCommentsView from '../view/film-list-extra-comments.js'; // Дополнительный блок
import SortView from '../view/sort.js';
import LoadingView from '../view/loading.js';
import ShowMoreButtonView from '../view/show-more-button.js'; // Кнопка показать еще
import UserStatisticsView from '../view/user-statistics.js'; // Статистика пользователя
import {render, RenderPosition, remove, sortByDate, sortByrating} from '../js/utils.js';
import {SortButton, UpdateType, UserAction, Filter} from '../js/const.js';
import MoviePresenter, {State} from './movie.js';

const SHOW_MORE_MOVIES_BUTTON_STEP = 5;

// const ExtraBlocks = [
//   {
//     NAME: 'Top rated',
//     MOVIES: (first, second) => second.rating - first.rating,
//   },
//   {
//     NAME: 'Most commented',
//     MOVIES: (first, second) => second.comments.length - first.comments.length,
//   },
// ];

const mainElement = document.querySelector('.main');

class Board {
  constructor(container, movieModel, filterModel, api) {
    this._boardContainer = container;
    this._movieModel = movieModel;
    this._filterModel = filterModel;
    this._renderedMoviesCount = SHOW_MORE_MOVIES_BUTTON_STEP;
    this._currentSort = SortButton.DEFAULT;
    this._isLoading = true;
    this._api = api;
    this._moviePresenterMap = new Map();
    this._moviePresenterExtraMap = new Map();
    this._moviePresenterExtraCommentsMap = new Map();

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    this._userStatisticsComponent = new UserStatisticsView();
    this._showMoreButtonComponent = null;
    this._sortComponent = null;
    this._noMoviesComponent = new EmptyFilmListView();
    this._extraBlockComponent = new FilmListExtraView();
    this._extraBlockCommentsComponent = new FilmListExtraCommentsView();

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
    const filteredMovies = Filter[this._filterType](movies);

    switch (this._currentSort) {
      case SortButton.BY_DATE:
        return filteredMovies.sort(sortByDate);
      case SortButton.BY_RATING:
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
      case UserAction.UPDATE_MOVIE:
        this._api.updateMovie(updatedData)
          .then((response) => this._movieModel.updateMovie(updateType, response))
          .catch(() => {throw new Error('Ошибка обновления карточки фильма');});
        break;
      case UserAction.ADD_COMMENT:
        if(this._moviePresenterMap.has(updatedData.movieId)) {
          this._moviePresenterMap.get(updatedData.movieId).setViewState(State.ADDING);
        }
        if(this._moviePresenterExtraCommentsMap.has(updatedData.movieId)) {
          this._moviePresenterExtraCommentsMap.get(updatedData.movieId).setViewState(State.ADDING);
        }
        if(this._moviePresenterExtraMap.has(updatedData.movieId)) {
          this._moviePresenterExtraMap.get(updatedData.movieId).setViewState(State.ADDING);
        }
        this._api.addComment(updatedData)
          .then((response) => {
            this._movieModel.addComment(updateType, response);
            if(this._moviePresenterMap.has(newData.movieId)) {
              this._moviePresenterMap.get(newData.movieId).reset();
            }
            if(this._moviePresenterExtraCommentsMap.has(newData.movieId)) {
              this._moviePresenterExtraCommentsMap.get(newData.movieId).reset();
            }
            if(this._moviePresenterExtraMap.has(newData.movieId)) {
              this._moviePresenterExtraMap.get(newData.movieId).reset();
            }
            this._reRenderExtraCommentsBlocks();
          })
          .catch(() => {
            if(this._moviePresenterMap.has(newData.movieId)) {
              this._moviePresenterMap.get(newData.movieId).setViewState(State.ABORTING_ADDING);
            }
            if(this._moviePresenterExtraCommentsMap.has(newData.movieId)) {
              this._moviePresenterExtraCommentsMap.get(newData.movieId).setViewState(State.ABORTING_ADDING);
            }
            if(this._moviePresenterExtraMap.has(newData.movieId)) {
              this._moviePresenterExtraMap.get(newData.movieId).setViewState(State.ABORTING_ADDING);
            }
            throw new Error('Ошибка добавления коментария');
          });
        break;
      case UserAction.DELETE_COMMENT:
        if(this._moviePresenterMap.has(newData.movieId)) {
          this._moviePresenterMap.get(newData.movieId).setViewState(State.DELETING);
        }
        if(this._moviePresenterExtraCommentsMap.has(newData.movieId)) {
          this._moviePresenterExtraCommentsMap.get(newData.movieId).setViewState(State.DELETING);
        }
        if(this._moviePresenterExtraMap.has(newData.movieId)) {
          this._moviePresenterExtraMap.get(newData.movieId).setViewState(State.DELETING);
        }
        this._api.deleteComment(updatedData)
          .then(() => {
            this._movieModel.deleteComment(updateType, updatedData);
            this._reRenderExtraCommentsBlocks();
          })
          .catch(() => {
            if(this._moviePresenterMap.has(newData.movieId)) {
              this._moviePresenterMap.get(newData.movieId).setViewState(State.ABORTING_DELETING);
            }
            if(this._moviePresenterExtraCommentsMap.has(newData.movieId)) {
              this._moviePresenterExtraCommentsMap.get(newData.movieId).setViewState(State.ABORTING_DELETING);
            }
            if(this._moviePresenterExtraMap.has(newData.movieId)) {
              this._moviePresenterExtraMap.get(newData.movieId).setViewState(State.ABORTING_DELETING);
            }
            throw new Error('Ошибка удаления коментария');
          });
        break;
    }
  }

  _checkMap(updatedData) {
    if(this._moviePresenterMap.has(updatedData.id)) {
      this._moviePresenterMap.get(updatedData.id).init(updatedData);
    }
    if(this._moviePresenterExtraCommentsMap.has(updatedData.id)) {
      this._moviePresenterExtraCommentsMap.get(updatedData.id).init(updatedData);
    }
    if(this._moviePresenterExtraMap.has(updatedData.id)) {
      this._moviePresenterExtraMap.get(updatedData.id).init(updatedData);
    }
  }

  _handleModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._checkMap(updatedData);
        // this._moviePresenterMap.get(updatedData.id).init(updatedData);
        break;
      case UpdateType.MINOR: {
        // const isPopupOpened = this._moviePresenterMap.get(updatedData.id).isPopupOpened();
        let isPopupOpened;
        if(this._moviePresenterMap.has(updatedData.id)) {
          isPopupOpened = this._moviePresenterMap.get(updatedData.id).isPopupOpened();
        }
        if(this._moviePresenterExtraCommentsMap.has(updatedData.id)) {
          isPopupOpened = this._moviePresenterExtraCommentsMap.get(updatedData.id).isPopupOpened();
        }
        if(this._moviePresenterExtraMap.has(updatedData.id)) {
          isPopupOpened = this._moviePresenterExtraMap.get(updatedData.id).isPopupOpened();
        }
        this._clearBoard();
        this._renderBoard();

        // let moviePresenter = this._moviePresenterMap.get(updatedData.id);
        let moviePresenter;
        if(this._moviePresenterMap.has(updatedData.id)) {
          moviePresenter = this._moviePresenterMap.get(updatedData.id);
        }
        if(this._moviePresenterExtraCommentsMap.has(updatedData.id)) {
          moviePresenter = this._moviePresenterExtraCommentsMap.get(updatedData.id);
        }
        if(this._moviePresenterExtraMap.has(updatedData.id)) {
          moviePresenter = this._moviePresenterExtraMap.get(updatedData.id);
        }
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
      case UpdateType.MAJOR:
        this._clearBoard({resetRenderedTaskCount: true, resetSortType: true});
        this._renderBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderBoard();
        break;
    }
  }

  _clearBoard({resetRenderedTaskCount = false, resetSortType = false} = {}) {
    const movieCount = this._getMovies().length;

    this._moviePresenterMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterExtraCommentsMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterExtraMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterMap.clear();
    this._moviePresenterExtraCommentsMap.clear();
    this._moviePresenterExtraMap.clear();

    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);
    remove(this._extraBlockComponent);
    remove(this._extraBlockCommentsComponent);

    if(this._noMoviesComponent) {
      remove(this._noMoviesComponent);
    }
    this._renderedMoviesCount = resetRenderedTaskCount ? SHOW_MORE_MOVIES_BUTTON_STEP : Math.min(movieCount, this._renderedMoviesCount);
    if (resetSortType) {
      this._currentSort = SortButton.DEFAULT;
    }
  }

  _renderStatistics() {
    render(mainElement, this._userStatisticsComponent, RenderPosition.BEFOREEND); // Статистика юзера
  }

  _renderExtraBlocks(replace = false) {
    const movieContainer = this._extraBlockComponent.getElement().querySelector('.films-list__container');

    if(replace) {
      this._moviePresenterExtraCommentsMap.forEach((presenter) => presenter.destroy());
    }

    const allMovies = this._movieModel.getMovies();
    const extraBlockMovies = allMovies.slice().sort((first, second) => second.rating - first.rating);
    if(extraBlockMovies.every((movie) => movie.rating === 0)) {
      return;
    }

    render(this._boardComponent, this._extraBlockComponent, RenderPosition.BEFOREEND); // 1 Extra block
    extraBlockMovies.slice(0, 2).forEach((movie) => {
      const moviePresenter = new MoviePresenter(movieContainer, this._handleViewAction, this._handleModechange, this._api);
      moviePresenter.init(movie);
      this._moviePresenterExtraMap.set(movie.id, moviePresenter);
    });
  }

  // _reRenderExtraBlocks() {
  //   this._extraBlockComponent ? remove(this._extraBlockComponent) : '';
  //   this._renderExtraBlocks();
  // }

  _renderExtraCommentsBlocks() {
    const movieContainer = this._extraBlockCommentsComponent.getElement().querySelector('.films-list__container');
    const allMovies = this._movieModel.getMovies();
    const extraBlockMovies = allMovies.slice().sort((first, second) => second.comments.length - first.comments.length);
    if(extraBlockMovies.every((movie) => movie.comments.length === 0)) {
      return;
    }

    render(this._boardComponent, this._extraBlockCommentsComponent, RenderPosition.BEFOREEND); // 2 Extra block
    extraBlockMovies.slice(0, 2).forEach((movie) => {
      const moviePresenter = new MoviePresenter(movieContainer, this._handleViewAction, this._handleModechange, this._api);
      moviePresenter.init(movie);
      this._moviePresenterExtraCommentsMap.set(movie.id, moviePresenter);
    });
  }

  _reRenderExtraCommentsBlocks() {
    this._extraBlockCommentsComponent ? remove(this._extraBlockCommentsComponent) : '';
    this._renderExtraCommentsBlocks();
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
    this._renderExtraBlocks();
    this._renderExtraCommentsBlocks();

    if(moviesCount > this._renderedMoviesCount) {
      this._renderShowMoreButton();
    }
  }
}

export default Board;
