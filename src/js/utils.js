import dayjs from 'dayjs';
import Abstract from '../view/abstract.js';

const USER_ACTION = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UPDATE_TYPE = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const FILTER_TYPE = {
  all: 'all',
  watchlist: 'watchlist',
  history: 'history',
  favourites: 'favourites',
};

const filter = {
  [FILTER_TYPE.all]: (movies) => movies.slice(),
  [FILTER_TYPE.watchlist]: (movies) => movies.filter((movie) => movie.isInWatchList === true),
  [FILTER_TYPE.history]: (movies) => movies.filter((movie) => movie.isWatched === true),
  [FILTER_TYPE.favourites]: (movies) => movies.filter((movie) => movie.isFavourite === true),
};

const SORT_BUTTONS = {
  default: 'default',
  byDate: 'byDate',
  byRating: 'byRating',
};

const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

const render = (container, element, position) => {
  if (container instanceof Abstract) {
    container = container.getElement();
  }

  if (element instanceof Abstract) {
    element = element.getElement();
  }

  switch (position) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Abstract)) {
    throw new Error('Can remove only components');
  }
  component.getElement().remove();
  component.removeElement();
};

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const randomFloat = (a = 10, b = 1) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  const number = (lower + Math.random() * (upper - lower)).toFixed(1);
  return String(number).endsWith('0') ? Number(number).toFixed() : Number(number).toFixed(1);
};

// const updateItem = (items, newitem) => {
//   const index = items.findIndex((item) => item.id === newitem.id);

//   if(index === -1) {
//     return items;
//   }

//   return [...items.slice(0, index), newitem, ...items.slice(index + 1)];
// };

const replace = (newChild, oldChild) => {
  if (oldChild instanceof Abstract) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Abstract) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error('Can\'t replace unexisting elements');
  }

  parent.replaceChild(newChild, oldChild);
};

const sortByDate = (firstMovie, secondMovie) => dayjs(secondMovie.details.releaseDate).diff(dayjs(firstMovie.details.releaseDate));

const sortByrating = (firstMovie, secondMovie) => secondMovie.rating - firstMovie.rating;

export {RenderPosition, render, createElement, remove, getRandomInteger, randomFloat, replace, sortByDate, sortByrating, SORT_BUTTONS, USER_ACTION, UPDATE_TYPE, FILTER_TYPE, filter};

