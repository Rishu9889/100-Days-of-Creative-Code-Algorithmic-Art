// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Particle Class
// ==================================================

/*
  Each particle represents a small piece of fire.

  Fire behavior:
  - born near the bottom
  - initial upward velocity
  - horizontal randomness
  - fades and disappears
*/

class Particle {
  constructor(x, y) {
    this.position = { x, y };

    // Wider horizontal spread + stronger upward push
    this.velocity = {
      x: (Math.random() - 0.5) * 2.5,
      y: -Math.random() * 4 - 2
    };

    this.acceleration = { x: 0, y: 0 };

    // Larger, more visible particles
    this.radius = Math.random() * 10 + 6;

    // Longer lifespan for taller flames
    this.lifespan = 255;
  }

  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  update() {
    // Integrate physics
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    // Gradual fade
    this.lifespan -= 3;
  }

  draw() {
    /*
      Color mapping:
      - bright yellow at birth
      - orange mid-life
      - red near death
    */
    const alpha = this.lifespan / 255;

    ctx.fillStyle = `rgba(
      255,
      ${Math.min(200, this.lifespan)},
      ${Math.max(0, 100 - this.lifespan / 2)},
      ${alpha}
    )`;

    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius * alpha,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  isDead() {
    return this.lifespan <= 0;
  }
}

// ==================================================
// Fire Emitter
// ==================================================

/*
  The emitter is now a horizontal region,
  not a single point. This creates
  wider, more natural flames.
*/

const emitter = {
  x: canvas.width / 2,
  y: canvas.height - 40,
  width: 200
};

const particles = [];

// Forces
const gravity = { x: 0, y: 0.05 }; // pulls particles down slightly

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  // Semi-transparent background for trails
  ctx.fillStyle = "rgba(10, 10, 10, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Emit MANY particles per frame for dense fire
  for (let i = 0; i < 12; i++) {
    const spawnX =
      emitter.x + (Math.random() - 0.5) * emitter.width;
    particles.push(new Particle(spawnX, emitter.y));
  }

  // Update & render particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    // Apply forces
    p.applyForce(gravity);

    // Simple drag (air resistance)
    p.applyForce({
      x: -p.velocity.x * 0.02,
      y: -p.velocity.y * 0.01
    });

    p.update();
    p.draw();

    // Remove dead particles
    if (p.isDead()) {
      particles.splice(i, 1);
    }
  }

  requestAnimationFrame(animate);
}

animate();
