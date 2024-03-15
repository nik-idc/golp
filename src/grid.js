import { config } from "./config.js";
import { GameOfLife } from "./gol.js";

export class Grid {
  /**
   *
   * @param {number} size
   * @param {HTMLDivElement} container
   */
  constructor(size, container, id) {
    this.size = size;
    this.container = container;
    this.id = id;

    this.clear();
    this.gol = new GameOfLife(this.size, this.id);

    document.addEventListener("cellChanged", this.onCellChanged);
  }

  clear = () => {
    if (this.table) {
      this.container.removeChild(this.table);
    }

    this.table = document.createElement("table");
    this.table.setAttribute("id", this.id);
    this.container.appendChild(this.table);
  };

  /**
   * Draws the grid using the HTML table
   */
  draw = () => {
    this.clear();

    for (let i = 0; i < this.size; i++) {
      const tr = document.createElement("tr");
      tr.setAttribute("id", `r${i}`);
      for (let j = 0; j < this.size; j++) {
        const td = document.createElement("td");
        td.setAttribute("id", `${i}:${j}:${this.id}`);
        if (this.gol.rows[i][j]) {
          td.setAttribute("class", "alive");
        } else {
          td.setAttribute("class", "dead");
        }
        tr.appendChild(td);
      }

      this.table.appendChild(tr);
    }
  };

  onCellChanged = (event) => {
    if (event.detail.id !== this.id) {
      return;
    }

    const cell = document.getElementById(
      `${event.detail.row}:${event.detail.col}:${this.id}`
    );
    if (event.detail.alive) {
      cell.setAttribute("class", "alive");
    } else {
      cell.setAttribute("class", "dead");
    }
  };

  isPlaying = () => {
    return this.gol.isPlaying;
  }

  regenerateGame = () => {
    this.gol.regenerate();
  };

  stepGame = () => {
    this.gol.step();
  };

  startGame = () => {
    this.gol.start();
  };

  restartGame = () => {
    this.gol.restart();
  };

  stopGame = () => {
    this.gol.stop();
  };
}

export const makeGrids = () => {
  const size = config.size;

  const leftTable = document.getElementById("left");
  const rightTable = document.getElementById("right");

  const grid1 = new Grid(size, size, leftTable);
  const grid2 = new Grid(size, size, rightTable);

  grid1.draw();
  grid2.draw();
};
