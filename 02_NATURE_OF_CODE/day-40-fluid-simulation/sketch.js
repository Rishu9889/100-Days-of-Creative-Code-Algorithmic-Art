// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Fluid Grid Parameters
// ==================================================

/*
  We discretize space into a grid.
  Each cell stores:
  - velocity (vx, vy)
  - dye (color intensity)
*/

const scale = 10; // size of each grid cell
const cols = Math.floor(canvas.width / scale);
const rows = Math.floor(canvas.height / scale);

// Fluid fields
const vx = new Array(cols * rows).fill(0);
const vy = new Array(cols * rows).fill(0);
const dye = new Array(cols * rows).fill(0);

// ==================================================
// Helper Functions
// ==================================================

function index(x, y) {
  return x + y * cols;
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ==================================================
// Add Forces (Mouse Interaction)
// ==================================================

canvas.addEventListener("mousemove", e => {
  const x = Math.floor(e.clientX / scale);
  const y = Math.floor(e.clientY / scale);

  if (x > 1 && x < cols - 1 && y > 1 && y < rows - 1) {
    const i = index(x, y);

    // Inject velocity and dye
    vx[i] += (Math.random() - 0.5) * 2;
    vy[i] += (Math.random() - 0.5) * 2;
    dye[i] = 255;
  }
});

// ==================================================
// Fluid Update
// ==================================================

function step() {
  /*
    Advection:
    Move dye through the velocity field
  */
  const newDye = dye.slice();

  for (let y = 1; y < rows - 1; y++) {
    for (let x = 1; x < cols - 1; x++) {
      const i = index(x, y);

      // Trace backward
      const backX = clamp(
        x - vx[i] * 0.2,
        0,
        cols - 1
      );
      const backY = clamp(
        y - vy[i] * 0.2,
        0,
        rows - 1
      );

      const bi = index(
        Math.floor(backX),
        Math.floor(backY)
      );

      newDye[i] = dye[bi] * 0.99; // fade
    }
  }

  for (let i = 0; i < dye.length; i++) {
    dye[i] = newDye[i];
  }
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const d = dye[index(x, y)];
      if (d > 1) {
        ctx.fillStyle = `rgb(${d}, ${d * 0.6}, 255)`;
        ctx.fillRect(
          x * scale,
          y * scale,
          scale,
          scale
        );
      }
    }
  }
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  step();
  draw();
  requestAnimationFrame(animate);
}

animate();
