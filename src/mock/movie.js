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

const FIRST_NAMES = [
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

const LAST_NAMES = [
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

const GENRES = [
  'Musical',
  'Western',
  'Drama',
  'Comedy',
  'Cartoon',
  'Mystery',
];

const MOVIE_NAME_MOCK = [
  'Made for each other',
  'Popeye meets Sinbad',
  'Sagebrush trail',
  'Santa-Claus conquers the martians',
  'The dance of life',
  'The great Flamarion',
  'The man with the golden gun',
];

const MOVIE_DESCRIPTION_MOCK = [
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Aliquam erat volutpat.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Nunc fermentum tortor ac porta dapibus.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
];

const POSTER_DIRECTORY = './images/posters/';

const POSTER_NAMES = [
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
];

const COMMENTS_MOCK = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
];

const COMMENT_EMOTIONS = [
  'angry',
  'puke',
  'sleeping',
  'smile',
];

const COMMENT_AUTHOR = [
  'Tim Macoveev',
  'John Doe',
];

const countries = [
  'USA',
  'France',
  'Germany',
  'England',
  'Italy',
  'India',
];

const getRandomArrayProperty = (array) => {
  const index = getRandomInteger(0, array.length - 1);
  return array[index];
};

const generateGenre = () => {
  const index = getRandomInteger(0, GENRES.length - 1);
  return GENRES[index];
};

const generateMovieName = () => {
  const index = getRandomInteger(0, MOVIE_NAME_MOCK.length - 1);
  return MOVIE_NAME_MOCK[index];
};

const generateDescription = () => {
  const index = getRandomInteger(1, 5);
  const movieDescription = Array.from({length: index}, () => MOVIE_DESCRIPTION_MOCK[getRandomInteger(0, MOVIE_DESCRIPTION_MOCK.length - 1)]);
  return movieDescription.join(' ');
};

const generatePoster = () => {
  const index = getRandomInteger(0, POSTER_NAMES.length - 1);
  return POSTER_DIRECTORY + POSTER_NAMES[index];
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
  const commentsAmount = getRandomInteger(MIN_COMMENTS_AMOUNT, MAX_COMMENTS_AMOUNT);

  const comments = new Array(commentsAmount).fill(null).map(() => (
    {
      text: getRandomArrayProperty(COMMENTS_MOCK),
      emotion: getRandomArrayProperty(COMMENT_EMOTIONS),
      author: getRandomArrayProperty(COMMENT_AUTHOR),
      date: generateCommentDate(),
    }
  ));

  return comments;
};

const generateMovieWriters = () => {
  const amount = getRandomInteger(MOVIE_WRITERS_MIN_AMOUNT, MOVIE_WRITERS_MAX_AMOUNT);
  const writers = Array.from({length: amount}, () => {
    const firstName = FIRST_NAMES[getRandomInteger(0, FIRST_NAMES.length - 1)];
    const lastName = LAST_NAMES[getRandomInteger(0, LAST_NAMES.length - 1)];
    const name = `${firstName} ${lastName}`;
    return name;
  });
  return writers;
};

const generateMovieActors = () => {
  const amount = getRandomInteger(MOVIE_ACTORS_MIN_AMOUNT, MOVIE_ACTORS_MAX_AMOUNT);
  const actors = Array.from({length: amount}, () => {
    const firstName = FIRST_NAMES[getRandomInteger(0, FIRST_NAMES.length - 1)];
    const lastName = LAST_NAMES[getRandomInteger(0, LAST_NAMES.length - 1)];
    const name = `${firstName} ${lastName}`;
    return name;
  });

  return actors;
};

const generateMovieGenres = () => {
  const amount = getRandomInteger(GENRES_DETAILS_AMOUNT);
  const movieDetailsGenres = Array.from({length: amount}, () => {
    const genre = getRandomArrayProperty(GENRES);
    return genre;
  });
  return movieDetailsGenres;
};

const generateMovieDetails = () => ({
  director: `${getRandomArrayProperty(FIRST_NAMES)} ${getRandomArrayProperty(LAST_NAMES)}`,
  writers: generateMovieWriters(),
  actors: generateMovieActors(),
  releaseDate: generateReleaseDate(),
  country: getRandomArrayProperty(countries),
  genres: generateMovieGenres(),
});

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
