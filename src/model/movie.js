import AbstractObserver from '../js/abstract-observer.js';

class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(movies) {
    this._movies = movies.slice();
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, updateMovie) {
    const index = this._movies.findIndex((item) => item.id === updateMovie.id);
    this._movies = [...this._movies.slice(0, index), updateMovie, ...this._movies.slice(index + 1)];

    this._notify(updateType, updateMovie);
  }

  addComment(updateType, updateMovie) {
    const index = this._movies.findIndex((item) => item.id === updateMovie.id);
    this._movies = [...this._movies.slice(0, index), updateMovie, ...this._movies.slice(index + 1)];

    this._notify(updateType, updateMovie);
  }

  deleteComment(updateType, updateMovie) {
    const index = this._movies.findIndex((item) => item.id === updateMovie.id);
    this._movies = [...this._movies.slice(0, index), updateMovie, ...this._movies.slice(index + 1)];

    this._notify(updateType, updateMovie);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        name: movie['film_info'].title,
        alternativeName: movie['film_info']['alternative_title'],
        rating: movie['film_info']['total_rating'],
        duration: movie['film_info'].runtime,
        poster: movie['film_info'].poster,
        description: movie['film_info'].description,
        isInWatchList: movie['user_details'].watchlist,
        isWatched: movie['user_details']['already_watched'],
        isFavourite: movie['user_details'].favorite,
        ageRating: movie['film_info']['age_rating'],
        details: {
          director: movie['film_info'].director,
          writers: movie['film_info'].writers,
          actors: movie['film_info'].actors,
          releaseDate: movie['film_info'].release['date'],
          country: movie['film_info'].release['release_country'],
          genres: movie['film_info'].genre,
        },
        'watching_date': movie['user_details']['watching_date'],
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedMovie['film_info'];
    delete adaptedMovie['user_details'];

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'film_info': {
          actors: movie['details'].actors,
          'age_rating': movie.ageRating,
          'alternative_title': movie.alternativeName,
          description: movie.description,
          director: movie['details'].director,
          genre: movie['details'].genres,
          poster: movie.poster,
          release: {
            date: movie['details'].releaseDate,
            'release_country': movie['details'].country,
          },
          runtime: movie.duration,
          title: movie.name,
          'total_rating': movie.rating,
          writers: movie['details'].writers,
        },
      },
    );

    // Ненужные ключи мы удаляем
    delete adaptedMovie.name;
    delete adaptedMovie.rating;
    delete adaptedMovie.duration;
    delete adaptedMovie.poster;
    delete adaptedMovie.description;
    delete adaptedMovie.isInWatchList;
    delete adaptedMovie.isWatched;
    delete adaptedMovie.isFavourite;
    delete adaptedMovie.details;
    delete adaptedMovie['watching_date'];

    return adaptedMovie;
  }
}

export default Movies;
