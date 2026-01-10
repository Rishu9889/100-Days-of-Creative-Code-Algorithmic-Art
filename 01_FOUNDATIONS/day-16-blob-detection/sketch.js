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
  We represent the canvas as a grid of cells.
  Each cell is either:
  - 1 (active / filled)
  - 0 (inactive / empty)
*/

const cellSize = 8;
const cols = Math.floor(canvas.width / cellSize);
const rows = Math.floor(canvas.height / cellSize);

// Random binary grid
const grid = [];
for (let y = 0; y < rows; y++) {
  grid[y] = [];
  for (let x = 0; x < cols; x++) {
    grid[y][x] = Math.random() > 0.6 ? 1 : 0;
  }
}

// Track visited cells
const visited = Array.from({ length: rows }, () =>
  Array(cols).fill(false)
);

// ==================================================
// 🧠 Blob Detection Logic (Flood Fill)
// ==================================================

/*
  Blob detection works by finding connected components.

  Algorithm:
  - Scan every cell
  - When an unvisited active cell is found:
      → start a flood-fill (DFS)
      → mark all connected cells as one blob
*/

// Directions for 4-connected neighbors
const directions = [
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

// Store detected blobs
const blobs = [];

function floodFill(startX, startY) {
  const stack = [[startX, startY]];
  const blob = [];

  while (stack.length > 0) {
    const [x, y] = stack.pop();

    // Bounds check
    if (
      x < 0 || y < 0 ||
      x >= cols || y >= rows
    ) continue;

    // Skip if inactive or already visited
    if (visited[y][x] || grid[y][x] === 0) continue;

    // Mark visited
    visited[y][x] = true;
    blob.push([x, y]);

    // Check neighbors
    for (let [dx, dy] of directions) {
      stack.push([x + dx, y + dy]);
    }
  }

  return blob;
}

// Scan grid for blobs
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (grid[y][x] === 1 && !visited[y][x]) {
      const blob = floodFill(x, y);
      blobs.push(blob);
    }
  }
}

// ==================================================
// 🎨 Render Blobs
// ==================================================

ctx.fillStyle = "#0d0d0d";
ctx.fillRect(0, 0, canvas.width, canvas.height);

blobs.forEach(blob => {
  // Assign a unique color per blob
  const hue = Math.random() * 360;
  ctx.fillStyle = `hsl(${hue}, 70%, 60%)`;

  blob.forEach(([x, y]) => {
    ctx.fillRect(
      x * cellSize,
      y * cellSize,
      cellSize,
      cellSize
    );
  });
});
