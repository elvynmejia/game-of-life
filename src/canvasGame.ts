import GameOfLife from './base';

class CanvasBased extends GameOfLife {
  constructor(options = {}) {
    super(options);
    const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    const ctx = canvas?.getContext('2d');
    this.ctx = ctx;
  }

  run() {
    this.newState();
    this.draw();
  }

  draw() {
    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState.length; j++) {
        this.ctx.fillStyle = this.getColor(i, j);
        const [x, y] = [i * 50, j * 50];
        const [width, height] = [20, 20];
        this.ctx.fillRect(x, y, width, height);
      }
    }
  }
}
 export default CanvasBased;
