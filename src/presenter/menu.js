import MenuTemplateView from '../view/menu.js';
import {remove, render, RenderPosition, replace, UPDATE_TYPE, filter, FILTER_TYPE} from '../js/utils.js';

class MenuFilter {
  constructor(container, moviesModel, filterModel) {
    this._moviesModel = moviesModel;
    this._menuFilterContainer = container;
    this._filterModel = filterModel;

    this._filterComponent = null;

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new MenuTemplateView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if(prevFilterComponent === null) {
      render(this._menuFilterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if(this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UPDATE_TYPE.MAJOR, filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        name: FILTER_TYPE.watchlist,
        count: filter[FILTER_TYPE.watchlist](movies).length,
      },
      {
        name: FILTER_TYPE.history,
        count: filter[FILTER_TYPE.history](movies).length,
      },
      {
        name: FILTER_TYPE.favourites,
        count: filter[FILTER_TYPE.favourites](movies).length,
      },
    ];
  }
}

export default MenuFilter;
