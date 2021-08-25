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

  updateMovie(updateMovie) {
    const index = this._movies.findIndex((item) => item.id === updateMovie.id);

    if(index === -1) {
      throw new Error('Can\'t update unexisting movie');
    }

    this._movies = [...this._movies.slice(0, index), updateMovie, ...this._movies.slice(index + 1)];

    this._notify(updateMovie);
  }

}

export default Movies;
