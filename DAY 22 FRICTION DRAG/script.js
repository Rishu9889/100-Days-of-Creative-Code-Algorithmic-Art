const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const pushBtn = document.getElementById("pushBtn");
const resetBtn = document.getElementById("resetBtn");

// Physical constants
const mass = 2;            // kg
const mu = 0.25;           // coefficient of kinetic friction
const g = 9.81;            // gravity
const dragCoeff = 0.02;    // air drag coefficient
const appliedForce = 25;   // N (push force)

// State
let x = 50;
let v = 0;
let a = 0;

// Time
let lastTime = null;

// Controls
pushBtn.addEventListener("click", () => {
  v += appliedForce / mass;
});

resetBtn.addEventListener("click", () => {
  x = 50;
  v = 0;
});

// Main loop
function update(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  applyPhysics(dt);
  draw();

  requestAnimationFrame(update);
}

// Physics engine
function applyPhysics(dt) {
  if (Math.abs(v) < 0.01) {
    v = 0;
    return;
  }

  const frictionForce = mu * mass * g * Math.sign(v);
  const dragForce = dragCoeff * v * v * Math.sign(v);

  const netForce = -frictionForce - dragForce;
  a = netForce / mass;

  v += a * dt;
  x += v * dt * 60;

  if (x < 50) x = 50;
  if (x > canvas.width - 80) x = canvas.width - 80;
}

// Drawing
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ground
  ctx.beginPath();
  ctx.moveTo(0, 220);
  ctx.lineTo(canvas.width, 220);
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 2;
  ctx.stroke();

  // Block
  ctx.fillStyle = "#38bdf8";
  ctx.fillRect(x, 180, 40, 40);

  // Velocity text
  ctx.fillStyle = "#e5e7eb";
  ctx.font = "14px Arial";
  ctx.fillText(`Velocity: ${v.toFixed(2)} m/s`, 20, 30);
}

requestAnimationFrame(update);
