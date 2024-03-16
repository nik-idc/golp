import { Grid } from "./src/grid.js";

const sizeInput = document.getElementById("sizeInput");
const gamesContainer = document.querySelector(".gamesContainer");
const genButton = document.getElementById("genButton");
const stepForwardButton = document.getElementById("stepForwardButton");
const stepBackwardButton = document.getElementById("stepBackwardButton");
const startButton = document.getElementById("startButton");
const stopButton = document.getElementById("stopButton");
sizeInput.value = 30;

const leftId = "left";
const rightId = "right";
const leftWorker = new Worker("./src/worker.js");
const rightWorker = new Worker("./src/worker.js");
leftWorker.postMessage(["setId", leftId]);
rightWorker.postMessage(["setId", rightId]);

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

  stepBackwardButton.disabled = true;
};

const main = () => {
  makeGrids();

  genButton.addEventListener("click", () => {
    if (!sizeInput.value) {
      alert("Input size first");
      return;
    }

    if (Number(sizeInput.value) <= 4) {
      alert("Input size too small");
      return;
    }

    makeGrids();
  });

  stepForwardButton.addEventListener("click", () => {
    grid1.stepForwardGame();
    grid2.stepForwardGame();

    stepBackwardButton.disabled = false;
  });

  stepBackwardButton.addEventListener("click", () => {
    grid1.stepBackwardGame();
    grid2.stepBackwardGame();

    stepBackwardButton.disabled = true;
  });

  startButton.addEventListener("click", () => {
    grid1.startGame();
    grid2.startGame();

    genButton.disabled = true;
    stepForwardButton.disabled = true;
    stepBackwardButton.disabled = true;
    startButton.disabled = true;
  });

  stopButton.addEventListener("click", () => {
    grid1.stopGame();
    grid2.stopGame();

    genButton.disabled = false;
    stepForwardButton.disabled = false;
    stepBackwardButton.disabled = false;
    startButton.disabled = false;
  });
};

main();
