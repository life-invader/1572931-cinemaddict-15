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
const EXTRA_BLOCKS_MOVIES_COUNT = 2;

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
    this._moviePresenterTopRatedMap = new Map();
    this._moviePresenterMostCommentedMap = new Map();

    this._boardComponent = new BoardView();
    this._filmListComponent = new FilmListView();
    this._userStatisticsComponent = new UserStatisticsView();
    this._showMoreButtonComponent = null;
    this._sortComponent = null;
    this._noMoviesComponent = new EmptyFilmListView();
    this._extraTopRatedBlockComponent = new FilmListExtraView();
    this._extraMostCommentedBlock = new FilmListExtraCommentsView();

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

  _handlePresenterMapAction(id, callback) {
    for (const presenterMap of [this._moviePresenterMap, this._moviePresenterTopRatedMap, this._moviePresenterMostCommentedMap]) {
      const presenter = presenterMap.get(id);
      if (presenter) {
        try {
          callback(presenter, presenterMap);
        } catch (err) {
          continue;
        }
      }
    }
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
    this._moviePresenterTopRatedMap.forEach((presenter) => presenter.resetView());
    this._moviePresenterMostCommentedMap.forEach((presenter) => presenter.resetView());
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
    if (this._sortComponent !== null) {
      remove(this._sortComponent);
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSort);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortChange);
    render(this._boardContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderMovieCard(movie, container, presenterMap) {
    const moviePresenter = new MoviePresenter(container, this._handleViewAction, this._handleModechange, this._api);
    moviePresenter.init(movie);
    presenterMap.set(movie.id, moviePresenter);
    return moviePresenter;
  }

  _renderMovieCards(movies) {
    const movieContainer = this._filmListComponent.getElement().querySelector('.films-list__container');
    movies.forEach((movie) => this._renderMovieCard(movie, movieContainer, this._moviePresenterMap));
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
    const newRenderMovieCount = this._renderedMoviesCount + SHOW_MORE_MOVIES_BUTTON_STEP;
    const movies = this._getMovies().slice(this._renderedMoviesCount, newRenderMovieCount);

    this._renderMovieCards(movies);
    this._renderedMoviesCount = newRenderMovieCount;

    if (this._renderedMoviesCount >= movieCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
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
          .catch(() => {
            throw new Error('Ошибка обновления карточки фильма');
          });
        break;
      case UserAction.ADD_COMMENT:
        this._handlePresenterMapAction(updatedData.movieId, (presenter) => presenter.setViewState(State.ADDING));
        this._api.addComment(updatedData)
          .then((response) => {
            this._movieModel.addComment(updateType, response);
            this._handlePresenterMapAction(newData.movieId, (presenter) => presenter.reset());
            this._reRenderExtraCommentsBlocks();
          })
          .catch(() => {
            this._handlePresenterMapAction(newData.movieId, (presenter) => presenter.setViewState(State.ABORTING_ADDING));
            throw new Error('Ошибка добавления коментария');
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._handlePresenterMapAction(newData.movieId, (presenter) => presenter.setViewState(State.DELETING));
        this._api.deleteComment(updatedData)
          .then(() => {
            this._movieModel.deleteComment(updateType, updatedData);
            this._reRenderExtraCommentsBlocks();
          })
          .catch(() => {
            this._handlePresenterMapAction(newData.movieId, (presenter) => presenter.setViewState(State.ABORTING_DELETING));
            throw new Error('Ошибка удаления коментария');
          });
        break;
    }
  }

  _handleModelEvent(updateType, updatedData) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._handlePresenterMapAction(updatedData.id, (presenter) => presenter.init(updatedData));
        break;
      case UpdateType.MINOR: {
        const isPopupOpened = [this._moviePresenterMap, this._moviePresenterMostCommentedMap, this._moviePresenterTopRatedMap]
          .some((presenterMap) => {
            const presenter = presenterMap.get(updatedData.id);
            if (presenter) {
              return presenter.isPopupOpened();
            }
            return false;
          });

        this._clearBoard();
        this._renderBoard();

        let moviePresenter = this._moviePresenterMap.get(updatedData.id);
        if (!moviePresenter) {
          moviePresenter = this._renderMovieCard(updatedData, null, this._moviePresenterMap);
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
    this._moviePresenterMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterMostCommentedMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterTopRatedMap.forEach((presenter) => presenter.destroy());
    this._moviePresenterMap.clear();
    this._moviePresenterMostCommentedMap.clear();
    this._moviePresenterTopRatedMap.clear();

    remove(this._sortComponent);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);
    remove(this._extraTopRatedBlockComponent);
    remove(this._extraMostCommentedBlock);

    if (this._noMoviesComponent) {
      remove(this._noMoviesComponent);
    }
    this._renderedMoviesCount = resetRenderedTaskCount ? SHOW_MORE_MOVIES_BUTTON_STEP : this._renderedMoviesCount;
    if (resetSortType) {
      this._currentSort = SortButton.DEFAULT;
    }
  }

  _renderStatistics() {
    render(mainElement, this._userStatisticsComponent, RenderPosition.BEFOREEND); // Статистика юзера
  }

  _renderTopRatedBlock() {
    const movieContainer = this._extraTopRatedBlockComponent.getElement().querySelector('.films-list__container');

    const allMovies = this._movieModel.getMovies();
    const extraBlockMovies = allMovies.slice().sort((first, second) => second.rating - first.rating);
    if (extraBlockMovies.every((movie) => movie.rating === 0)) {
      return;
    }

    render(this._boardComponent, this._extraTopRatedBlockComponent, RenderPosition.BEFOREEND); // 1 Extra block
    extraBlockMovies.slice(0, EXTRA_BLOCKS_MOVIES_COUNT).forEach((movie) => this._renderMovieCard(movie, movieContainer, this._moviePresenterTopRatedMap));
  }

  _renderMostCommentedBlock() {
    const movieContainer = this._extraMostCommentedBlock.getElement().querySelector('.films-list__container');
    const allMovies = this._movieModel.getMovies();
    const extraBlockMovies = allMovies.slice().sort((first, second) => second.comments.length - first.comments.length);
    if (extraBlockMovies.every((movie) => movie.comments.length === 0)) {
      return;
    }

    render(this._boardComponent, this._extraMostCommentedBlock, RenderPosition.BEFOREEND); // 2 Extra block
    extraBlockMovies.slice(0, EXTRA_BLOCKS_MOVIES_COUNT).forEach((movie) => this._renderMovieCard(movie, movieContainer, this._moviePresenterTopRatedMap));
  }

  _reRenderExtraCommentsBlocks() {
    this._extraMostCommentedBlock ? remove(this._extraMostCommentedBlock) : '';
    this._renderMostCommentedBlock();
  }

  _renderBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const movies = this._getMovies();
    const moviesCount = movies.length;

    if (moviesCount === 0) {
      this._renderNoMovies();
      return;
    }

    this._renderSort();
    render(this._boardContainer, this._boardComponent, RenderPosition.BEFOREEND);
    render(this._boardComponent, this._filmListComponent, RenderPosition.BEFOREEND);

    this._renderMovieCards(movies.slice(0, this._renderedMoviesCount));
    this._renderTopRatedBlock();
    this._renderMostCommentedBlock();

    if (moviesCount > this._renderedMoviesCount) {
      this._renderShowMoreButton();
    }
  }
}

export default Board;
