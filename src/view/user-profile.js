import SmartView from './smart.js';

const getUserRank = (watchedMoviesAmount) => {
  let userRank;
  switch (true) {
    case watchedMoviesAmount > 21:
      userRank = 'Movie buff';
      break;
    case watchedMoviesAmount > 11:
      userRank = 'Fan';
      break;
    case watchedMoviesAmount > 1:
      userRank = 'Novice';
      break;
    default:
      userRank = null;
      break;
  }
  return userRank;
};

const createUserProfileTemplate = (moviesAmount) => {
  if(!getUserRank(moviesAmount)) {
    return;
  }

  return `<section class="header__profile profile">
    <p class="profile__rating">${getUserRank(moviesAmount)}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

class UserProfile extends SmartView {
  constructor(movieModel) {
    super();

    this._movieModel = movieModel;
    this._moviesAmount = null;

    this._getMoviesAmount = this._getMoviesAmount.bind(this);
    this._movieModel.addObserver(this._getMoviesAmount);
  }

  getTemplate() {
    return createUserProfileTemplate(this._moviesAmount);
  }

  _getMoviesAmount() {
    this._moviesAmount = this._movieModel.getMovies().filter((movie) => movie.isWatched).length;
    this.updateData({});
  }

  restoreHandlers() {
    // Этот метод не нужен, но тогда ругается Smart компонент!
  }
}

export default UserProfile;
