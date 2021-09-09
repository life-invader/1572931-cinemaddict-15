import MenuTemplateView from '../view/menu.js';
import {remove, render, RenderPosition, replace} from '../js/utils.js';
import {UpdateType, filter, FilterType} from '../js/const.js';

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

  init(showStatistics) {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new MenuTemplateView(filters, this._filterModel.getFilter());
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    this._showStatistics = showStatistics;

    if(prevFilterComponent === null) {
      render(this._menuFilterContainer, this._filterComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _handleModelEvent() {
    this.init(this._showStatistics);
  }

  _handleFilterTypeChange(filterType) {
    if(this._filterModel.getFilter() === filterType) {
      return;
    }

    if(filterType === FilterType.statistics) {
      this._filterModel.setFilter(UpdateType.MAJOR, filterType);
      this._showStatistics(FilterType.statistics);
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
    this._showStatistics(filterType);
  }

  _getFilters() {
    const movies = this._moviesModel.getMovies();

    return [
      {
        name: FilterType.watchlist,
        count: filter[FilterType.watchlist](movies).length,
      },
      {
        name: FilterType.history,
        count: filter[FilterType.history](movies).length,
      },
      {
        name: FilterType.favourites,
        count: filter[FilterType.favourites](movies).length,
      },
      {
        name: FilterType.statistics,
        count: null,
      },
    ];
  }
}

export default MenuFilter;
