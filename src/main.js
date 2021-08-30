// import MenuTemplateView from './view/menu.js';
import UserProfileView from './view/user-profile.js';
import StatisticsView from './view/statistics.js';
// import UserStatisticsView from './view/user-statistics.js';
import {render, RenderPosition} from './js/utils.js';
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

menuFilterPresenter.init();
// render(mainElement, new UserStatisticsView(), RenderPosition.BEFOREEND); // Статистика юзера
boardPresenter.init();

// ===================================================================
// const handleSiteMenuClick = (menuItem) => {
//   switch (menuItem) {
//     case MenuItem.ADD_NEW_TASK:
//       // Скрыть статистику
//       // Показать доску
//       // Показать форму добавления новой задачи
//       // Убрать выделение с ADD NEW TASK после сохранения
//       break;
//     case MenuItem.TASKS:
//       // Показать доску
//       // Скрыть статистику
//       break;
//     case MenuItem.STATISTICS:
//       // Скрыть доску
//       // Показать статистику
//       break;
//   }
// };

// siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
// ===================================================================
