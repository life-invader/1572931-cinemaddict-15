import MenuTemplateView from '../view/menu.js';
import {render, RenderPosition} from '../js/utils.js';

class MenuFilter {
  constructor(container, movies) {
    this._moviesModel = movies;
    this._menuFilterContainer = container;
  }

  init() {
    const menuFilterComponent = new MenuTemplateView(this._moviesModel);
    render(this._menuFilterContainer, menuFilterComponent, RenderPosition.AFTERBEGIN);
  }

}

export default MenuFilter;
