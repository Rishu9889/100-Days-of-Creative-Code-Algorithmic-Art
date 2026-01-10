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
  Each cell stores an integer:
  - 0  → dead
  - >0 → alive, value represents age
*/

const cellSize = 10;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

// Initialize grid with random ages
let grid = [];
for (let y = 0; y < rows; y++) {
  grid[y] = [];
  for (let x = 0; x < cols; x++) {
    grid[y][x] = Math.random() > 0.7 ? 1 : 0;
  }
}

// ==================================================
// 🧠 Game of Life Logic (with wrapping)
// ==================================================

/*
  We use toroidal wrapping:
  - edges connect to opposite edges
  - simulates an infinite world
*/

function countNeighbors(x, y) {
  let count = 0;

  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;

      const nx = (x + dx + cols) % cols;
      const ny = (y + dy + rows) % rows;

      if (grid[ny][nx] > 0) count++;
    }
  }

  return count;
}

function nextGeneration() {
  const newGrid = [];

  for (let y = 0; y < rows; y++) {
    newGrid[y] = [];
    for (let x = 0; x < cols; x++) {
      const age = grid[y][x];
      const neighbors = countNeighbors(x, y);

      if (age > 0) {
        // Alive cell
        if (neighbors === 2 || neighbors === 3) {
          newGrid[y][x] = age + 1; // survives and ages
        } else {
          newGrid[y][x] = 0; // dies
        }
      } else {
        // Dead cell
        if (neighbors === 3) {
          newGrid[y][x] = 1; // new birth
        } else {
          newGrid[y][x] = 0;
        }
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

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const age = grid[y][x];

      if (age > 0) {
        // Color based on age
        const brightness = Math.min(200, 50 + age * 10);
        ctx.fillStyle = `rgb(${brightness}, ${brightness}, 255)`;

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
