export class Grid {
  /**
   * Constructs a GameOfLife object
   * @param {number} size Size of the grid square
   * @param {HTMLDivElement} container Container for the table
   * @param {number} id GameOfLife instance id
   * @param {Worker} worker Worker object
   */
  constructor(size, container, id, worker) {
    this.size = size;
    this.container = container;
    this.id = id;
    this.worker = worker;

    this.rows = null;
    this.isPlaying = false;
    this.worker.onmessage = this.onWorkerMessage;
    this.clearDom();
    this.changeSize();
  }

  /**
   * Reacts to rows received
   * @param {Object} eventArgs Event arguments
   * @param {number} eventArgs.id GameOfLife instance id
   * @param {Object} eventArgs.data Event data
   * @param {boolean[][]} eventArgs.data.rows GameOfLife instance rows
   */
  onRowsReceived = (eventArgs) => {
    if (eventArgs.id === this.id) {
      this.rows = JSON.parse(JSON.stringify(eventArgs.data.rows));
      this.draw();
    }
  };

  /**
   * Reacts to rows received
   * @param {Object} eventArgs Event arguments
   * @param {number} eventArgs.id GameOfLife instance id
   * @param {Object} eventArgs.data Event data
   * @param {boolean} eventArgs.data.isPlaying GameOfLife instance playing state
   */
  onIsPlayingChanged = (eventArgs) => {
    if (eventArgs.id === this.id) {
      this.isPlaying = eventArgs.data.isPlaying;
    }
  };

  /**
   * Reacts to rows received
   * @param {Object} eventArgs Event arguments
   * @param {number} eventArgs.id GameOfLife instance id
   * @param {Object} eventArgs.data Event data
   * @param {number} eventArgs.data.row Cell row
   * @param {number} eventArgs.data.col Cell col
   * @param {boolean} eventArgs.data.alive Cell alive status
   */
  onCellChanged = (eventArgs) => {
    if (eventArgs.id !== this.id) {
      return;
    }

    const cell = document.getElementById(
      `c:${eventArgs.data.row}:${eventArgs.data.col}:${this.id}`
    );
    if (cell !== null) {
      if (eventArgs.data.alive) {
        cell.setAttribute("class", "alive");
      } else {
        cell.setAttribute("class", "dead");
      }
    }
  };

  /**
   * Reacts to worker message
   * @param {Object} message Worker message
   * @param {[string, Object]} message.data Message data
   */
  onWorkerMessage = (message) => {
    const type = message.data[0];
    const data = message.data[1];

    switch (type) {
      case "rows":
        this.onRowsReceived(data);
        break;
      case "isPlayingChanged":
        this.onIsPlayingChanged(data);
        break;
      case "cellChanged":
        this.onCellChanged(data);
      default:
        break;
    }
  };

  /**
   * Clears the table from the DOM
   */
  clearDom = () => {
    if (this.table) {
      this.container.removeChild(this.table);
    }

    this.table = document.createElement("table");
    this.table.setAttribute("id", this.id);
    this.container.appendChild(this.table);
  };

  /**
   * Post message to worker to remake the game
   * (remake - recreate GameOfLife instance with new size)
   * (regenerate) - keep the same instance but regenerate the cells
   */
  changeSize = () => {
    this.worker.postMessage(["changeSize", this.size]);
  };

  /**
   * Draws the grid using the HTML table
   */
  draw = () => {
    this.clearDom();

    for (let i = 0; i < this.size; i++) {
      const tr = document.createElement("tr");
      tr.setAttribute("id", `r:${i}:${this.id}`);
      for (let j = 0; j < this.size; j++) {
        const td = document.createElement("td");
        td.setAttribute("id", `c:${i}:${j}:${this.id}`);
        if (this.rows[i][j]) {
          td.setAttribute("class", "alive");
        } else {
          td.setAttribute("class", "dead");
        }
        tr.appendChild(td);
      }

      this.table.appendChild(tr);
    }
  };

  /**
   * Post message to worker to regenerate the game
   * (remake - recreate GameOfLife instance with new size)
   * (regenerate) - keep the same instance but regenerate the cells
   */
  regenerateGame = () => {
    this.worker.postMessage(["regenerate"]);
  };

  /**
   * Take a step forward in the game
   */
  stepForwardGame = () => {
    this.worker.postMessage(["stepForward"]);
  };

  /**
   * Take a step forward in the game
   */
  stepBackwardGame = () => {
    this.worker.postMessage(["stepBackward"]);
  };

  /**
   * Start the game
   */
  startGame = () => {
    this.worker.postMessage(["start"]);
  };

  /**
   * Stop the game
   */
  stopGame = () => {
    this.worker.postMessage(["stop"]);
  };
}
