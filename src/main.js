import UserProfileView from './view/user-profile.js';
import StatisticsView from './view/statistics.js';
import UserStatisticsView from './view/user-statistics.js';
import {render, RenderPosition, remove} from './js/utils.js';
import {UpdateType} from './js/const.js';
import BoardPresenter from './presenter/board.js';
import MenuFilterPresenter from './presenter/menu.js';
import MovieModel from './model/movie.js';
import MenuFilterModel from './model/menu-filter.js';
import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';
// import {isOnline} from './js/utils.js';
// import {toast} from './js/toast.js';

const AUTHORIZATION = 'Basic kgji4783jcfigdf';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaaddict-localstorage';
const STORE_VER = 'v1';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const menuFilterModel = new MenuFilterModel();
const movieModel = new MovieModel();
const boardPresenter = new BoardPresenter(mainElement, movieModel, menuFilterModel, apiWithProvider);
const menuFilterPresenter = new MenuFilterPresenter(mainElement, movieModel, menuFilterModel);


render(headerElement, new UserProfileView(movieModel), RenderPosition.BEFOREEND); // Профиль юзера
render(footerElement, new StatisticsView(movieModel), RenderPosition.BEFOREEND); // Статистика с кол-вом фильмов в футере

const MenuItem = {
  STATISTIC: 'statistics',
};

let userStatisticsComponent = null;

const handleUserStatisticsClick = (menuItem = 'statistics') => {
  if(menuItem !== MenuItem.STATISTIC) {
    remove(userStatisticsComponent);
    return;
  }

  boardPresenter.destroy();
  userStatisticsComponent = new UserStatisticsView(movieModel.getMovies());
  render(mainElement, userStatisticsComponent, RenderPosition.BEFOREEND); // Статистика юзера
};

menuFilterPresenter.init(handleUserStatisticsClick);
boardPresenter.init();

apiWithProvider.getMovies()
  .then((movies) => {
    movieModel.setMovies(UpdateType.INIT, movies);
  })
  .catch(() => {
    movieModel.setMovies(UpdateType.INIT, []);
    throw new Error('Ошибка');
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
