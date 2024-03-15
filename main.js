import { config } from "./src/config.js";
import { Grid } from "./src/grid.js";

let grids = { grid1: null, grid2: null };

const leftId = "left";
const rightId = "right";

const sizeInput = document.getElementById("sizeInput");
const gamesContainer = document.querySelector(".gamesContainer");
const drawButton = document.getElementById("drawButton");
const genButton = document.getElementById("genButton");
const stepButton = document.getElementById("stepButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
sizeInput.value = 30;

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

  const size = sizeInput.value;
  grids.grid1 = new Grid(size, gamesContainer, leftId);
  grids.grid2 = new Grid(size, gamesContainer, rightId);

  grids.grid1.draw();
  grids.grid2.draw();
};

const main = () => {
  makeGrids();

  drawButton.addEventListener("click", () => {
    if (
      grids.grid1 !== null &&
      grids.grid2 !== null &&
      (grids.grid1.isPlaying() || grids.grid2.isPlaying())
    ) {
      return;
    }

    if (!sizeInput.value) {
      alert("Input size first!");
      return;
    }

    makeGrids();
  });

  genButton.addEventListener("click", () => {
    if (grids.grid1 === null || grids.grid2 === null) {
      alert("Draw grid first!");
      return;
    }

    if (grids.grid1.isPlaying() || grids.grid2.isPlaying()) {
      return;
    }

    grids.grid1.regenerateGame();
    grids.grid2.regenerateGame();
  });

  stepButton.addEventListener("click", () => {
    if (grids.grid1 === null || grids.grid2 === null) {
      alert("Draw grid first!");
      return;
    }

    if (grids.grid1.isPlaying() || grids.grid2.isPlaying()) {
      return;
    }

    grids.grid1.stepGame();
    grids.grid2.stepGame();
  });

  startButton.addEventListener("click", () => {
    if (grids.grid1 === null || grids.grid2 === null) {
      alert("Draw grid first!");
      return;
    }

    if (grids.grid1.isPlaying() || grids.grid2.isPlaying()) {
      return;
    }

    grids.grid1.startGame();
    grids.grid2.startGame();

    drawButton.disabled = true;
    genButton.disabled = true;
    stepButton.disabled = true;
    startButton.disabled = true;
  });

  stopButton.addEventListener("click", () => {
    if (grids.grid1 === null || grids.grid2 === null) {
      alert("Draw grid first!");
      return;
    }

    grids.grid1.stopGame();
    grids.grid2.stopGame();

    drawButton.disabled = false;
    genButton.disabled = false;
    stepButton.disabled = false;
    startButton.disabled = false;
  });
};

main();
