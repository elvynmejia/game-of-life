import HtmlBased from './htmlGame';
import CanvasBased from './canvasGame';

const htmlGame = new HtmlBased();
const canvasGame = new CanvasBased();

let intervalId: number;

const interval = (game: HtmlBased | CanvasBased) => {
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

  const startHtmlBasedButton = document.querySelector('#start-html-based');
  const resetHtmlBasedButton = document.querySelector('#reset-html-based');

  const startCanvasBasedButton = document.querySelector('#start-canvas-based');
  const resetCanvasBasedButton = document.querySelector('#reset-canvas-based');

  if (startHtmlBasedButton) {
    startHtmlBasedButton.addEventListener('click', () => {
      intervalId = window.setInterval(() => interval(htmlGame), 300);
      htmlGame.simulate = true;
    });
  }

  if (resetHtmlBasedButton) {
    resetHtmlBasedButton.addEventListener('click', () => {
      htmlGame.simulate = false;
      htmlGame.initializeState();
    });
  }


  if (startCanvasBasedButton) {
      startCanvasBasedButton.addEventListener('click', () => {
          intervalId = window.setInterval(() => interval(canvasGame), 300);
          canvasGame.simulate = true;
        });
  }

  if (resetCanvasBasedButton) {
    resetCanvasBasedButton
      .addEventListener('click', () => {
        canvasGame.simulate = false;
        canvasGame.initializeState();
        canvasGame.draw();
      });
  }
};
