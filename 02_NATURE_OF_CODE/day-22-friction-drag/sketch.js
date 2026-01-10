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
  Motion is modeled using Newtonian mechanics:

  - position: where the object is
  - velocity: how fast it is moving
  - acceleration: how forces change velocity

  Forces accumulate into acceleration,
  acceleration integrates into velocity,
  velocity integrates into position.
*/

const ball = {
  position: { x: canvas.width / 2, y: 100 },
  velocity: { x: 4, y: 0 },
  acceleration: { x: 0, y: 0 },
  radius: 18,
  mass: 1
};

// ==================================================
// Forces & Coefficients
// ==================================================

// Constant gravitational force (downward)
const gravity = { x: 0, y: 0.6 };

// Tuned coefficients for gradual energy loss
const frictionCoefficient = 0.01; // surface friction
const dragCoefficient = 0.002;    // air resistance

// ==================================================
// Force Application
// ==================================================

function applyForce(force) {
  /*
    Newton's Second Law:
      F = m * a  →  a = F / m

    Since mass = 1, force directly
    contributes to acceleration.
  */
  ball.acceleration.x += force.x / ball.mass;
  ball.acceleration.y += force.y / ball.mass;
}

// ==================================================
// Physics Update
// ==================================================

function update() {
  // ------------------------------
  // Gravity (always active)
  // ------------------------------
  applyForce(gravity);

  // ------------------------------
  // Drag Force (air resistance)
  // ------------------------------
  /*
    Drag:
    - acts opposite to velocity
    - magnitude proportional to speed²
  */
  const speed = Math.hypot(ball.velocity.x, ball.velocity.y);

  if (speed > 0) {
    const dragMagnitude = dragCoefficient * speed * speed;

    const dragForce = {
      x: -ball.velocity.x / speed * dragMagnitude,
      y: -ball.velocity.y / speed * dragMagnitude
    };

    applyForce(dragForce);
  }

  // ------------------------------
  // Integrate motion
  // ------------------------------
  ball.velocity.x += ball.acceleration.x;
  ball.velocity.y += ball.acceleration.y;

  ball.position.x += ball.velocity.x;
  ball.position.y += ball.velocity.y;

  // Reset acceleration after each frame
  ball.acceleration.x = 0;
  ball.acceleration.y = 0;

  // ------------------------------
  // Floor collision + friction
  // ------------------------------
  if (ball.position.y + ball.radius > canvas.height) {
    ball.position.y = canvas.height - ball.radius;

    // Bounce with mild energy loss (multiple bounces)
    ball.velocity.y *= -0.85;

    /*
      Apply friction ONLY when the ball
      is nearly done bouncing vertically.
      This simulates rolling friction.
    */
    if (Math.abs(ball.velocity.y) < 1) {
      const frictionDirection = Math.sign(ball.velocity.x);
      const frictionForce = {
        x: -frictionDirection * frictionCoefficient,
        y: 0
      };

      applyForce(frictionForce);
    }
  }

  // ------------------------------
  // Wall collisions
  // ------------------------------
  if (
    ball.position.x - ball.radius < 0 ||
    ball.position.x + ball.radius > canvas.width
  ) {
    ball.velocity.x *= -1;
  }

  // ------------------------------
  // Velocity cleanup (prevent jitter)
  // ------------------------------
  if (Math.abs(ball.velocity.x) < 0.01) ball.velocity.x = 0;
  if (Math.abs(ball.velocity.y) < 0.01) ball.velocity.y = 0;
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#e9c46a";
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
