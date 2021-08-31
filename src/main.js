// import MenuTemplateView from './view/menu.js';
import UserProfileView from './view/user-profile.js';
import StatisticsView from './view/statistics.js';
import UserStatisticsView from './view/user-statistics.js';
import {render, RenderPosition, remove} from './js/utils.js';
import BoardPresenter from './presenter/board.js';
import MenuFilterPresenter from './presenter/menu.js';
import {generateMovie} from './mock/movie.js';
import MovieModel from './model/movie.js';
import MenuFilterModel from './model/menu-filter.js';

const moviesMock = new Array(25).fill(null).map(generateMovie);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const menuFilterModel = new MenuFilterModel();
const movieModel = new MovieModel();
movieModel.setMovies(moviesMock);
const boardPresenter = new BoardPresenter(mainElement, movieModel, menuFilterModel);
const menuFilterPresenter = new MenuFilterPresenter(mainElement, movieModel, menuFilterModel);


render(headerElement, new UserProfileView(), RenderPosition.BEFOREEND); // Профиль юзера
render(footerElement, new StatisticsView(), RenderPosition.BEFOREEND); // Статистика с кол-вом фильмов в футере

menuFilterPresenter.init(handleUserStatisticsClick);
// render(mainElement, new UserStatisticsView(), RenderPosition.BEFOREEND); // Статистика юзера
boardPresenter.init();

// ===================================================================
const MenuItem = {
  STATISTICS: 'statistics',
};

let userStatisticsComponent = null;

function handleUserStatisticsClick(menuItem = 'statistics') {
  if(menuItem !== MenuItem.STATISTICS) {
    remove(userStatisticsComponent);
    return;
  }

  boardPresenter.destroy();
  userStatisticsComponent = new UserStatisticsView(movieModel.getMovies());
  render(mainElement, userStatisticsComponent, RenderPosition.BEFOREEND); // Статистика юзера
}

// ===================================================================
