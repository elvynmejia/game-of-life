import {
  getValue,
  getColId
} from './utils'

class GameOfLife {
  ctx: any;
  rows: number;
  cols: number;
  currentState: number[][];
  nextState: number[][];
  previousState: number[][];
  isRunning: boolean;
  stateColors: {
    dead: string;
    alive: string;
  };

  constructor({ rows = 10, cols = 10 } = {}) {
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');
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

  draw () {
    throw new Error('Must implement');
  }

  run() {
    throw new Error('Must implement');
  }

  initializeState() {
    const rows = [...new Array(this.rows).keys()];
    const cols = [...new Array(this.cols).keys()];
    const currentState = rows.map((current) => {
      return cols.map((i) => getValue());
    });

    this.currentState = JSON.parse(JSON.stringify(currentState));
  }

  getColor(i: number, j: number): string {
    return this.currentState[i][j] === 0
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

  applyRules(i: number, j: number): number {
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

  countAliveNeighbors(currentRow: number, currentCol: number): number {
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

  isAlive(value: number): boolean {
    return value === 1 ? true : false;
  }
}
