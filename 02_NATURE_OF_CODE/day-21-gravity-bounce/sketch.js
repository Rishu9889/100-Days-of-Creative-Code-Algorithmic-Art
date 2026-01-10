// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Physics State
// ==================================================

/*
  We explicitly model motion using:
  - position
  - velocity
  - acceleration

  This mirrors real-world physics and will
  scale to more complex systems later.
*/

const ball = {
  position: { x: canvas.width / 2, y: 100 },
  velocity: { x: 2, y: 0 },
  acceleration: { x: 0, y: 0 },
  radius: 20,
  mass: 1
};

// Constant gravitational force
const gravity = { x: 0, y: 0.5 };

// ==================================================
// Physics Update
// ==================================================

function applyForce(force) {
  /*
    Newton's Second Law:
      F = m * a  →  a = F / m

    Here mass = 1, so force directly
    becomes acceleration.
  */
  ball.acceleration.x += force.x / ball.mass;
  ball.acceleration.y += force.y / ball.mass;
}

function update() {
  // Apply gravity every frame
  applyForce(gravity);

  // Integrate motion
  ball.velocity.x += ball.acceleration.x;
  ball.velocity.y += ball.acceleration.y;

  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;

  // Reset acceleration after each update
  ball.acceleration.x = 0;
  ball.acceleration.y = 0;

  // Handle floor collision (bounce)
  if (ball.position.y + ball.radius > canvas.height) {
    ball.position.y = canvas.height - ball.radius;
    ball.velocity.y *= -0.9; // energy loss on bounce
  }

  // Side walls
  if (
    ball.position.x - ball.radius < 0 ||
    ball.position.x + ball.radius > canvas.width
  ) {
    ball.velocity.x *= -1;
  }
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#f1faee";
  ctx.beginPath();
  ctx.arc(
    ball.position.x,
    ball.position.y,
    ball.radius,
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
