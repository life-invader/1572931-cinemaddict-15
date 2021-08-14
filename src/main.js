import MenuTemplateView from './view/menu.js';
import UserProfileView from './view/user-profile.js';
import SortView from './view/sort.js';
import StatisticsView from './view/statistics.js';
import {render, RenderPosition} from './js/utils.js';
import BoardPresenter from './presenter/board.js';

// ===========================================================

import {generateMovie} from './mock/movie.js';
// Изначальный массив фильмов
const moviesMock = new Array(25).fill(null).map(generateMovie);

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const boardPresenter = new BoardPresenter(mainElement);

render(headerElement, new UserProfileView(), RenderPosition.BEFOREEND); // Профиль юзера
render(mainElement, new MenuTemplateView(moviesMock), RenderPosition.AFTERBEGIN); // Меню, кнопки избранное и т.п.
render(mainElement, new SortView(), RenderPosition.BEFOREEND); // Кнопки сортировки
render(footerElement, new StatisticsView(), RenderPosition.BEFOREEND); // Статистика с кол-вом фильмов

boardPresenter.init(moviesMock);

/*
// СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА
// Сортировка по дате
const renderByDate = (evt) => {
  evt.preventDefault();
  const sortItems = document.querySelectorAll('.sort__button');

  sortItems.forEach((button) => {
    button.classList.remove('sort__button--active');
  });

  evt.target.classList.add('sort__button--active');
  moviesMockCopy.sort((a, b) => Number(b.details.releaseDate.format('YYYY')) - Number(a.details.releaseDate.format('YYYY')));

  const length = filmsListContainer.children.length;

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMockCopy.slice(0, length)) {
    renderMovieCards(filmsListContainer, value);
  }
};

const sortByDateButton = document.querySelector('.sort__button-date');
sortByDateButton.addEventListener('click', renderByDate);

// Сортировка по рейтингу
const renderByRating = (evt) => {
  evt.preventDefault();
  const sortItems = document.querySelectorAll('.sort__button');

  sortItems.forEach((button) => {
    button.classList.remove('sort__button--active');
  });
  evt.target.classList.add('sort__button--active');
  moviesMockCopy.sort((a, b) => b.rating - a.rating);

  const length = filmsListContainer.children.length;

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMockCopy.slice(0, length)) {
    renderMovieCards(filmsListContainer, value);
  }
};

const sortByRatingButton = document.querySelector('.sort__button-rating');
sortByRatingButton.addEventListener('click', renderByRating);


// Сортировка по дефолту
const renderDefaultInner = (evt) => {
  evt.preventDefault();
  const sortItems = document.querySelectorAll('.sort__button');

  sortItems.forEach((button) => {
    button.classList.remove('sort__button--active');
  });
  evt.target.classList.add('sort__button--active');

  const length = filmsListContainer.children.length;

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  moviesMockCopy = moviesMock.slice();

  for (const value of moviesMock.slice(0, length)) {
    renderMovieCards(filmsListContainer, value);
  }
};

const sortDefaultButton = document.querySelector('.sort__button-default');
sortDefaultButton.addEventListener('click', renderDefaultInner);

// ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ ФИЛЬТРЫ
const allMoviesButton = document.querySelector('.main-navigation__item-all');
const watchlistButton = document.querySelector('.main-navigation__item-watchlist');
const historyButton = document.querySelector('.main-navigation__history');
const favouritesButton = document.querySelector('.main-navigation__item-favourites');
const mainNavigationItems = document.querySelectorAll('.main-navigation__item');

// Показ watchlist
watchlistButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');
  showMoreMoviesButton.classList.remove('visually-hidden');

  moviesMockCopy = moviesMock.filter((movie) => movie.isInWatchList);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMockCopy.slice(0, MOVIE_CARD_COUNT)) {
    render(filmsListContainer, new MovieCardView(value).getElement(), RenderPosition.BEFOREEND);
    renderMovieCards(filmsListContainer, value);
  }
});

// Показ history
historyButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');
  showMoreMoviesButton.classList.remove('visually-hidden');

  moviesMockCopy = moviesMock.filter((movie) => movie.isWatched);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMockCopy.slice(0, MOVIE_CARD_COUNT)) {
    renderMovieCards(filmsListContainer, value);
  }
});

// Показ favourites
favouritesButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');
  showMoreMoviesButton.classList.remove('visually-hidden');

  moviesMockCopy = moviesMock.filter((movie) => movie.isFavourite);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMockCopy.slice(0, MOVIE_CARD_COUNT)) {
    renderMovieCards(filmsListContainer, value);
  }
});

// Показ all, всех по дефолту
allMoviesButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');
  showMoreMoviesButton.classList.remove('visually-hidden');

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  moviesMockCopy = moviesMock.slice();

  for (const value of moviesMockCopy.slice(0, MOVIE_CARD_COUNT)) {
    renderMovieCards(filmsListContainer, value);
  }
});
*/
