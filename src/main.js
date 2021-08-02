import filmListExtraTemplate from './view/film-list-extra.js';
import filmListTemplate from './view/film-list.js';
import menuTemplate from './view/menu.js';
import movieCardTemplate from './view/movie-card.js';
import showMoreButtonTemplate from './view/show-more-button.js';
import userProfileTemplate from './view/user-profile.js';
import filmDetailsTemplate from './view/film-details.js';
import renderlayoutTemplate from './js/utils.js';

// ===========================================================

import {generateMovie} from './mock/movie.js';
let moviesMock = new Array(25).fill(null).map(generateMovie);

// ===========================================================

const MOVIE_CARD_COUNT = 5;
const MOVIE_CARD_COUNT_EXTRA = 2;
const SHOW_MORE_MOVIES_BUTTON_STEP = 5;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

renderlayoutTemplate(headerElement, userProfileTemplate(), 'beforeend');
renderlayoutTemplate(mainElement, menuTemplate(moviesMock), 'afterbegin');
renderlayoutTemplate(mainElement, filmListTemplate(), 'beforeend');

const filmsListContainer = document.querySelector('.films-list__container');

// Функция открытия поп-ап'а
const openMovieDetailsPopup = (movie) => {
  const filmCard = document.querySelector('.film-card:last-child');
  filmCard.addEventListener('click', (evt) => {
    if (document.body.classList.contains('modal-open')) {
      return;
    }
    if (evt.target.classList.contains('film-card__title') || evt.target.classList.contains('film-card__poster')) {
      document.body.classList.add('modal-open');
      renderlayoutTemplate(footerElement, filmDetailsTemplate(movie), 'beforeend');
      const closePopupButton = document.querySelector('.film-details__close-btn');

      const filmDetails = document.querySelector('.film-details');
      closePopupButton.addEventListener('click', () => {
        document.body.classList.remove('modal-open');
        filmDetails.remove();
      });
    }
  });
};

// Отрисовка первых 5 карточек фильмов
for (const value of moviesMock.slice(0, MOVIE_CARD_COUNT)) {
  renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
  openMovieDetailsPopup(value);
}

const filmsContainer = document.querySelector('.films-list');

renderlayoutTemplate(filmsContainer, showMoreButtonTemplate(), 'beforeend');

const showMoreMoviesButton = document.querySelector('.films-list__show-more');

showMoreMoviesButton.addEventListener('click', () => {
  const showMoreMoviesArray = moviesMock.slice(filmsListContainer.children.length, filmsListContainer.children.length + SHOW_MORE_MOVIES_BUTTON_STEP);
  for (const value of showMoreMoviesArray) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
  }
  if (filmsListContainer.children.length >= moviesMock.length) {
    showMoreMoviesButton.classList.add('visually-hidden');
  }
});

const filmsElement = document.querySelector('.films');

renderlayoutTemplate(filmsElement, filmListExtraTemplate(), 'beforeend');
renderlayoutTemplate(filmsElement, filmListExtraTemplate(), 'beforeend');

const filmsExtraElement = Array.from(document.querySelectorAll('.films-list--extra .films-list__container')); // All

filmsExtraElement.forEach((element) => {
  for (let i = 0; i < MOVIE_CARD_COUNT_EXTRA; i++) {
    renderlayoutTemplate(element, movieCardTemplate(moviesMock[i]), 'beforeend');
  }
});

// СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА СОРТИРОВКА
// Сортировка по дате
const renderByDate = (evt) => {
  evt.preventDefault();
  const sortItems = document.querySelectorAll('.sort__button');

  sortItems.forEach((button) => {
    button.classList.remove('sort__button--active');
  });

  evt.target.classList.add('sort__button--active');
  moviesMock.sort((a, b) => b.year - a.year);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMock.slice(0, MOVIE_CARD_COUNT)) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
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
  moviesMock.sort((a, b) => b.rating - a.rating);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMock.slice(0, MOVIE_CARD_COUNT)) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
  }
};

const sortByRatingButton = document.querySelector('.sort__button-rating');
sortByRatingButton.addEventListener('click', renderByRating);


// Сортировка по дефолту
const renderDefault = () => {
  const defaultMoviesMock = moviesMock.slice();

  const renderDefaultInner = (evt) => {
    evt.preventDefault();
    const sortItems = document.querySelectorAll('.sort__button');

    sortItems.forEach((button) => {
      button.classList.remove('sort__button--active');
    });
    evt.target.classList.add('sort__button--active');

    moviesMock = defaultMoviesMock.slice();

    const array1 = Array.from(filmsListContainer.children);
    for (const value of array1) {
      value.remove();
    }

    for (const value of defaultMoviesMock.slice(0, MOVIE_CARD_COUNT)) {
      renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
      openMovieDetailsPopup(value);
    }
  };

  const sortDefaultButton = document.querySelector('.sort__button-default');
  sortDefaultButton.addEventListener('click', renderDefaultInner);
};
renderDefault();

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

  const moviesInWatchlist = moviesMock.filter((movie) => movie.isInWatchList);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesInWatchlist.slice(0, MOVIE_CARD_COUNT)) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
  }
});

// Показ history
historyButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');

  const watchedMovies = moviesMock.filter((movie) => movie.isWatched);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of watchedMovies.slice(0, MOVIE_CARD_COUNT)) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
  }
});

// Показ favourites
favouritesButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');

  const favouriteMovies = moviesMock.filter((movie) => movie.isFavourite);

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of favouriteMovies.slice(0, MOVIE_CARD_COUNT)) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
  }
});

// Показ all, всех по дефолту
allMoviesButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  mainNavigationItems.forEach((button) => {
    button.classList.remove('main-navigation__item--active');
  });
  evt.target.classList.add('main-navigation__item--active');

  const array1 = Array.from(filmsListContainer.children);
  for (const value of array1) {
    value.remove();
  }

  for (const value of moviesMock.slice(0, MOVIE_CARD_COUNT)) {
    renderlayoutTemplate(filmsListContainer, movieCardTemplate(value), 'beforeend');
    openMovieDetailsPopup(value);
  }
});
