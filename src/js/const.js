const FilterType = {
  all: 'all',
  watchlist: 'watchlist',
  history: 'history',
  favourites: 'favourites',
  statistics: 'statistics',
};

const filter = {
  [FilterType.all]: (movies) => movies.slice(),
  [FilterType.watchlist]: (movies) => movies.filter((movie) => movie.isInWatchList === true),
  [FilterType.history]: (movies) => movies.filter((movie) => movie.isWatched === true),
  [FilterType.favourites]: (movies) => movies.filter((movie) => movie.isFavourite === true),
  [FilterType.statistics]: (movies) => movies.slice(),
};

const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

const SortButtons = {
  default: 'default',
  byDate: 'byDate',
  byRating: 'byRating',
  statistics: 'statistics',
};

const UserAction = {
  UPDATE_MOVIE: 'UPDATE_MOVIE',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export {FilterType, filter, UpdateType, SortButtons, UserAction};
