// Get canvas and drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Size of each cell in the flow field grid
const scale = 20;

// Number of columns and rows in the grid
const cols = Math.floor(canvas.width / scale);
const rows = Math.floor(canvas.height / scale);

// Array to store flow field angles
const flowField = [];

// Simple noise function to generate smooth directional values
// This acts as a lightweight alternative to Perlin noise
function noise(x, y) {
  return Math.sin(x * 0.1) + Math.cos(y * 0.1);
}

// Generate the flow field by assigning an angle to each grid cell
function generateFlowField() {
  let yOffset = 0;

  for (let y = 0; y < rows; y++) {
    let xOffset = 0;

    for (let x = 0; x < cols; x++) {
      // Convert noise value into an angle
      const angle = noise(xOffset, yOffset) * Math.PI * 2;
      flowField[y * cols + x] = angle;

      xOffset += 0.1;
    }
    yOffset += 0.1;
  }
}

// Particle class that follows the flow field
class Particle {
  constructor() {
    // Start particle at a random position
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;

    // Velocity components
    this.vx = 0;
    this.vy = 0;
  }

  // Update velocity based on flow field direction
  follow() {
    const x = Math.floor(this.x / scale);
    const y = Math.floor(this.y / scale);
    const index = y * cols + x;

    const angle = flowField[index];

    // Apply force in the direction of the vector
    this.vx += Math.cos(angle) * 0.1;
    this.vy += Math.sin(angle) * 0.1;
  }

  // Update particle position
  update() {
    this.x += this.vx;
    this.y += this.vy;

    // Slightly reduce velocity for smoother motion
    this.vx *= 0.95;
    this.vy *= 0.95;

    // Wrap around canvas edges
    if (this.x < 0) this.x = canvas.width;
    if (this.x > canvas.width) this.x = 0;
    if (this.y < 0) this.y = canvas.height;
    if (this.y > canvas.height) this.y = 0;
  }

  // Draw particle as a small point
  draw() {
    ctx.fillStyle = "rgba(255, 255, 255, 0.09)";
    ctx.fillRect(this.x, this.y, 1, 1);
  }
}

// Create multiple particles
const particles = [];
for (let i = 0; i < 1000; i++) {
  particles.push(new Particle());
}

// Clear background once
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Animation loop
function animate() {
  // Generate the flow field for current frame
  generateFlowField();

  // Update and draw each particle
  for (let p of particles) {
    p.follow();
    p.update();
    p.draw();
  }

  requestAnimationFrame(animate);
}

// Start animation
animate();
