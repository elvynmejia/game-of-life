import GameOfLife from './base';
import { deepCopy } from './utils';
import {
  getValue,
  getColId
} from './utils';

class HtmlBased extends GameOfLife {
  constructor(options = {}) {
    super(options);
    this.ctx = document;
  }

  run() {
    this.newState();
    const currentState = deepCopy(this.currentState);

    for (let i = 0; i < currentState.length; i++) {
      for (let j = 0; j < currentState.length; j++) {
        const currentCol = this.ctx.getElementById(getColId(i, j)) as HTMLElement;

        const color = this.getColor(i, j);
        currentCol.setAttribute('style', `background-color: ${color}`);
      }
    }

    this.currentState = currentState;
  }

  draw() {
    const grid = this.ctx.getElementById('grid') as HTMLElement;
    for (let i = 0; i < this.currentState.length; i++) {
      const row = this.ctx.createElement('div') as HTMLElement;
      row.setAttribute('class', 'row-');
      for (let j = 0; j < this.currentState.length; j++) {
        const col = this.ctx.createElement('div');

        col.setAttribute('class', 'col-');
        col.setAttribute('id', getColId(i, j));
        const color = this.getColor(i, j);

        col.setAttribute('style', `background-color: ${color}`);
        row.appendChild(col);
      }

      if (grid) {
        grid.appendChild(row);
      }
    }
  }
}

export default HtmlBased;
