import MovieCardView from '../view/movie-card.js'; // Карточка фильма
import MovieDetailsView from '../view/film-details.js'; // Показ подробной информации о фильме
import {render, RenderPosition, remove, replace, USER_ACTION, UPDATE_TYPE} from '../js/utils.js';

import {nanoid} from 'nanoid';
import {getRandomArrayProperty, COMMENT_AUTHOR, generateCommentDate} from '../mock/movie.js';

class Movie {
  constructor(movieListContainer, updateData, changeMode, api) {
    this._movieListContainer = movieListContainer;
    this._updateData = updateData;
    this._changeMode = changeMode;
    this._api = api;

    this._movieComponent = null;
    this._movieDetailsComponent = null;
    this._comments = null;

    this._handleOpenMovieDetails = this._handleOpenMovieDetails.bind(this);
    this._handleCloseMovieDetailsPopup = this._handleCloseMovieDetailsPopup.bind(this);
    this._onEscKeyDown = this._onEscKeyDown.bind(this);
    this._handleFavouriteButtonClick = this._handleFavouriteButtonClick.bind(this);
    this._handleAddToWatchlistButtonClick = this._handleAddToWatchlistButtonClick.bind(this);
    this._handleMarkAsWatchedButtonClick = this._handleMarkAsWatchedButtonClick.bind(this);
    this._handleCommentDeleteClick = this._handleCommentDeleteClick.bind(this);
    this._handleAddNewComment = this._handleAddNewComment.bind(this);
  }

  init(movie) {
    this._movie = movie;
    this._movieDetailsContainer = document.querySelector('.footer');

    const prevMovieComponent = this._movieComponent;
    const prevMovieDetailsComponent = this._movieDetailsComponent;

    this._movieComponent = new MovieCardView(movie);
    this._movieDetailsComponent = new MovieDetailsView(movie, this._comments, prevMovieDetailsComponent && prevMovieDetailsComponent.data || {});

    this._movieComponent.setMovieCardClick(this._handleOpenMovieDetails);
    this._movieDetailsComponent.setCloseMovieDetailsPopup(this._handleCloseMovieDetailsPopup);

    this._movieComponent.setFavouriteButtonClick(this._handleFavouriteButtonClick);
    this._movieComponent.setAddToWatchlistButtonClick(this._handleAddToWatchlistButtonClick);
    this._movieComponent.setMarkAsWatchedButtonClick(this._handleMarkAsWatchedButtonClick);

    this._movieDetailsComponent.setFavouriteDetailsButtonClick(this._handleFavouriteButtonClick);
    this._movieDetailsComponent.setAddToWatchlistDetailsButtonClick(this._handleAddToWatchlistButtonClick);
    this._movieDetailsComponent.setMarkAsWatchedDetailsButtonClick(this._handleMarkAsWatchedButtonClick);
    this._movieDetailsComponent.setDeleteCommentClickHandler(this._handleCommentDeleteClick);
    this._movieDetailsComponent.setAddNewCommentHandler(this._handleAddNewComment);

    if (prevMovieComponent === null || prevMovieDetailsComponent === null) {
      if (this._movieListContainer) {
        render(this._movieListContainer, this._movieComponent, RenderPosition.BEFOREEND);
      }
      return;
    }

    if (this._movieListContainer && this._movieListContainer.contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }

    if(this._movieDetailsContainer.contains(prevMovieDetailsComponent.getElement())) {
      replace(this._movieDetailsComponent, prevMovieDetailsComponent);
      if(this.isPopupOpened) {
        this._api.getComments(this._movie.id)
          .then((comments) => {
            this._comments = comments;
            this._movieDetailsComponent.setComments(comments);
          });
      }
      this._movieDetailsComponent.getElement().scrollTop = this._movieDetailsComponent.data.scrollTop; // Не работает, не скролит до нужного места
    }

    // Зачем это нужно, хз. Взял из демо проекта. И без этой строки все работает
    // remove(prevMovieComponent);
  }

  // ====================================================================================

  isPopupOpened() {
    return this._movieDetailsContainer.contains(this._movieDetailsComponent.getElement());
  }

  openPopup() {
    this._handleOpenMovieDetails();
  }

  // ====================================================================================

  destroy() {
    remove(this._movieComponent);
    remove(this._movieDetailsComponent);
  }

  resetView() {
    this._handleCloseMovieDetailsPopup();
  }

  _onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      if (evt.target.tagName === 'INPUT' || evt.target.tagName === 'TEXTAREA') {
        evt.stopPropagation();
        return;
      }
      this._movieDetailsComponent.reset(this._movie);
      this._handleCloseMovieDetailsPopup();
    }
  }

  _handleCloseMovieDetailsPopup() {
    document.body.classList.remove('hide-overflow');
    this._movieDetailsComponent.getElement().remove();
    document.removeEventListener('keydown', this._onEscKeyDown);
  }

  _renderMovieDetails() {
    document.addEventListener('keydown', this._onEscKeyDown);
    render(this._movieDetailsContainer, this._movieDetailsComponent, RenderPosition.BEFOREEND);
    this._api.getComments(this._movie.id)
      .then((comments) => {
        this._comments = comments;
        this._movieDetailsComponent.setComments(comments);
      });
  }

  _handleOpenMovieDetails() {
    this._changeMode();

    document.body.classList.add('hide-overflow');
    this._renderMovieDetails();
  }

  _handleFavouriteButtonClick() {
    this._updateData(USER_ACTION.UPDATE_MOVIE, Object.assign({}, this._movie, {isFavourite: !this._movie.isFavourite}), UPDATE_TYPE.MINOR);
  }

  _handleAddToWatchlistButtonClick() {
    this._updateData(USER_ACTION.UPDATE_MOVIE, Object.assign({}, this._movie, {isInWatchList: !this._movie.isInWatchList}), UPDATE_TYPE.MINOR);
  }

  _handleMarkAsWatchedButtonClick() {
    this._updateData(USER_ACTION.UPDATE_MOVIE, Object.assign({}, this._movie, {isWatched: !this._movie.isWatched}), UPDATE_TYPE.MINOR);
  }

  _handleCommentDeleteClick(commentId) {
    const index = this._movie.comments.findIndex((comment) => comment.id === commentId);
    this._movie.comments = [...this._movie.comments.slice(0, index), ...this._movie.comments.slice(index + 1)];

    this._updateData(USER_ACTION.DELETE_COMMENT, this._movie, UPDATE_TYPE.PATCH);
  }

  _handleAddNewComment(text, emotion) {
    const newComment = {
      comment: text,
      emotion: emotion,
      movieId: this._movie.id,
    };

    this._updateData(USER_ACTION.ADD_COMMENT, newComment, UPDATE_TYPE.PATCH);
    this._movieDetailsComponent.reset(this._movie);
  }

}

export default Movie;
