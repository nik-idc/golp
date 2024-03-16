/**
 * GameOfLife worker event arguments
 */
class GOLEventArgs {
  /**
   * Constructs a GOLEventArgs object
   * @param {number} id GameOfLife instance id
   * @param {Object} data Data object
   */
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
   * @param {string} id GameOfLife instance id
   * @param {number} stepIntervalMs Interval at which to update the game
   */
  constructor(size, id, stepIntervalMs) {
    this.size = size;
    this.id = id;
    this.stepIntervalMs = stepIntervalMs;

    this.prevRows = GameOfLife.createRows(this.size, false);
    this.rows = GameOfLife.createRows(this.size, false);
    this.nextRows = GameOfLife.createRows(this.size, false);
    this.isPlaying = false;
    this.intervalId = null;

    this.regenerate();
  }

  /**
   * Creates GameOfLife grid values
   * @param {number} size Size of the new GameOfLife 2d world square
   * @param {boolean} value Value to fill the grid
   * @returns Created grid values
   */
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

  /**
   * Posts rows to the main thread
   */
  postRows = () => {
    postMessage(["rows", new GOLEventArgs(this.id, { rows: this.rows })]);
  };

  /**
   * Posts new cell data to the main thread
   * @param {number} row Row
   * @param {number} col Column
   * @param {boolean} alive Alive status: true or false
   */
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

  /**
   * Post new isPlaying value
   */
  postIsPlayingChanged = () => {
    postMessage([
      "isPlayingChanged",
      new GOLEventArgs(this.id, {
        isPlaying: this.isPlaying,
      }),
    ]);
  };

  /**
   * Counts neighbours of the cell specified by row and column
   * @param {number} row Cell row
   * @param {number} col Cell column
   * @returns Neighbours count
   */
  countNeighbours = (row, col) => {
    let neighbours = 0;
    if (row - 1 >= 0) {
      if (this.rows[row - 1][col] == 1) neighbours++;
    }
    if (row - 1 >= 0 && col - 1 >= 0) {
      if (this.rows[row - 1][col - 1] == 1) neighbours++;
    }
    if (row - 1 >= 0 && col + 1 < this.size) {
      if (this.rows[row - 1][col + 1] == 1) neighbours++;
    }
    if (col - 1 >= 0) {
      if (this.rows[row][col - 1] == 1) neighbours++;
    }
    if (col + 1 < this.size) {
      if (this.rows[row][col + 1] == 1) neighbours++;
    }
    if (row + 1 < this.size) {
      if (this.rows[row + 1][col] == 1) neighbours++;
    }
    if (row + 1 < this.size && col - 1 >= 0) {
      if (this.rows[row + 1][col - 1] == 1) neighbours++;
    }
    if (row + 1 < this.size && col + 1 < this.size) {
      if (this.rows[row + 1][col + 1] == 1) neighbours++;
    }
    return neighbours;
  };

  /**
   * Changes cell state according to the rules of the Game Of Life
   * @param {number} row Cell row
   * @param {number} col Cell col
   */
  applyRules = (row, col) => {
    const cur = this.rows[row][col];
    const neighbours = this.countNeighbours(row, col);

    if (cur) {
      if (neighbours < 2) {
        this.killCell(row, col);
      }
      if (neighbours === 2 || neighbours === 3) {
        this.birthCell(row, col);
      }
      if (neighbours > 3) {
        this.killCell(row, col);
      }
    } else {
      if (neighbours === 3) {
        this.birthCell(row, col);
      }
    }
  };

  /**
   * Sets the cell's state to dead
   * @param {number} row Cell row
   * @param {number} col Cell col
   */
  killCell = (row, col) => {
    this.nextRows[row][col] = false;

    this.postCellChanged(row, col, this.nextRows[row][col]);
  };

  /**
   * Sets the cell's state to alive
   * @param {number} row Cell row
   * @param {number} col Cell col
   */
  birthCell = (row, col) => {
    this.nextRows[row][col] = true;

    this.postCellChanged(row, col, this.nextRows[row][col]);
  };

  /**
   * Takes one step forward, i.e. applies the rules
   */
  stepForward = () => {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.applyRules(i, j);
      }
    }

    this.prevRows = JSON.parse(JSON.stringify(this.rows));
    this.rows = JSON.parse(JSON.stringify(this.nextRows));
    this.nextRows = JSON.parse(JSON.stringify(this.rows));
  };

  /**
   * Takes one step back, i.e. reverts back to the previous step
   */
  stepBackward = () => {
    for (let i = 0; i < this.size; i++) {
      for (let j = 0; j < this.size; j++) {
        this.rows[i][j] = this.prevRows[i][j];
        this.postCellChanged(i, j, this.rows[i][j]);
      }
    }

    this.rows = JSON.parse(JSON.stringify(this.prevRows));
    this.nextRows = JSON.parse(JSON.stringify(this.rows));
    this.prevRows = JSON.parse(JSON.stringify(this.rows));
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
    this.prevRows = JSON.parse(JSON.stringify(this.rows));
  };

  /**
   * Starts the game
   */
  start = () => {
    this.isPlaying = true;
    this.postIsPlayingChanged();

    this.intervalId = setInterval(() => {
      this.stepForward();
    }, this.stepIntervalMs);
  };

  /**
   * Stops the game
   */
  stop = () => {
    this.isPlaying = false;
    this.postIsPlayingChanged();

    clearInterval(this.intervalId);
  };
}
