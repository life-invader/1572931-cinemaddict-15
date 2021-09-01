import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels  from 'chartjs-plugin-datalabels';

const BUTTONS = {
  AllTime: 'all-time',
  Today: 'today',
  Week: 'Week',
  Month: 'month',
  Year: 'year',
};

const renderChart = (statisticCtx, data) => {
  const BAR_HEIGHT = 50;

  const watchedMovies = data.filter((movie) => movie.isWatched);
  const genres = [...new Set(watchedMovies.map((movie) => movie.genre))];
  const amount = genres.map((genre) => watchedMovies.filter((movie) => movie.genre === genre).length);

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

const createUserStatisticsTemplate = (data) => {
  const moviesAmount = data.filter((movie) => movie.isWatched === true);
  const movieDuration = moviesAmount.map((movie) => movie.duration);
  let totalDuration;

  if(movieDuration.length > 0) {
    totalDuration = movieDuration.reduce((accumulator, movie) => accumulator + movie);
  }

  const genres = moviesAmount.map((movie) => movie.genre);
  let topGenre;

  //=============================================

  const count = genres.reduce((acc, n) => (acc[n] = (acc[n] || 0) + 1, acc), {});
  // console.log(count)
  const uniqueGenres = Object.entries(count).map((i) => i[0]);
  // console.log(uniqueGenres);
  const amountOfEachGenre = Object.entries(count).map((i) => i[1]);
  // console.log(amountOfEachGenre);
  const maxNumber = Math.max(...Object.entries(count).map((i) => i[1]));
  // console.log(maxNumber);
  let maxNumberIndex;
  if(maxNumber >= 0) {
    maxNumberIndex = amountOfEachGenre.indexOf(maxNumber);
    // console.log(maxNumberIndex)
    topGenre = uniqueGenres[maxNumberIndex];
  }
  // const duplicateCount = Object.values(count).filter((n) => n > 1).length;

  //====================

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">Movie buff</span>
    </p>

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
        <p class="statistic__item-text">${moviesAmount.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${(totalDuration / 60).toFixed()} <span class="statistic__item-description">h</span> ${(totalDuration % 60).toFixed()} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

class UserStatistics extends SmartView {
  constructor(data = []) {
    super();

    this._data = data;
    this._setChart();
  }

  getTemplate() {
    return createUserStatisticsTemplate(this._data);
  }

  // setMenuItem(menuItem) {
  //   const item = this.getElement().querySelector(`[value=${menuItem}]`);

  //   if (item !== null) {
  //     item.checked = true;
  //   }
  // }

  _handleChartButtonsClickHandler() {
    this.getElement().addEventListener('change', (evt) => {
      console.log(evt.target);
    });
  }

  _setChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    this._chart = renderChart(statisticCtx, this._data);
    this._handleChartButtonsClickHandler();
  }
}

export default UserStatistics;
