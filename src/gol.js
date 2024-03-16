const stepIntervalMs = 100;

class GOLEventArgs {
  constructor(id, data) {
    this.id = id;
    this.data = data;
  }
}

/**
 * Implements the logic of the Game Of Life
 */
class GameOfLife {
  /**
   * Constructs a GameOfLife object
   * @param {number} size Size of the 2d world square
   * @param {string} id Id of the game
   * @param {Worker} worker Worker instance to talk to the main thread
   * @param {number} stepIntervalMs Interval at which to update the game
   */
  constructor(size, id, worker, stepIntervalMs) {
    this.size = size;
    this.id = id;
    this.worker = worker;
    this.stepIntervalMs = stepIntervalMs;

    this.rows = GameOfLife.createRows(this.size, false);
    this.nextRows = GameOfLife.createRows(this.size, false);
    this.isPlaying = false;
    this.intervalId = null;
  }

  static createRows = (size, value) => {
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

  postRows = () => {
    postMessage(["rows", new GOLEventArgs(this.id, { rows: this.rows })]);
  };

  postCellChanged = (row, col, alive) => {
    postMessage([
      "cellChanged",
      new GOLEventArgs(this.id, {
        row: row,
        col: col,
        alive: alive,
      }),
    ]);
  };

  postIsPlayingChanged = () => {
    postMessage([
      "isPlayingChanged",
      new GOLEventArgs(this.id, {
        isPlaying: this.isPlaying,
      }),
    ]);
  };

  /**
   * Regenerates data randomly
   */
  regenerate = () => {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.rows[i][j] = Math.round(Math.random());

        this.postCellChanged(i, j, this.rows[i][j]);
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

    this.postCellChanged(cellRow, cellCol, this.nextRows[cellRow][cellCol]);
  };

  /**
   * Sets the cell's state to alive
   * @param {number} cellRow Cell row
   * @param {number} cellCol Cell col
   */
  birthCell = (cellRow, cellCol) => {
    this.nextRows[cellRow][cellCol] = true;

    this.postCellChanged(cellRow, cellCol, this.nextRows[cellRow][cellCol]);
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
    this.postIsPlayingChanged();

    this.intervalId = setInterval(() => {
      this.step();
    }, stepIntervalMs);
  };

  /**
   * Stop the game
   */
  stop = () => {
    this.isPlaying = false;
    this.postIsPlayingChanged();

    clearInterval(this.intervalId);
  };
}
