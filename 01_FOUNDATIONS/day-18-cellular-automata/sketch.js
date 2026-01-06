// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// 🧩 Grid Setup
// ==================================================

/*
  We represent the world as a 2D grid.
  Each cell can be:
  - 1 (alive)
  - 0 (dead)
*/

const cellSize = 10;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

// Initialize grid with random states
let grid = createGrid();

// Helper: create random grid
function createGrid() {
  const arr = [];
  for (let y = 0; y < rows; y++) {
    arr[y] = [];
    for (let x = 0; x < cols; x++) {
      arr[y][x] = Math.random() > 0.7 ? 1 : 0;
    }
  }
  return arr;
}

// ==================================================
// 🧠 Cellular Automaton Logic (Game of Life)
// ==================================================

/*
  Each generation is computed from the previous one.
  We never update the grid in-place — instead we
  compute a new grid based on neighbor counts.
*/

function countNeighbors(x, y) {
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = x + dx;
      const ny = y + dy;

      if (nx >= 0 && ny >= 0 && nx < cols && ny < rows) {
        count += grid[ny][nx];
      }
    }
  }

  return count;
}

function nextGeneration() {
  const newGrid = [];

  for (let y = 0; y < rows; y++) {
    newGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      const state = grid[y][x];
      const neighbors = countNeighbors(x, y);

      // Apply Game of Life rules
      if (state === 1 && (neighbors < 2 || neighbors > 3)) {
        newGrid[y][x] = 0;
      } else if (state === 0 && neighbors === 3) {
        newGrid[y][x] = 1;
      } else {
        newGrid[y][x] = state;
      }
    }
  }

  grid = newGrid;
}

// ==================================================
// 🎨 Rendering + Animation
// ==================================================

function draw() {
  ctx.fillStyle = "#0b0b0b";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#90dbf4";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      if (grid[y][x] === 1) {
        ctx.fillRect(
          x * cellSize,
          y * cellSize,
          cellSize,
          cellSize
        );
      }
    }
  }

  nextGeneration();
  requestAnimationFrame(draw);
}

// Start simulation
draw();
