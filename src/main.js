import filmListExtraTemplate from './view/film-list-extra.js';
import filmListTemplate from './view/film-list.js';
import menuTemplate from './view/menu.js';
import movieCardTemplate from './view/movie-card.js';
import showMoreButtonTemplate from './view/show-more-button.js';
import userProfileTemplate from './view/user-profile.js';
import filmDetailsTemplate from './view/film-details.js';

const MOVIE_CARD_COUNT = 5;
const MOVIE_CARD_COUNT_EXTRA = 2;

const headerElement = document.querySelector('.header');
const mainElement = document.querySelector('.main');
const footerElement = document.querySelector('.footer');

const renderlayoutTemplate = (container, layout, position) => {
  container.insertAdjacentHTML(position, layout);
};

renderlayoutTemplate(headerElement, userProfileTemplate(), 'beforeend');
renderlayoutTemplate(mainElement, menuTemplate(), 'afterbegin');
renderlayoutTemplate(mainElement, filmListTemplate(), 'beforeend');

const filmsListContainer = document.querySelector('.films-list__container');

for (let i = 0; i < MOVIE_CARD_COUNT; i++) {
  renderlayoutTemplate(filmsListContainer, movieCardTemplate(), 'beforeend');
}

const filmsContainer = document.querySelector('.films-list');

renderlayoutTemplate(filmsContainer, showMoreButtonTemplate(), 'beforeend');

const filmsElement = document.querySelector('.films');

renderlayoutTemplate(filmsElement, filmListExtraTemplate(), 'beforeend');
renderlayoutTemplate(filmsElement, filmListExtraTemplate(), 'beforeend');

const filmsExtraElement = Array.from(document.querySelectorAll('.films-list--extra .films-list__container')); // All

filmsExtraElement.forEach((element) => {
  for (let i = 0; i < MOVIE_CARD_COUNT_EXTRA; i++) {
    renderlayoutTemplate(element, movieCardTemplate(), 'beforeend');
  }
});

renderlayoutTemplate(footerElement, filmDetailsTemplate(), 'beforeend');
