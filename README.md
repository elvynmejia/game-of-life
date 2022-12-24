# Inplements Conway's Game of Life in JavaScript

## Run app locally
serves the app using [live-server](https://www.npmjs.com/package/live-server)
```shell
npm run serve
```

To run simulation manually create a new instance of `HtmlBased` or `CanvasBased` then run `game.run();` n times, or in a loop

```javascript
const game = new HtmlBased();
game.initializeState();
game.draw();
```

![alt alt game of life screenshot](https://github.com/elvynmejia/game-of-life/blob/main/ui.png?raw=true)
