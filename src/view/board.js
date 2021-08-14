import AbstractView from './abstract.js';

const createBoardTemplate = () => '<section class="films"></section>';

class Board extends AbstractView {
  getTemplate() {
    return createBoardTemplate();
  }
}

export default Board;
