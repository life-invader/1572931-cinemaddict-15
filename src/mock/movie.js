import dayjs from 'dayjs';
import objectSupport from 'dayjs/plugin/objectSupport';
import {getRandomInteger, randomFloat} from '../js/utils.js';
dayjs.extend(objectSupport);

const MIN_COMMENTS_AMOUNT = 0;
const MAX_COMMENTS_AMOUNT = 5;
const MOVIE_WRITERS_MIN_AMOUNT = 1;
const MOVIE_WRITERS_MAX_AMOUNT = 3;
const MOVIE_ACTORS_MIN_AMOUNT = 1;
const MOVIE_ACTORS_MAX_AMOUNT = 3;
const GENRES_DETAILS_AMOUNT = 3;

const MIN_RELEASE_YEAR = 1900;
const MAX_RELEASE_YEAR = 2000;
const MIN_RELEASE_MONTH = 0;
const MAX_RELEASE_MONTH = 11;
const MIN_RELEASE_DAY = 1;
const MAX_RELEASE_DAY = 30;
const MIN_MINUTES_AMOUNT = 1;
const MAX_MINUTES_AMOUNT = 59;
const MIN_HOURS_AMOUNT = 1;
const MAX_HOURS_AMOUNT = 23;

const firstNames = [
  'Erik',
  'Morris',
  'Brian',
  'Melton',
  'George',
  'Murphy',
  'Griffin',
  'Sharp',
  'Leslie',
  'Kennedy',
];

const lastNames = [
  'Peter',
  'Jones',
  'Ross',
  'Wiggins',
  'Esmond',
  'Lyons',
  'Brice',
  'Toby',
  'Willis',
  'Frederick',
];

const genres = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
];

const getRandomArrayProperty = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return array[index];
};

const generateGenre = () => {
  const index = getRandomInteger(0, genres.length - 1);
  return genres[index];
};

const generateMovieName = () => {
  const movieNameMock = [
    'Made for each other',
    'Popeye meets Sinbad',
    'Sagebrush trail',
    'Santa-Claus conquers the martians',
    'The dance of life',
    'The great Flamarion',
    'The man with the golden gun',
  ];

  const index = getRandomInteger(0, movieNameMock.length - 1);
  return movieNameMock[index];
};

const generateDescription = () => {
  const descriptionMock = [
    'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Aliquam erat volutpat.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
    'Nunc fermentum tortor ac porta dapibus.',
    'Sed sed nisi sed augue convallis suscipit in sed felis.',
  ];

  const movieDescription = [];
  for (let i = 0; i < getRandomInteger(1, 5); i++) {
    const description = descriptionMock[getRandomInteger(0, descriptionMock.length - 1)];
    movieDescription.push(description);
  }
  return movieDescription.join(' ');
};

const generatePoster = () => {
  const directory = './images/posters/';
  const posterNames = [
    'sagebrush-trail.jpg',
    'santa-claus-conquers-the-martians.jpg',
    'the-dance-of-life.jpg',
    'the-great-flamarion.jpg',
    'the-man-with-the-golden-arm.jpg',
    'made-for-each-other.png',
    'popeye-meets-sinbad.png',
  ];

  const index = getRandomInteger(0, posterNames.length - 1);
  return directory + posterNames[index];
};

const generateMovieRating = () => randomFloat();

const generateMovieDuration = () => {
  const hours = getRandomInteger(1, 3);
  const minutes = getRandomInteger(10, 59);

  return `${hours}h ${minutes}m`;
};

const generateReleaseDate = () => {
  const releaseYear = getRandomInteger(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR).toString();
  const releaseMonth = getRandomInteger(MIN_RELEASE_MONTH, MAX_RELEASE_MONTH).toString();
  const releaseDay = getRandomInteger(MIN_RELEASE_DAY, MAX_RELEASE_DAY).toString();
  const date = dayjs({year: releaseYear, month: releaseMonth, day: releaseDay});

  return date;
};

const generateCommentDate = () => {
  const commentYear = getRandomInteger(MIN_RELEASE_YEAR, MAX_RELEASE_YEAR).toString();
  const commentMonth = getRandomInteger(MIN_RELEASE_MONTH, MAX_RELEASE_MONTH).toString();
  const commentDay = getRandomInteger(MIN_RELEASE_DAY, MAX_RELEASE_DAY).toString();
  const commentHour = getRandomInteger(MIN_HOURS_AMOUNT, MAX_HOURS_AMOUNT).toString();
  const commentMinute = getRandomInteger(MIN_MINUTES_AMOUNT, MAX_MINUTES_AMOUNT).toString();
  const date = dayjs(`${commentMonth} ${commentDay} ${commentYear} ${commentHour}:${commentMinute}`).format('YYYY/MMMM/DD HH:mm');
  return date;
};

const generateComment = () => {
  const commentsMock = [
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra.',
    'Aliquam id orci ut lectus varius viverra.',
    'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  ];

  const emotions = [
    'angry',
    'puke',
    'sleeping',
    'smile',
  ];

  const commentAuthorsMock = [
    'Tim Macoveev',
    'John Doe',
  ];

  const commentsAmount = getRandomInteger(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT);

  const comments = new Array(commentsAmount).fill(null).map(() => (
    {
      text: getRandomArrayProperty(commentsMock),
      emotion: getRandomArrayProperty(emotions),
      author: getRandomArrayProperty(commentAuthorsMock),
      date: generateCommentDate(),
    }
  ));

  return comments;
};

const generateMovieWriters = () => {
  const amount = getRandomInteger(MOVIE_WRITERS_MIN_AMOUNT, MOVIE_WRITERS_MAX_AMOUNT);
  const writers = [];
  for (let i = 0; i < amount; i++) {
    const firstName = firstNames[getRandomInteger(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInteger(0, lastNames.length - 1)];
    const name = `${firstName} ${lastName}`;
    writers.push(name);
  }
  return writers.join(', ');
};

const generateMovieActors = () => {
  const amount = getRandomInteger(MOVIE_ACTORS_MIN_AMOUNT, MOVIE_ACTORS_MAX_AMOUNT);
  const actors = [];
  for (let i = 0; i < amount; i++) {
    const firstName = firstNames[getRandomInteger(0, firstNames.length - 1)];
    const lastName = lastNames[getRandomInteger(0, lastNames.length - 1)];
    const name = `${firstName} ${lastName}`;
    actors.push(name);
  }
  return actors.join(', ');
};

const generateMovieGenres = () => {
  const amount = getRandomInteger(GENRES_DETAILS_AMOUNT);
  const movieDetailsGenres = [];
  for (let i = 0; i < amount; i++) {
    const genre = getRandomArrayProperty(genres);
    movieDetailsGenres.push(genre);
  }
  return movieDetailsGenres;
};

const generateMovieDetails = () => {
  const countries = [
    'USA',
    'France',
    'Germany',
    'England',
    'Italy',
    'India',
  ];

  return {
    director: `${getRandomArrayProperty(firstNames)} ${getRandomArrayProperty(lastNames)}`,
    writers: generateMovieWriters(),
    actors: generateMovieActors(),
    releaseDate: generateReleaseDate(),
    country: getRandomArrayProperty(countries),
    genres: generateMovieGenres(),
  };
};

const generateMovie = () => (
  {
    name: generateMovieName(),
    genre: generateGenre(),
    rating: generateMovieRating(),
    duration: generateMovieDuration(),
    poster: generatePoster(),
    description: generateDescription(),
    comments: generateComment(),
    isInWatchList: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isFavourite: Boolean(getRandomInteger(0, 1)),
    details: generateMovieDetails(),
  }
);

export {generateMovie};
