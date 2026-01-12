// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Pendulum State
// ==================================================

/*
  A pendulum is described by angular quantities:

  - angle: current angular position (θ)
  - angularVelocity: rate of change of angle (ω)
  - angularAcceleration: change in angular velocity (α)

  Gravity provides the restoring force.
*/

const origin = {
  x: canvas.width / 2,
  y: 100
};

const pendulum = {
  length: 300,
  angle: Math.PI / 4,          // initial angle
  angularVelocity: 0,
  angularAcceleration: 0,
  damping: 0.995               // energy loss over time
};

const gravity = 0.6;

// ==================================================
// Physics Update
// ==================================================

function update() {
  /*
    Angular acceleration for a simple pendulum:

      α = -(g / L) * sin(θ)

    The negative sign ensures the force
    pulls the pendulum back toward equilibrium.
  */
  pendulum.angularAcceleration =
    (-gravity / pendulum.length) * Math.sin(pendulum.angle);

  // Integrate angular motion
  pendulum.angularVelocity += pendulum.angularAcceleration;
  pendulum.angularVelocity *= pendulum.damping; // simulate friction
  pendulum.angle += pendulum.angularVelocity;
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Calculate bob position using polar coordinates
  const bobX =
    origin.x + pendulum.length * Math.sin(pendulum.angle);
  const bobY =
    origin.y + pendulum.length * Math.cos(pendulum.angle);

  // Draw arm
  ctx.strokeStyle = "#f1faee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(bobX, bobY);
  ctx.stroke();

  // Draw bob
  ctx.fillStyle = "#e63946";
  ctx.beginPath();
  ctx.arc(bobX, bobY, 18, 0, Math.PI * 2);
  ctx.fill();

  // Draw pivot
  ctx.fillStyle = "#f1faee";
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 6, 0, Math.PI * 2);
  ctx.fill();
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  update();
  draw();
  requestAnimationFrame(animate);
}

animate();
