import SmartView from './smart.js';

const createStatisticsTemplate = (moviesAmount = 0) => `<p>${moviesAmount} movies inside</p>`;

class Statistics extends SmartView {
  constructor(movieModel) {
    super();

    this._movieModel = movieModel;
    this._moviesAmount = null;

    this._getMoviesAmount = this._getMoviesAmount.bind(this);
    this._movieModel.addObserver(this._getMoviesAmount);
  }

  _getMoviesAmount() {
    this._moviesAmount = this._movieModel.getMovies().length;
    this.updateData({});
    this._movieModel.removeObserver(this._getMoviesAmount);
  }

  getTemplate() {
    return createStatisticsTemplate(this._moviesAmount);
  }

  restoreHandlers() {
  // Этот метод не нужен, но тогда ругается Smart компонент!
  }
}

export default Statistics;
