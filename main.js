import { Grid } from "./src/grid.js";

// Get all controls from the DOM
const sizeInput = document.getElementById("sizeInput");
const gamesContainer = document.querySelector(".gamesContainer");
const genButton = document.getElementById("genButton");
const stepForwardButton = document.getElementById("stepForwardButton");
const stepBackwardButton = document.getElementById("stepBackwardButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
sizeInput.value = 25;

// Create workers
const leftId = "left";
const middleId = "middle";
const rightId = "right";
const leftWorker = new Worker("./src/worker.js");
const middleWorker = new Worker("./src/worker.js");
const rightWorker = new Worker("./src/worker.js");
leftWorker.postMessage(["setId", leftId]);
middleWorker.postMessage(["setId", middleId]);
rightWorker.postMessage(["setId", rightId]);
let grid1 = null;
let grid2 = null;
let grid3 = null;

// Min and max grid sizes
const minSize = 4;
const maxSize = 75;

/**
 * Removes tables
 */
const removePrevTables = () => {
  const leftTable = document.getElementById(leftId);
  const middleTable = document.getElementById(middleId);
  const rightTable = document.getElementById(rightId);
  if (leftTable) {
    gamesContainer.removeChild(leftTable);
  }
  if (middleTable) {
    gamesContainer.removeChild(middleTable);
  }
  if (rightTable) {
    gamesContainer.removeChild(rightTable);
  }
};

/**
 * Re/makes the grids
 */
const makeGrids = () => {
  removePrevTables();

  grid1 = new Grid(sizeInput.value, gamesContainer, leftId, leftWorker);
  grid2 = new Grid(sizeInput.value, gamesContainer, middleId, middleWorker);
  grid3 = new Grid(sizeInput.value, gamesContainer, rightId, rightWorker);

  stepBackwardButton.disabled = true;
};

/**
 * Main function
 */
const main = () => {
  makeGrids();

  genButton.addEventListener("click", () => {
    if (!sizeInput.value) {
      alert("Input size first");
      return;
    }

    if (Math.floor(Number(sizeInput.value)) <= minSize) {
      alert("Input size too small");
      return;
    }

    if (Math.floor(Number(sizeInput.value)) >= maxSize) {
      alert("Input size too big");
      return;
    }

    makeGrids();
  });

  stepForwardButton.addEventListener("click", () => {
    grid1.stepForwardGame();
    grid2.stepForwardGame();
    grid3.stepForwardGame();

    stepBackwardButton.disabled = false;
  });

  stepBackwardButton.addEventListener("click", () => {
    grid1.stepBackwardGame();
    grid2.stepBackwardGame();
    grid3.stepBackwardGame();

    stepBackwardButton.disabled = true;
  });

  startButton.addEventListener("click", () => {
    grid1.startGame();
    grid2.startGame();
    grid3.startGame();

    genButton.disabled = true;
    stepForwardButton.disabled = true;
    stepBackwardButton.disabled = true;
    startButton.disabled = true;
  });

  stopButton.addEventListener("click", () => {
    grid1.stopGame();
    grid2.stopGame();
    grid3.stopGame();

    genButton.disabled = false;
    stepForwardButton.disabled = false;
    stepBackwardButton.disabled = false;
    startButton.disabled = false;
  });
};

main();
