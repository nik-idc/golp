export class Grid {
  /**
   *
   * @param {*} size
   * @param {*} container
   * @param {*} id
   * @param {Worker} worker
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
  }

  onRowsReceived = (eventArgs) => {
    if (eventArgs.id === this.id) {
      this.rows = JSON.parse(JSON.stringify(eventArgs.data.rows));
      this.draw();
    }
  };

  onIsPlayingChanged = (eventArgs) => {
    if (eventArgs.id === this.id) {
      this.isPlaying = eventArgs.data.isPlaying;
    }
  };

  onCellChanged = (eventArgs) => {
    if (eventArgs.id !== this.id) {
      return;
    }

    const cell = document.getElementById(
      `c:${eventArgs.data.row}:${eventArgs.data.col}:${this.id}`
    );
    if (eventArgs.data.alive) {
      cell.setAttribute("class", "alive");
    } else {
      cell.setAttribute("class", "dead");
    }
  };

  onWorkerMessage = (e) => {
    const message = e.data[0];
    switch (message) {
      case "rows":
        this.onRowsReceived(e.data[1]);
        break;
      case "isPlayingChanged":
        this.onIsPlayingChanged(e.data[1]);
        break;
      case "cellChanged":
        this.onCellChanged(e.data[1]);
      default:
        break;
    }
  };

  clearDom = () => {
    if (this.table) {
      this.container.removeChild(this.table);
    }

    this.table = document.createElement("table");
    this.table.setAttribute("id", this.id);
    this.container.appendChild(this.table);
  };

  remake = () => {
    this.worker.postMessage(["remake", this.size]);
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

  regenerateGame = () => {
    this.worker.postMessage(["regenerate"]);
  };

  stepGame = () => {
    this.worker.postMessage(["step"]);
  };

  startGame = () => {
    this.worker.postMessage(["start"]);
  };

  restartGame = () => {
    this.worker.postMessage(["restart"]);
  };

  stopGame = () => {
    this.worker.postMessage(["stop"]);
  };
}
