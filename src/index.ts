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
}
