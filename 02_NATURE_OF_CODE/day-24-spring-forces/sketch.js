// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Spring System State
// ==================================================

/*
  We simulate a mass attached to a fixed anchor by a spring.

  Linear motion variables:
  - position
  - velocity
  - acceleration

  Forces acting:
  - gravity
  - spring force (Hooke's Law)
  - damping (energy loss)
*/

const anchor = { x: canvas.width / 2, y: 80 };

const mass = {
  position: { x: canvas.width / 2 + 150, y: 300 },
  velocity: { x: 0, y: 0 },
  acceleration: { x: 0, y: 0 },
  radius: 18,
  mass: 1
};

// Spring parameters
const restLength = 200;   // natural length of spring
const k = 0.02;           // spring stiffness
const damping = 0.98;     // velocity damping

// Gravity force
const gravity = { x: 0, y: 0.6 };

// ==================================================
// Force Application
// ==================================================

function applyForce(force) {
  // a = F / m
  mass.acceleration.x += force.x / mass.mass;
  mass.acceleration.y += force.y / mass.mass;
}

// ==================================================
// Physics Update
// ==================================================

function update() {
  // ------------------------------
  // Gravity
  // ------------------------------
  applyForce(gravity);

  // ------------------------------
  // Spring Force (Hooke's Law)
  // ------------------------------
  /*
    1. Find vector from mass to anchor
    2. Measure current length
    3. Compute stretch = length - restLength
    4. Apply restoring force toward anchor
  */
  const dx = mass.position.x - anchor.x;
  const dy = mass.position.y - anchor.y;

  const distance = Math.hypot(dx, dy);
  const stretch = distance - restLength;

  if (distance !== 0) {
    const springForce = {
      x: -k * stretch * (dx / distance),
      y: -k * stretch * (dy / distance)
    };

    applyForce(springForce);
  }

  // ------------------------------
  // Integrate motion
  // ------------------------------
  mass.velocity.x += mass.acceleration.x;
  mass.velocity.y += mass.acceleration.y;

  // Damping removes energy gradually
  mass.velocity.x *= damping;
  mass.velocity.y *= damping;

  mass.position.x += mass.velocity.x;
  mass.position.y += mass.velocity.y;

  // Reset acceleration
  mass.acceleration.x = 0;
  mass.acceleration.y = 0;
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw spring
  ctx.strokeStyle = "#f1faee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(anchor.x, anchor.y);
  ctx.lineTo(mass.position.x, mass.position.y);
  ctx.stroke();

  // Draw anchor
  ctx.fillStyle = "#f1faee";
  ctx.beginPath();
  ctx.arc(anchor.x, anchor.y, 6, 0, Math.PI * 2);
  ctx.fill();

  // Draw mass
  ctx.fillStyle = "#a8dadc";
  ctx.beginPath();
  ctx.arc(
    mass.position.x,
    mass.position.y,
    mass.radius,
    0,
    Math.PI * 2
  );
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
