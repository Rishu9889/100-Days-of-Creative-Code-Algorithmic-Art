// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const scale = 4; // size of each cell (pixelated look)
const cols = Math.floor(window.innerWidth / scale);
const rows = Math.floor(window.innerHeight / scale);

canvas.width = cols * scale;
canvas.height = rows * scale;

// ==================================================
// Sandpile Grid
// ==================================================

/*
  Each cell stores an integer number of grains.

  Rule:
  - If grains >= 4 → topple
  - Lose 4 grains
  - Give 1 grain to each neighbor
*/

let grid = new Array(cols * rows).fill(0);

// Start by dumping sand in the center
const center = Math.floor(cols / 2) + Math.floor(rows / 2) * cols;
grid[center] = 100000;

// ==================================================
// Helper
// ==================================================

function index(x, y) {
  return x + y * cols;
}

// ==================================================
// Sandpile Update
// ==================================================

function topple() {
  let unstable = true;

  // Continue until system stabilizes
  while (unstable) {
    unstable = false;
    const next = grid.slice();

    for (let y = 1; y < rows - 1; y++) {
      for (let x = 1; x < cols - 1; x++) {
        const i = index(x, y);

        if (grid[i] >= 4) {
          unstable = true;

          next[i] -= 4;
          next[index(x + 1, y)] += 1;
          next[index(x - 1, y)] += 1;
          next[index(x, y + 1)] += 1;
          next[index(x, y - 1)] += 1;
        }
      }
    }

    grid = next;
  }
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  const imageData = ctx.createImageData(canvas.width, canvas.height);
  const data = imageData.data;

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const value = grid[index(x, y)];
      let r = 0, g = 0, b = 0;

      /*
        Color by grain count.
        These patterns reveal
        self-organized criticality.
      */
      if (value === 1) b = 255;
      else if (value === 2) g = 255;
      else if (value === 3) r = 255;
      else if (value >= 4) {
        r = 255;
        g = 255;
      }

      for (let dy = 0; dy < scale; dy++) {
        for (let dx = 0; dx < scale; dx++) {
          const px =
            ((y * scale + dy) * canvas.width +
              (x * scale + dx)) *
            4;

          data[px] = r;
          data[px + 1] = g;
          data[px + 2] = b;
          data[px + 3] = 255;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  topple();
  draw();
  requestAnimationFrame(animate);
}

animate();
