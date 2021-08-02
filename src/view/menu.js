const menuTemplate = (movies) => {
  const watchListAmount = movies.filter((movie) => movie.isInWatchList === true);
  const watchedAmount = movies.filter((movie) => movie.isWatched === true);
  const isFavourite = movies.filter((movie) => movie.isFavourite === true);

  return `
    <nav class="main-navigation">
      <div class="main-navigation__items">
        <a href="#all" class="main-navigation__item main-navigation__item-all main-navigation__item--active">All movies</a>
        <a href="#watchlist" class="main-navigation__item main-navigation__item-watchlist">Watchlist <span class="main-navigation__item-count">${watchListAmount.length}</span></a>
        <a href="#history" class="main-navigation__item main-navigation__history">History <span class="main-navigation__item-count">${watchedAmount.length}</span></a>
        <a href="#favorites" class="main-navigation__item main-navigation__item-favourites">Favorites <span class="main-navigation__item-count">${isFavourite.length}</span></a>
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>

    <ul class="sort">
      <li><a href="#" class="sort__button sort__button-default sort__button--active">Sort by default</a></li>
      <li><a href="#" class="sort__button sort__button-date">Sort by date</a></li>
      <li><a href="#" class="sort__button sort__button-rating">Sort by rating</a></li>
    </ul>
    `;
};

export default menuTemplate;
