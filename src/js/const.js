const FilterType = {
  ALL: 'all',
  WATCHLIST: 'watchlist',
  HISTORY: 'history',
  FAVOURITE: 'favourites',
  STATISTIC: 'statistics',
};

const Filter = {
  [FilterType.ALL]: (movies) => movies.slice(),
  [FilterType.WATCHLIST]: (movies) => movies.filter((movie) => movie.isInWatchList === true),
  [FilterType.HISTORY]: (movies) => movies.filter((movie) => movie.isWatched === true),
  [FilterType.FAVOURITE]: (movies) => movies.filter((movie) => movie.isFavourite === true),
  [FilterType.STATISTIC]: (movies) => movies.slice(),
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const SortButton = {
  DEFAULT: 'default',
  BY_DATE: 'byDate',
  BY_RATING: 'byRating',
  STATISTIC: 'statistics',
};

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export {FilterType, Filter, UpdateType, SortButton, UserAction};
