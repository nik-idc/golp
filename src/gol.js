import { config } from "./config.js";

const createRows = (size, value) => {
  const rows = [];
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(value);
    }
    rows.push(row);
  }

  return rows;
};

class GOLEventArgs {
  constructor(row, col, id, alive) {
    this.row = row;
    this.col = col;
    this.id = id;
    this.alive = alive;
  }
}

/**
 * Implements the logic of the Game Of Life
 */
export class GameOfLife {
  /**
   * Constructs a GameOfLife object
   * @param {number} size Array of game of life data
   * @param {string} id Id of the game
   */
  constructor(size, id) {
    this.rows = createRows(size, false);
    this.nextRows = JSON.parse(JSON.stringify(this.rows));
    this.size = this.rows.length;

    this.id = id;

    this.isPlaying = false;
    this.intervalId = null;
  }

  /**
   * Regenerates data randomly
   */
  regenerate = () => {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.rows[i][j] = Math.round(Math.random());

        document.dispatchEvent(
          new CustomEvent("cellChanged", {
            detail: new GOLEventArgs(i, j, this.id, this.rows[i][j]),
          })
        );
      }
    }

    this.nextRows = JSON.parse(JSON.stringify(this.rows));
  };

  countNeighbours = (cellRow, cellCol) => {
    let neighbours = 0;
    if (cellRow - 1 >= 0) {
      if (this.rows[cellRow - 1][cellCol] == 1) neighbours++;
    }
    if (cellRow - 1 >= 0 && cellCol - 1 >= 0) {
      if (this.rows[cellRow - 1][cellCol - 1] == 1) neighbours++;
    }
    if (cellRow - 1 >= 0 && cellCol + 1 < this.size) {
      if (this.rows[cellRow - 1][cellCol + 1] == 1) neighbours++;
    }
    if (cellCol - 1 >= 0) {
      if (this.rows[cellRow][cellCol - 1] == 1) neighbours++;
    }
    if (cellCol + 1 < this.size) {
      if (this.rows[cellRow][cellCol + 1] == 1) neighbours++;
    }
    if (cellRow + 1 < this.size) {
      if (this.rows[cellRow + 1][cellCol] == 1) neighbours++;
    }
    if (cellRow + 1 < this.size && cellCol - 1 >= 0) {
      if (this.rows[cellRow + 1][cellCol - 1] == 1) neighbours++;
    }
    if (cellRow + 1 < this.size && cellCol + 1 < this.size) {
      if (this.rows[cellRow + 1][cellCol + 1] == 1) neighbours++;
    }
    return neighbours;
  };

  /**
   * Changes cell state according to the rules of the Game Of Life
   * @param {number} cellRow Cell row
   * @param {number} cellCol Cell col
   */
  changeCellState = (cellRow, cellCol) => {
    const cur = this.rows[cellRow][cellCol];
    const neighbours = this.countNeighbours(cellRow, cellCol);

    if (cur) {
      if (neighbours < 2) {
        this.killCell(cellRow, cellCol);
      }
      if (neighbours === 2 || neighbours === 3) {
        this.birthCell(cellRow, cellCol);
      }
      if (neighbours > 3) {
        this.killCell(cellRow, cellCol);
      }
    } else {
      if (neighbours === 3) {
        this.birthCell(cellRow, cellCol);
      }
    }
  };

  /**
   * Sets the cell's state to dead
   * @param {number} cellRow Cell row
   * @param {number} cellCol Cell col
   */
  killCell = (cellRow, cellCol) => {
    this.nextRows[cellRow][cellCol] = false;

    document.dispatchEvent(
      new CustomEvent("cellChanged", {
        detail: new GOLEventArgs(cellRow, cellCol, this.id, false),
      })
    );
  };

  /**
   * Sets the cell's state to alive
   * @param {number} cellRow Cell row
   * @param {number} cellCol Cell col
   */
  birthCell = (cellRow, cellCol) => {
    this.nextRows[cellRow][cellCol] = true;

    document.dispatchEvent(
      new CustomEvent("cellChanged", {
        detail: new GOLEventArgs(cellRow, cellCol, this.id, true),
      })
    );
  };

  /**
   * Takes one step, i.e. changes the cell of every cell
   */
  step = () => {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.changeCellState(i, j);
      }
    }

    this.rows = JSON.parse(JSON.stringify(this.nextRows));
    this.nextRows = JSON.parse(JSON.stringify(this.rows));
  };

  /**
   * Starts the game - takes one step at a given interval
   */
  restart = () => {
    this.regenerate();
    
    this.start();
  };

  start = () => {
    this.isPlaying = true;
    this.intervalId = setInterval(() => {
      this.step();
    }, config.stepIntervalMs);
  }

  /**
   * Stop the game
   */
  stop = () => {
    this.isPlaying = false;
    clearInterval(this.intervalId);
  };
}
