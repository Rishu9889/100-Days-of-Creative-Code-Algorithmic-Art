// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Cloth Parameters
// ==================================================

const cols = 30;
const rows = 20;
const spacing = 20;
const gravity = 0.6;
const constraintIterations = 5;

// ==================================================
// Point (Particle) Class
// ==================================================

/*
  Each point represents a small mass in the cloth.
  We use Verlet integration for stability:
  - current position
  - previous position
*/

class Point {
  constructor(x, y, pinned = false) {
    this.pos = { x, y };
    this.prev = { x, y };
    this.pinned = pinned;
  }

  update() {
    if (this.pinned) return;

    const vx = this.pos.x - this.prev.x;
    const vy = this.pos.y - this.prev.y;

    this.prev.x = this.pos.x;
    this.prev.y = this.pos.y;

    this.pos.x += vx;
    this.pos.y += vy + gravity;
  }

  constrain() {
    this.pos.x = Math.max(0, Math.min(canvas.width, this.pos.x));
    this.pos.y = Math.max(0, Math.min(canvas.height, this.pos.y));
  }
}

// ==================================================
// Stick (Constraint) Class
// ==================================================

/*
  A stick enforces a fixed distance between two points.
  This models cloth tension.
*/

class Stick {
  constructor(p1, p2, length) {
    this.p1 = p1;
    this.p2 = p2;
    this.length = length;
  }

  update() {
    const dx = this.p2.pos.x - this.p1.pos.x;
    const dy = this.p2.pos.y - this.p1.pos.y;
    const dist = Math.hypot(dx, dy);
    const diff = (this.length - dist) / dist;

    const offsetX = dx * diff * 0.5;
    const offsetY = dy * diff * 0.5;

    if (!this.p1.pinned) {
      this.p1.pos.x -= offsetX;
      this.p1.pos.y -= offsetY;
    }
    if (!this.p2.pinned) {
      this.p2.pos.x += offsetX;
      this.p2.pos.y += offsetY;
    }
  }
}

// ==================================================
// Build Cloth Grid
// ==================================================

const points = [];
const sticks = [];

// Create points
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    const px = 200 + x * spacing;
    const py = 50 + y * spacing;
    const pinned = y === 0 && x % 3 === 0; // pin top row
    points.push(new Point(px, py, pinned));
  }
}

// Helper to index grid
const index = (x, y) => x + y * cols;

// Create structural sticks
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    if (x < cols - 1) {
      sticks.push(
        new Stick(
          points[index(x, y)],
          points[index(x + 1, y)],
          spacing
        )
      );
    }
    if (y < rows - 1) {
      sticks.push(
        new Stick(
          points[index(x, y)],
          points[index(x, y + 1)],
          spacing
        )
      );
    }
  }
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Update points
  for (let p of points) {
    p.update();
    p.constrain();
  }

  // Relax constraints multiple times for stiffness
  for (let i = 0; i < constraintIterations; i++) {
    for (let s of sticks) {
      s.update();
    }
  }

  // Draw sticks
  ctx.strokeStyle = "#f1faee";
  ctx.beginPath();
  for (let s of sticks) {
    ctx.moveTo(s.p1.pos.x, s.p1.pos.y);
    ctx.lineTo(s.p2.pos.x, s.p2.pos.y);
  }
  ctx.stroke();

  requestAnimationFrame(animate);
}

animate();
