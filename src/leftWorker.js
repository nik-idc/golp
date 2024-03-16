// import { GameOfLife } from "./gol.js";
importScripts("./gol.js");

let size = 30;
const id = "left";
let gol = new GameOfLife(size, id);

const remake = (newSize) => {
  size = newSize;
  gol = new GameOfLife(size, id);
  gol.postRows();
};

const getRows = () => {
  gol.postRows();
};

const regenerateGame = () => {
  gol.regenerate();
  gol.postRows();
};

const stepGame = () => {
  gol.step();
  gol.postRows();
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
    case "remake":
      remake(e.data[1]);
      break;
    case "getRows":
      getRows();
      break;
    case "regenerate":
      regenerateGame();
      break;
    case "step":
      stepGame();
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
