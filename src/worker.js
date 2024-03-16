importScripts("./gol.js");

let size = 30;
let id = "left";
const stepIntervalMs = 100;
let gol = new GameOfLife(size, id, stepIntervalMs);

const setId = (newId) => {
  id = newId;
  gol = new GameOfLife(size, id, stepIntervalMs);
  gol.postRows();
};

const remake = (newSize) => {
  size = newSize;
  gol = new GameOfLife(size, id, stepIntervalMs);
  gol.postRows();
};

const getRows = () => {
  gol.postRows();
};

const regenerateGame = () => {
  gol.regenerate();
  gol.postRows();
};

const stepForwardGame = () => {
  gol.stepForward();
};

const stepBackwardGame = () => {
  gol.stepBackward();
};

const startGame = () => {
  gol.start();
};

const restartGame = () => {
  gol.restart();
};

const stopGame = () => {
  gol.stop();
};

onmessage = function (e) {
  switch (e.data[0]) {
    case "setId":
      setId(e.data[1]);
      break;
    case "remake":
      remake(e.data[1]);
      break;
    case "getRows":
      getRows();
      break;
    case "regenerate":
      regenerateGame();
      break;
    case "stepForward":
      stepForwardGame();
      break;
    case "stepBackward":
      stepBackwardGame();
      break;
    case "start":
      startGame();
      break;
    case "restart":
      restartGame();
      break;
    case "stop":
      stopGame();
      break;
    default:
      break;
  }
};
