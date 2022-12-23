const getValue = () => (Math.random() < 0.4 ? 0 : 1);

class GameOfLife {
  constructor({ rows = 10, cols = 10 } = {}) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');
    this.ctx = ctx;
    this.rows = rows;
    this.cols = cols;
    this.currentState = [];
    this.nextState = [];
    this.isRunning = false;
  }

  initializeState() {
    const rows = [...new Array(this.rows).keys()];
    const cols = [...new Array(this.cols).keys()];
    const currentState = rows.map((current) => {
      return cols.map((i) => getValue());
    });

    this.currentState = currentState;
  }

  draw() {
    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState.length; j++) {
        this.ctx.fillStyle = this.currentState[i][j] == 0 ? 'red' : 'green';
        const [x, y] = [i * 50, j * 50];
        const [width, height] = [20, 20];
        this.ctx.fillRect(x, y, width, height);
      }
    }
  }

  newState() {
    // deep copy
    this.nextState = JSON.parse(JSON.stringify(this.currentState));

    for (let i = 0; i < this.nextState.length; i++) {
      for (let j = 0; j < this.nextState.length; j++) {
        // this.applyRules(i, j);
        console.log(this.applyRules(i, j));
        this.nextState[i][j] = this.applyRules(i, j); //this.isAlive(this.nextState[i][j]) ? 0 : 1;
      }
    }

    this.currentState = this.nextState;
  }

  run() {
    this.newState();
    this.draw();
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
    this.isRunning = expression
  }

  get simulate() {
    return this.isRunning;
  }
}

const game = new GameOfLife();
game.initializeState();
game.draw();

window.onload = () => {
  document.querySelector('#start').addEventListener('click', () => {
    game.simulate = true;
    window.setInterval(() => {
      if (game.simulate) {
        game.run();
      }
    }, 300);
  });

  document.querySelector('#stop').addEventListener('click', () => {
    game.simulate = false;
    game.initializeState();
  });
};
