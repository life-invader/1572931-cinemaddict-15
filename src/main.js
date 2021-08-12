import MovieListExtra from './view/film-list-extra.js';
import FilmListView from './view/film-list.js';
import MenuTemplateView from './view/menu.js';
import MovieCardView from './view/movie-card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import UserProfileView from './view/user-profile.js';
import MovieDetailsView from './view/film-details.js';
import SortView from './view/sort.js';
import StatisticsView from './view/statistics.js';
import EmptyFilmListView from './view/empty-list.js';
import {render, RenderPosition, remove} from './js/utils.js';

// ===========================================================

import {generateMovie} from './mock/movie.js';
// Изначальный массив фильмов
const moviesMock = new Array(25).fill(null).map(generateMovie);
// Его копия, с которой работают кнопки сортировки и фильтрации
const moviesMockCopy = moviesMock.slice();

// ===========================================================

const MOVIE_CARD_COUNT = 5;
const MOVIE_CARD_COUNT_EXTRA = 2;
const SHOW_MORE_MOVIES_BUTTON_STEP = 5;
const EXTRA_MOVIES_BLOCKS = [
  {
    name: 'Top rated',
    getMovies() {
      return moviesMockCopy.sort((a, b) => b.rating - a.rating);
    },
  },
  {
    name: 'Most commented',
    getMovies() {
      return moviesMockCopy.sort((a, b) => b.comments.length - a.comments.length);
    },
  },
];

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

// ===========================================================
// Функция рендера поп-ап'а
const renderMovieDetails = (movie) => {
  document.body.classList.add('hide-overflow');
  const movieDetails = new MovieDetailsView(movie);

  function closeMovieDetailsPopup() {
    document.body.classList.remove('hide-overflow');
    remove(movieDetails);
    document.removeEventListener('keydown', onEscKeyDown);
  }

  function onEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closeMovieDetailsPopup();
    }
  }

  document.addEventListener('keydown', onEscKeyDown);

  movieDetails.setCloseMovieDetailsPopup(() => {
    closeMovieDetailsPopup();
  });

  render(footerElement, movieDetails.getElement(), RenderPosition.BEFOREEND);
};

// Функция рендера карточек фильма
const renderMovieCards = (container, movie) => {
  const movieCard = new MovieCardView(movie);

  movieCard.setMovieCardClick(() => {
    if (document.body.classList.contains('hide-overflow')) {
      return;
    }
    renderMovieDetails(movie);
  });

  render(container, movieCard.getElement(), RenderPosition.BEFOREEND);
};

// ===========================================================

// Функция отрисовки всего остального
const renderSite = () => {
  render(headerElement, new UserProfileView(), RenderPosition.BEFOREEND);
  render(mainElement, new MenuTemplateView(moviesMock), RenderPosition.AFTERBEGIN);
  render(mainElement, new SortView(), RenderPosition.BEFOREEND);

  if(moviesMock.length === 0) {
    render(mainElement, new EmptyFilmListView(), RenderPosition.BEFOREEND);
    return;
  }

  render(mainElement, new FilmListView(), RenderPosition.BEFOREEND);
  render(footerElement, new StatisticsView(), RenderPosition.BEFOREEND);

  const filmsListContainer = document.querySelector('.films-list__container');
  const filmsContainer = document.querySelector('.films-list');

  render(filmsContainer, new ShowMoreButtonView(), RenderPosition.BEFOREEND);

  const showMoreMoviesButton = document.querySelector('.films-list__show-more');

  // Отрисовка первых 5 карточек фильмов
  moviesMockCopy
    .slice(0, MOVIE_CARD_COUNT)
    .forEach((movie) => renderMovieCards(filmsListContainer, movie));

  // Показ следующих пяти фильмов
  showMoreMoviesButton.addEventListener('click', () => {
    moviesMockCopy
      .slice(filmsListContainer.children.length, filmsListContainer.children.length + SHOW_MORE_MOVIES_BUTTON_STEP)
      .forEach((movie) => renderMovieCards(filmsListContainer, movie));
    if (filmsListContainer.children.length >= moviesMockCopy.length) {
      showMoreMoviesButton.classList.add('visually-hidden');
    }
  });

  // Показ дополнительных блоков 'Top rated' и 'Most commented'
  const filmsElement = document.querySelector('.films');

  EXTRA_MOVIES_BLOCKS.forEach((extraBlock) => {
    const extraBlockTemplate = new MovieListExtra(extraBlock);
    render(filmsElement, extraBlockTemplate, RenderPosition.BEFOREEND);
    const insertPlace = extraBlockTemplate.getElement().querySelector('.films-list__container');
    const movies = extraBlock.getMovies();
    movies
      .slice(0, MOVIE_CARD_COUNT_EXTRA)
      .forEach((movie) => renderMovieCards(insertPlace, movie));
  });
};

renderSite();

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
