import GameOfLife from './base';
import {
  getValue,
  getColId
} from './utils';

class HtmlBased extends GameOfLife {
  run() {
    this.newState();
    const currentState = JSON.parse(JSON.stringify(this.currentState));

    for (let i = 0; i < currentState.length; i++) {
      for (let j = 0; j < currentState.length; j++) {
        const currentCol = document.getElementById(getColId(i, j)) as HTMLElement;

        const color = this.getColor(i, j);
        currentCol.setAttribute('style', `background-color: ${color}`);
      }
    }

    this.currentState = currentState;
  }

  draw() {
    const grid = document.getElementById('grid') as HTMLElement;
    for (let i = 0; i < this.currentState.length; i++) {
      const row = document.createElement('div') as HTMLElement;
      row.setAttribute('class', 'row-');
      for (let j = 0; j < this.currentState.length; j++) {
        const col = document.createElement('div');

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
