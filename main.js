import { Grid } from "./src/grid.js";

const sizeInput = document.getElementById("sizeInput");
const gamesContainer = document.querySelector(".gamesContainer");
const drawButton = document.getElementById("drawButton");
const genButton = document.getElementById("genButton");
const stepButton = document.getElementById("stepButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
sizeInput.value = 30;

const leftId = "left";
const rightId = "right";
const leftWorker = new Worker("./src/leftWorker.js");
const rightWorker = new Worker("./src/rightWorker.js");

let grid1 = new Grid(sizeInput.value, gamesContainer, leftId, leftWorker);
let grid2 = new Grid(sizeInput.value, gamesContainer, rightId, rightWorker);

const removePrevTables = () => {
  const leftTable = document.getElementById(leftId);
  const rightTable = document.getElementById(rightId);
  if (leftTable) {
    gamesContainer.removeChild(leftTable);
  }
  if (rightTable) {
    gamesContainer.removeChild(rightTable);
  }
};

const makeGrids = () => {
  removePrevTables();

  grid1 = new Grid(sizeInput.value, gamesContainer, leftId, leftWorker);
  grid2 = new Grid(sizeInput.value, gamesContainer, rightId, rightWorker);

  grid1.remake();
  grid2.remake();
};

const main = () => {
  makeGrids();

  drawButton.addEventListener("click", () => {
    if (!sizeInput.value) {
      alert("Input size first!");
      return;
    }

    makeGrids();
  });

  genButton.addEventListener("click", () => {
    grid1.regenerateGame();
    grid2.regenerateGame();
  });

  stepButton.addEventListener("click", () => {
    grid1.stepGame();
    grid2.stepGame();
  });

  startButton.addEventListener("click", () => {
    grid1.startGame();
    grid2.startGame();

    drawButton.disabled = true;
    genButton.disabled = true;
    stepButton.disabled = true;
    startButton.disabled = true;
  });

  stopButton.addEventListener("click", () => {
    grid1.stopGame();
    grid2.stopGame();

    drawButton.disabled = false;
    genButton.disabled = false;
    stepButton.disabled = false;
    startButton.disabled = false;
  });
};

main();
