import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels  from 'chartjs-plugin-datalabels';

import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import duration from 'dayjs/plugin/duration';
dayjs.extend(objectSupport);
dayjs.extend(duration);

const BUTTONS = {
  AllTime: 'all-time',
  Today: 'today',
  Week: 'week',
  Month: 'month',
  Year: 'year',
};

const renderChart = (statisticCtx, data) => {
  const BAR_HEIGHT = 50;

  const watchedMovies = data.filter((movie) => movie.isWatched);
  const genres = [...new Set(watchedMovies.map((movie) => movie['details'].genres[0]))];
  const amount = genres.map((genre) => watchedMovies.filter((movie) => movie['details'].genres[0] === genre).length);

  // Обязательно рассчитайте высоту canvas, она зависит от количества элементов диаграммы
  statisticCtx.height = BAR_HEIGHT * genres.length;

  const myChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: genres,
      datasets: [{
        data: amount,
        backgroundColor: '#ffe800',
        hoverBackgroundColor: '#ffe800',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#ffffff',
            padding: 100,
            fontSize: 20,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 24,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return myChart;
};

const createUserStatisticsTemplate = (data, watchedMoviesTotal) => {

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

  // const movieDuration = data.map((movie) => movie.duration);
  // let totalDuration;

  // if(movieDuration.length > 0) {
  //   totalDuration = movieDuration.reduce((accumulator, movie) => accumulator + movie);
  // }

  // const genres = data.map((movie) => movie['details'].genres[0]);
  // let topGenre;

  // //=============================================

  // const count = genres.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {});
  // // console.log(count)
  // const uniqueGenres = Object.entries(count).map((i) => i[0]); // Object.keys()
  // // console.log(uniqueGenres);
  // const amountOfEachGenre = Object.entries(count).map((i) => i[1]); // Object.values()
  // // console.log(amountOfEachGenre);
  // const maxNumber = Math.max(...Object.entries(count).map((i) => i[1]));
  // // console.log(maxNumber);
  // let maxNumberIndex;
  // if(maxNumber >= 0) {
  //   maxNumberIndex = amountOfEachGenre.indexOf(maxNumber);
  //   // console.log(maxNumberIndex)
  //   topGenre = uniqueGenres[maxNumberIndex];
  // }
  // const duplicateCount = Object.values(count).filter((n) => n > 1).length;

  //====================

  const getTotalRuntime = (totalMinutesAmount) => {
    const referenceDate = dayjs().startOf('day');
    const date = referenceDate.add(totalMinutesAmount, 'minute');
    const hours = date.diff(referenceDate, 'hour');
    const minutes = date.subtract(hours, 'hour').diff(referenceDate, 'minute');
    return { hours, minutes };
  };

  const getTopGenre = ({ genress }) => genress.length ? genress[0] : null;

  const getGenresStatistics = (watchedFilms) => {
    const genresStatistics = new Map();

    watchedFilms.forEach(({ details }) => {
      details.genres.forEach((genre) => {
        const countt = genresStatistics.has(genre) ? genresStatistics.get(genre) : 0;
        genresStatistics.set(genre, countt + 1);
      });
    });

    const genress = [];
    const counts = [];

    Array.from(genresStatistics.entries())
      .sort(([, countA], [, countB]) => countB - countA)
      .forEach(([genre, countt]) => {
        genress.push(genre);
        counts.push(countt);
      });

    return genress.length ? { genress, counts } : null;
  };

  // console.log(getGenresStatistics(data));

  const getWatchedStatisticsData = (watchedFilms) => {
    const totalMinutesDuration = watchedFilms.reduce((duration1, film) => duration1 += film.duration, 0);
    const genresStatistic = getGenresStatistics(watchedFilms);

    return {
      totalAmount: watchedFilms.length,
      genresStatistic: genresStatistic,
      totalDuration: getTotalRuntime(totalMinutesDuration),
      topGenre: genresStatistic && getTopGenre(genresStatistic),
    };
  };

  const statisticsData = getWatchedStatisticsData(data);
  // console.log(getWatchedStatisticsData(data));

  //====================

  return `<section class="statistic">
  ${getUserRank(watchedMoviesTotal) ?
    `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${getUserRank(watchedMoviesTotal)}</span>
    </p>` : ''}

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${data.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${statisticsData.totalDuration ? statisticsData.totalDuration.hours : 0} <span class="statistic__item-description">h</span> ${statisticsData.totalDuration ? statisticsData.totalDuration.minutes : 0} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        ${statisticsData.topGenre ? `<h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${statisticsData.topGenre}</p>` : ''}
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

// ${totalDuration && totalDuration.hours || 0} // ${totalDuration && totalDuration.minutes || 0}
class UserStatistics extends SmartView {
  constructor(data = []) {
    super();

    this._movies = data.filter((movie) => movie.isWatched);
    this._sortedMovies = this._movies;
    this._setChartButtonsClickHandler();
    this._setChart();
  }

  getTemplate() {
    return createUserStatisticsTemplate(this._sortedMovies, this._movies.length);
  }

  restoreHandlers() {
    this._setChartButtonsClickHandler();
  }

  _getMovies(button) {
    switch (button) {
      case BUTTONS.Today:
        this._sortedMovies = this._movies.filter((movie) => dayjs().diff(movie['watching_date'], 'hours') < 24);
        break;
      case BUTTONS.Week:
        this._sortedMovies = this._movies.filter((movie) => dayjs().diff(movie['watching_date'], 'day') < 7);
        break;
      case BUTTONS.Month:
        this._sortedMovies = this._movies.filter((movie) => dayjs().diff(movie['watching_date'], 'day') < 30);
        break;
      case BUTTONS.Year:
        this._sortedMovies = this._movies.filter((movie) => dayjs().diff(movie['watching_date'], 'month') < 12);
        break;
      case BUTTONS.AllTime:
        this._sortedMovies = this._movies;
        break;
    }
  }

  _setChartButtonsClickHandler() {
    this.getElement().addEventListener('change', (evt) => {
      this._getMovies(evt.target.value);
      this.updateData({buttonId: `#${evt.target.id}`});
      this.getElement().querySelector(this._data.buttonId).checked = true;
      this._setChart();
    });
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._sortedMovies);
  }
}

export default UserStatistics;
