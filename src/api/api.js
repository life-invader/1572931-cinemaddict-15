import MovieModel from '../model/movie.js';

const Links = {
  MOVIES: 'movies',
  COMMENTS: 'comments',
};

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint; // ссылка на сервер https://15.ecmascript.pages.academy/cinemaddict/;
    this._authorization = authorization;  // Basic kgji4783jcfigdf
  }

  getMovies() {
    return this._load({url: Links.MOVIES})
      .then(Api.toJSON)
      .then((movies) => movies.map(MovieModel.adaptToClient));
  }

  updateMovie(movie) {
    return this._load({
      url: `${Links.MOVIES}/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(MovieModel.adaptToServer(movie)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(MovieModel.adaptToClient);
  }

  getComments(movieId) {
    return this._load({url: `${Links.COMMENTS}/${movieId}`})
      .then(Api.toJSON)
      .catch(() => {throw new Error('Ошибка получения списка комментариев');});
  }

  addComment(comment) {
    return this._load({
      url: `${Links.COMMENTS}/${comment.movieId}`,
      method: Method.POST,
      body: JSON.stringify(MovieModel.adaptCommentToServer(comment)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(MovieModel.adaptCommentToClient)
      .catch(() => {throw new Error('Ошибка добавления комментария');});
  }

  deleteComment(commentToDelete) {
    return this._load({
      url: `${Links.COMMENTS}/${commentToDelete.commentId}`,
      method: Method.DELETE,
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then((response) => response)
      .catch(() => {throw new Error('Ошибка удаления комментария');});
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }

  sync(data) {
    return this._load({
      url: 'movies/sync',
      method: Method.POST,
      body: JSON.stringify(data),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }
}

export default Api;
