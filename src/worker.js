importScripts("./gol.js");

/**
 * Class that handles GameOfLife on the current worker thread
 */
class WorkerGol {
  /**
   * Constructs a WorkerGol object
   * @param {number} size Size of the 2d world square
   * @param {string} id GameOfLife instance id
   * @param {number} stepIntervalMs Interval at which to update the game
   */
  constructor(size, id, stepIntervalMs) {
    this.size = size;
    this.id = id;
    this.stepIntervalMs = stepIntervalMs;

    this.gol = new GameOfLife(this.size, this.id, this.stepIntervalMs);
  }

  /**
   * Sets the GameOfLife instance id and posts current grid to main thread
   * @param {string} newId New GameOfLife instance id
   */
  setId = (newId) => {
    this.id = newId;
    this.gol = new GameOfLife(this.size, this.id, this.stepIntervalMs);
    this.gol.postRows();
  };

  /**
   * Sets the grid size and posts current grid to main thread
   * @param {number} newSize New GameOfLife grid size
   */
  changeSize = (newSize) => {
    this.size = newSize;
    this.gol = new GameOfLife(this.size, this.id, this.stepIntervalMs);
    this.gol.postRows();
  };

  /**
   * Posts current grid to main thread
   */
  getRows = () => {
    this.gol.postRows();
  };

  /**
   * Regenerates the game and posts current grid to main thread
   */
  regenerateGame = () => {
    this.gol.regenerate();
    this.gol.postRows();
  };

  /**
   * Takes step forward
   */
  stepForwardGame = () => {
    this.gol.stepForward();
  };

  /**
   * Takes step backward
   */
  stepBackwardGame = () => {
    this.gol.stepBackward();
  };

  /**
   * Starts the game
   */
  startGame = () => {
    this.gol.start();
  };

  /**
   * Stops the game
   */
  stopGame = () => {
    this.gol.stop();
  };
}

const workerGol = new WorkerGol(30, "left", 100);

onmessage = function (e) {
  switch (e.data[0]) {
    case "setId":
      workerGol.setId(e.data[1]);
      break;
    case "changeSize":
      workerGol.changeSize(e.data[1]);
      break;
    case "getRows":
      workerGol.getRows();
      break;
    case "regenerate":
      workerGol.regenerateGame();
      break;
    case "stepForward":
      workerGol.stepForwardGame();
      break;
    case "stepBackward":
      workerGol.stepBackwardGame();
      break;
    case "start":
      workerGol.startGame();
      break;
    case "stop":
      workerGol.stopGame();
      break;
    default:
      break;
  }
};
