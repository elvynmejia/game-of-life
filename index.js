const getValue = () => (Math.random() < 0.4 ? 0 : 1);
const getColId = (i, j) => ['row', i, 'col', j].join('-');

class GameOfLife {
  constructor({ rows = 10, cols = 10 } = {}) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    this.ctx = ctx;
    this.rows = rows;
    this.cols = cols;
    this.currentState = [];
    this.nextState = [];
    this.previousState = [];
    this.isRunning = false;
    this.stateColors = {
      alive: '#ff8080',
      dead: '#303030',
    };
  }

  initializeState() {
    const rows = [...new Array(this.rows).keys()];
    const cols = [...new Array(this.cols).keys()];
    const currentState = rows.map((current) => {
      return cols.map((i) => getValue());
    });

    this.currentState = JSON.parse(JSON.stringify(currentState));
  }

  getColor(i, j) {
    return this.currentState[i][j] == 0
      ? this.stateColors.dead
      : this.stateColors.alive;
  }

  newState() {
    // deep copy
    this.previousState = JSON.parse(JSON.stringify(this.currentState));
    this.nextState = JSON.parse(JSON.stringify(this.currentState));

    for (let i = 0; i < this.nextState.length; i++) {
      for (let j = 0; j < this.nextState.length; j++) {
        this.nextState[i][j] = this.applyRules(i, j);
      }
    }

    this.currentState = this.nextState;
  }

  setCellValueHelper(row, col) {
    try {
      return this.currentState[row][col];
    } catch {
      return 0;
    }
  }

  count(row, col) {
    let totalNeighbours = 0;
    totalNeighbours += this.setCellValueHelper(row - 1, col - 1);
    totalNeighbours += this.setCellValueHelper(row - 1, col);
    totalNeighbours += this.setCellValueHelper(row - 1, col + 1);
    totalNeighbours += this.setCellValueHelper(row, col - 1);
    totalNeighbours += this.setCellValueHelper(row, col + 1);
    totalNeighbours += this.setCellValueHelper(row + 1, col - 1);
    totalNeighbours += this.setCellValueHelper(row + 1, col);
    totalNeighbours += this.setCellValueHelper(row + 1, col + 1);
    return totalNeighbours;
  }

  countAliveNeighbors(currentRow, currentCol) {
    const rows = this.rows;
    const cols = this.cols;

    let count = 0;
    const condition =
      currentRow > 0 &&
      currentRow < rows - 1 &&
      currentCol > 0 &&
      currentCol < cols - 1;

    if (condition) {
      const startAtRow = currentRow - 1;
      const startAtCol = currentCol - 1;
      const endAtRow = currentRow + 1;
      const endAtCol = currentCol + 1;

      for (let i = startAtRow; i <= endAtRow; i++) {
        for (let j = startAtCol; j <= endAtCol; j++) {
          if (!(currentRow === i && currentCol === j)) {
            count += this.nextState[i][j];
          }
        }
      }
    }
    return count;
  }

  isAlive(value) {
    return value === 1 ? true : false;
  }

  applyRules(i, j) {
    // apply the rules of the game
    // Any live cell with two or three live neighbours survives. if alive then alive === 2 || alaive == 3 => 1
    // Any dead cell with three live neighbours becomes a live cell. if dead then alive === 3 => alive
    // All other live cells die in the next generation. Similarly, all other dead cells stay dead.
    const numberOfAliveNeighbors = this.countAliveNeighbors(i, j);

    const isAlive = this.isAlive(this.currentState[i][j]);

    // is alive
    if (isAlive) {
      if (numberOfAliveNeighbors === 2 || numberOfAliveNeighbors === 3) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (numberOfAliveNeighbors === 3) {
        return 1;
      } else {
        return 0;
      }
    }
  }

  set simulate(expression) {
    this.isRunning = expression;
  }

  get simulate() {
    return this.isRunning;
  }

  compare(
    previousState = this.previousState,
    currentState = this.currentState
  ) {
    return JSON.stringify(previousState) === JSON.stringify(currentState);
  }
}

class HtmlBased extends GameOfLife {
  run() {
    this.newState();
    const currentState = JSON.parse(JSON.stringify(this.currentState));

    for (let i = 0; i < currentState.length; i++) {
      for (let j = 0; j < currentState.length; j++) {
        const currentCol = document.getElementById(getColId(i, j));

        const color = this.getColor(i, j);
        currentCol.setAttribute('style', `background-color: ${color}`);
      }
    }

    this.currentState = currentState;
  }

  draw() {
    const grid = document.getElementById('grid');
    for (let i = 0; i < this.currentState.length; i++) {
      const row = document.createElement('div', { id: 'row' });
      row.setAttribute('class', 'row-');
      for (let j = 0; j < this.currentState.length; j++) {
        const col = document.createElement('div');

        col.setAttribute('class', 'col-');
        col.setAttribute('id', getColId(i, j));
        const color = this.getColor(i, j);

        col.setAttribute('style', `background-color: ${color}`);
        row.appendChild(col);
      }
      grid.appendChild(row);
    }
  }
}

class CanvasBased extends GameOfLife {
  run() {
    this.newState();
    this.draw();
  }

  draw() {
    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState.length; j++) {
        this.ctx.fillStyle =
          this.currentState[i][j] == 0
            ? this.stateColors.dead
            : this.stateColors.alive;

        const [x, y] = [i * 50, j * 50];
        const [width, height] = [20, 20];
        this.ctx.fillRect(x, y, width, height);
      }
    }
  }
}

const htmlGame = new HtmlBased();
const canvasGame = new CanvasBased();

let intervalId = null;

const interval = (game) => {
  if (game.compare()) {
    game.simulate = false;
    window.clearInterval(intervalId);
    game.initializeState();
    return;
  }

  if (game.simulate) {
    game.run();
  }
};

window.onload = () => {
  htmlGame.initializeState();
  htmlGame.draw();

  canvasGame.initializeState();
  canvasGame.draw();

  document.querySelector('#start-html-based').addEventListener('click', () => {
    intervalId = window.setInterval(() => interval(htmlGame), 300);
    htmlGame.simulate = true;
  });

  document.querySelector('#reset-html-based').addEventListener('click', () => {
    htmlGame.simulate = false;
    htmlGame.initializeState();
  });

  document
    .querySelector('#start-canvas-based')
    .addEventListener('click', () => {
      intervalId = window.setInterval(() => interval(canvasGame), 300);
      canvasGame.simulate = true;
    });

  document
    .querySelector('#reset-canvas-based')
    .addEventListener('click', () => {
      canvasGame.simulate = false;
      canvasGame.initializeState();
      canvasGame.draw();
    });
};
