import SmartView from './smart.js';
import he from 'he';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

const SHAKE_ANIMATION_TIMEOUT = 600;

const createFilmDetailsTemplate = (movie, data, comments) => {
  const {name, rating, duration, description, poster, isInWatchList, isWatched, isFavourite, details, ageRating} = movie;
  const {isEmoji = false, newCommentEmojiPath = null, emoji, isAdding, isDeleting, deletingCommentId} = data;

  const formatMovieReleaseDate = (movieReleaseDate) => dayjs(movieReleaseDate).format('DD MMMM YYYY');
  const formatDuration = (movieDuration) => dayjs().startOf('day').add(movieDuration, 'minute').format('H[h] mm[m]');
  const renderDetailsGenre = (genres) => genres.map((genre) => `<span class="film-details__genre">${genre}</span>`).join('');
  const formatCommentDate = (date) => dayjs(date).fromNow();

  // const

  const renderDetailsComment = (commentsList) => commentsList.map((comment) =>
    (`<li class="film-details__comment" id='${comment.id}'>
        <span class="film-details__comment-emoji">
          <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-smile">
        </span>
        <div>
          <p class="film-details__comment-text">${comment.comment}</p>
          <p class="film-details__comment-info">
            <span class="film-details__comment-author">${comment.author}</span>
            <span class="film-details__comment-day">${formatCommentDate(comment.date)}</span>
            <button class="film-details__comment-delete" ${isDeleting ? 'disabled' : ''}>${isDeleting && deletingCommentId === comment.id ? 'Deleting...' : 'Delete'}</button>
          </p>
        </div>
      </li>`)).join('');

  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">

                    <p class="film-details__age">${ageRating}+</p>
                  </div>

                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${name}</h3>
                        <p class="film-details__title-original">Original: ${name}</p>
                      </div>

                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${rating}</p>
                      </div>
                    </div>

                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${details.director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${details.writers.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${details.actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${formatMovieReleaseDate(details.releaseDate)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${formatDuration(duration)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${details.country}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${details.genres.length > 1 ? 'Genres' : 'Genre'}</td>
                        <td class="film-details__cell">${renderDetailsGenre(details.genres)}</td>
                      </tr>
                    </table>

                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>

                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button film-details__control-button--watchlist ${isInWatchList ? 'film-details__control-button--active' : ''}" id="watchlist" name="watchlist">${isInWatchList ? 'In watchlist' : 'Add to watchlist'}</button>
                  <button type="button" class="film-details__control-button film-details__control-button--watched ${isWatched ? 'film-details__control-button--active' : ''}" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button film-details__control-button--favorite ${isFavourite ? 'film-details__control-button--active' : ''}" id="favorite" name="favorite">${isFavourite ? 'In favourites' : 'Add to favourites'}</button>
                </section>
              </div>

              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments ? comments.length : 0}</span></h3>

                  <ul class="film-details__comments-list">

                    ${comments ? renderDetailsComment(comments) : ''}

                  </ul>

                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">${isEmoji ? `<img src=${newCommentEmojiPath} width="55" height="55" alt="emoji-smile">` : ''}</div>

                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isAdding ? 'disabled' : ''}></textarea>
                    </label>

                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${isAdding ? 'disabled' : ''} id="emoji-smile" value="smile ${emoji === 'smile' ? 'checked' : ''}">
                      <label class="film-details__emoji-label" for="emoji-smile">
                        <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${isAdding ? 'disabled' : ''} id="emoji-sleeping" value="sleeping" ${emoji === 'sleeping' ? 'checked' : ''}>
                      <label class="film-details__emoji-label" for="emoji-sleeping">
                        <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${isAdding ? 'disabled' : ''} id="emoji-puke" value="puke" ${emoji === 'puke' ? 'checked' : ''}>
                      <label class="film-details__emoji-label" for="emoji-puke">
                        <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                      </label>

                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" ${isAdding ? 'disabled' : ''} id="emoji-angry" value="angry" ${emoji === 'angry' ? 'checked' : ''}>
                      <label class="film-details__emoji-label" for="emoji-angry">
                        <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                      </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

class MovieDetails extends SmartView {
  constructor(movie, comments, data) {
    super();
    this._movie = movie;
    this._comments = comments;

    this._setCloseMovieDetailsPopup = this._setCloseMovieDetailsPopup.bind(this);
    this._favouriteDetailsButtonClick = this._favouriteDetailsButtonClick.bind(this);
    this._addToWatchlistDetailsButtonClick = this._addToWatchlistDetailsButtonClick.bind(this);
    this._markAsWatchedDetailsButtonClick = this._markAsWatchedDetailsButtonClick.bind(this);
    this._toggleCommentEmojiHandler = this._toggleCommentEmojiHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);
    this._commentDeleteClickHandler = this._commentDeleteClickHandler.bind(this);
    this._addNewCommentHandler = this._addNewCommentHandler.bind(this);

    this._setInnerHandlers();

    this.updateData(data || {});

    if(this._data.commentMessage) {
      this.getElement().querySelector('.film-details__comment-input').value = this._data.commentMessage;
    }
  }

  shake(callback) {
    this.getElement().style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  shakeComment(callback) {
    const deletingCommentId = this._data.deletingCommentId;
    const selector = `li[id='${deletingCommentId}']`;
    this.getElement().querySelector(selector).style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.getElement().style.animation = '';
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }

  getTemplate() {
    return createFilmDetailsTemplate(this._movie, this._data, this._comments);
  }

  setComments(comments) {
    this._comments = comments.slice();
    this.updateData({});
  }

  reset(movie) {
    this._movie = movie;
    this.updateData({newCommentEmojiPath: null, isEmoji: false, commentMessage: null, emoji: null});
  }

  _toggleCommentEmojiHandler(evt) {
    if(this._data.newCommentEmojiPath === evt.target.src) {
      return;
    }

    const id = `#${evt.currentTarget.getAttribute('for')}`;
    const emoji = this.getElement().querySelector(id).value;

    this.updateData({newCommentEmojiPath: evt.target.src, isEmoji: true, emoji: emoji, scrollTop: this.getElement().scrollTop});
    this.getElement().scrollTop = this._data.scrollTop;
    this.getElement().querySelector(id).setAttribute('checked','checked');

    if(!this._data.commentMessage) {
      return;
    }

    this.getElement().querySelector('.film-details__comment-input').value = this._data.commentMessage;
  }

  _commentInputHandler(evt) {
    this.updateData({commentMessage: evt.target.value}, true);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setCloseMovieDetailsPopup(this._callback.setCloseMovieDetailsPopup);
    this.setFavouriteDetailsButtonClick(this._callback.favouriteDetailsButtonClick);
    this.setAddToWatchlistDetailsButtonClick(this._callback.addToWatchlistDetailsButtonClick);
    this.setMarkAsWatchedDetailsButtonClick(this._callback.markAsWatchedDetailsButtonClick);
  }

  _setInnerHandlers() {
    this.getElement().querySelectorAll('.film-details__emoji-label').forEach((emoji) => emoji.addEventListener('click', this._toggleCommentEmojiHandler));
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._commentInputHandler);
    if(this._movie.comments.length > 0) {
      this.getElement().querySelectorAll('.film-details__comment').forEach((element) => element.addEventListener('click', this._commentDeleteClickHandler));
    }
    this.getElement().querySelector('.film-details__new-comment').addEventListener('keydown', this._addNewCommentHandler);
  }

  _setCloseMovieDetailsPopup(evt) {
    evt.preventDefault();
    this._callback.setCloseMovieDetailsPopup();
  }

  setCloseMovieDetailsPopup(callback) {
    this._callback.setCloseMovieDetailsPopup = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._setCloseMovieDetailsPopup);
  }

  _favouriteDetailsButtonClick() {
    this._callback.favouriteDetailsButtonClick();
  }

  _addToWatchlistDetailsButtonClick() {
    this._callback.addToWatchlistDetailsButtonClick();
  }

  _markAsWatchedDetailsButtonClick() {
    this._callback.markAsWatchedDetailsButtonClick();
  }

  setFavouriteDetailsButtonClick(callback) {
    this._callback.favouriteDetailsButtonClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favouriteDetailsButtonClick);
  }

  setAddToWatchlistDetailsButtonClick(callback) {
    this._callback.addToWatchlistDetailsButtonClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._addToWatchlistDetailsButtonClick);
  }

  setMarkAsWatchedDetailsButtonClick(callback) {
    this._callback.markAsWatchedDetailsButtonClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._markAsWatchedDetailsButtonClick);
  }

  _commentDeleteClickHandler(evt) {
    if(evt.target.tagName !== 'BUTTON') {
      return;
    }

    evt.preventDefault();
    this.updateData({scrollTop: this.getElement().scrollTop, deletingCommentId: evt.currentTarget.id});
    this._callback.deleteComment(evt.currentTarget.id);
  }

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteComment = callback;
    if(this._movie.comments.length > 0) {
      this.getElement().querySelectorAll('.film-details__comment').forEach((element) => element.addEventListener('click', this._commentDeleteClickHandler));
    }
  }

  _addNewCommentHandler(evt) {
    if(evt.key === 'Enter' && evt.ctrlKey) {
      if(this._data.emoji && this._data.commentMessage) {
        this.updateData({scrollTop: this.getElement().scrollTop}, true);
        this._callback.addNewComment(he.encode(this._data.commentMessage), this._data.emoji);
      } else {
        const commentInput =  this.getElement().querySelector('.film-details__comment-input');
        commentInput.setCustomValidity('Выберите эмоцию и напишите текст комментария!');
        commentInput.reportValidity();
      }
    }

  }

  setAddNewCommentHandler(callback) {
    this._callback.addNewComment = callback;
    this.getElement().querySelector('.film-details__new-comment').addEventListener('keydown', this._addNewCommentHandler);
  }

  // ==================================================================================================================================================================================
}

export default MovieDetails;
