import MovieCardView from '../view/movie-card.js'; // Карточка фильма
import MovieDetailsView from '../view/film-details.js'; // Показ подробной информации о фильме
import {render, RenderPosition, remove, replace, USER_ACTION, UPDATE_TYPE} from '../js/utils.js';

import {nanoid} from 'nanoid';
import {getRandomArrayProperty, COMMENT_AUTHOR, generateCommentDate} from '../mock/movie.js';

class Movie {
  constructor(movieListContainer, updateData, changeMode) {
    this._movieListContainer = movieListContainer;
    this._updateData = updateData;
    this._changeMode = changeMode;

    this._movieComponent = null;
    this._movieDetailsComponent = null;

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
    this._movieDetailsComponent = new MovieDetailsView(movie);

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
      render(this._movieListContainer, this._movieComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._movieListContainer.contains(prevMovieComponent.getElement())) {
      replace(this._movieComponent, prevMovieComponent);
    }

    if(this._movieDetailsContainer.contains(prevMovieDetailsComponent.getElement())) {
      replace(this._movieDetailsComponent, prevMovieDetailsComponent);
    }

    // Зачем это нужно, хз. Взял из демо проекта. И без этой строки все работает
    // remove(prevMovieComponent);
  }

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
  }

  _handleOpenMovieDetails() {
    this._changeMode();

    document.body.classList.add('hide-overflow');
    this._renderMovieDetails();
  }

  _handleFavouriteButtonClick() {
    // this._updateData(Object.assign({}, this._movie, {isFavourite: !this._movie.isFavourite}));
    this._updateData(USER_ACTION.UPDATE_MOVIE, Object.assign({}, this._movie, {isFavourite: !this._movie.isFavourite}), UPDATE_TYPE.PATCH);
  }

  _handleAddToWatchlistButtonClick() {
    // this._updateData(Object.assign({}, this._movie, {isInWatchList: !this._movie.isInWatchList}));
    this._updateData(USER_ACTION.UPDATE_MOVIE, Object.assign({}, this._movie, {isInWatchList: !this._movie.isInWatchList}), UPDATE_TYPE.PATCH);
  }

  _handleMarkAsWatchedButtonClick() {
    // this._updateData(Object.assign({}, this._movie, {isWatched: !this._movie.isWatched}));
    this._updateData(USER_ACTION.UPDATE_MOVIE, Object.assign({}, this._movie, {isWatched: !this._movie.isWatched}), UPDATE_TYPE.PATCH);
  }

  //====================================================================================================================
  _handleCommentDeleteClick(commentId) {
    const index = this._movie.comments.findIndex((comment) => comment.id === commentId);
    const commentObj = this._movie.comments.find((comment) => comment.id === commentId);
    this._movie.comments = [...this._movie.comments.slice(0, index), ...this._movie.comments.slice(index + 1)];
    console.log(this._movie.comments);


    this._updateData(USER_ACTION.DELETE_COMMENT, this._movie, UPDATE_TYPE.PATCH);
  }

  _handleAddNewComment(text, emotion) {
    const obj = {
      id: nanoid(),
      text: text,
      emotion: emotion,
      author: getRandomArrayProperty(COMMENT_AUTHOR),
      date: generateCommentDate(),
    };

    this._movie.comments.push(obj);

    console.log(obj);
    this._updateData(USER_ACTION.ADD_COMMENT, this._movie, UPDATE_TYPE.PATCH);
  }

//====================================================================================================================
}

export default Movie;
