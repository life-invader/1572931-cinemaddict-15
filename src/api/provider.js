import MovieModel from '../model/movie.js';
import {isOnline} from '../js/utils.js';

const getSyncedMovies = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.task);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getMovies() {
    if (isOnline()) {
      return this._api.getMovies()
        .then((movies) => {
          const items = createStoreStructure(movies.map(MovieModel.adaptToServer));
          this._store.setItems(items);
          return movies;
        });
    }

    const storeMovies = Object.values(this._store.getItems());

    return Promise.resolve(storeMovies.map(MovieModel.adaptToClient));
  }

  updateMovie(movie) {
    if (isOnline()) {
      return this._api.updateMovie(movie)
        .then((updatedMovie) => {
          this._store.setItem(updatedMovie.id, MovieModel.adaptToServer(updatedMovie));
          return updatedMovie;
        });
    }

    this._store.setItem(movie.id, MovieModel.adaptToServer(Object.assign({}, movie)));

    return Promise.resolve(movie);
  }

  getComments() {
    if (isOnline()) {
      return this._api.getComments()
        .then((comments) => {
          const items = createStoreStructure(comments.map(MovieModel.adaptCommentToServer));
          this._store.setItems(items);
          return comments;
        });
    }
  }

  addComment(comment) {
    if (isOnline()) {
      return this._api.addComment(comment)
        .then((newComment) => {
          this._store.setItem(newComment.id, MovieModel.adaptCommentToServer(newComment));
          return newComment;
        });
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(comment) {
    if (isOnline()) {
      return this._api.deleteComment(comment)
        .then(() => this._store.removeItem(comment.id));
    }

    return Promise.reject(new Error('Delete task failed'));
  }

  sync() {
    if (isOnline()) {
      const storeTasks = Object.values(this._store.getItems());

      return this._api.sync(storeTasks)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          const createdTasks = getSyncedMovies(response.created);
          const updatedTasks = getSyncedMovies(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure([...createdTasks, ...updatedTasks]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
