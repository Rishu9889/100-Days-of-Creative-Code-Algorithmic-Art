// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Utility Functions
// ==================================================

function limitVector(vec, max) {
  const mag = Math.hypot(vec.x, vec.y);
  if (mag > max) {
    vec.x = (vec.x / mag) * max;
    vec.y = (vec.y / mag) * max;
  }
}

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ==================================================
// Boid Class
// ==================================================

/*
  Each boid has:
  - position
  - velocity
  - acceleration

  Acceleration is influenced by
  separation, alignment, and cohesion forces.
*/

class Boid {
  constructor() {
    this.position = {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    };

    this.velocity = {
      x: (Math.random() - 0.5) * 4,
      y: (Math.random() - 0.5) * 4
    };

    this.acceleration = { x: 0, y: 0 };

    this.maxSpeed = 4;
    this.maxForce = 0.05;
    this.radius = 4;
  }

  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  // --------------------------------------------------
  // Boids Rules
  // --------------------------------------------------

  separation(boids) {
    const desiredSeparation = 25;
    let steer = { x: 0, y: 0 };
    let count = 0;

    for (let other of boids) {
      const d = distance(this.position, other.position);
      if (other !== this && d < desiredSeparation && d > 0) {
        steer.x += (this.position.x - other.position.x) / d;
        steer.y += (this.position.y - other.position.y) / d;
        count++;
      }
    }

    if (count > 0) {
      steer.x /= count;
      steer.y /= count;
    }

    if (Math.hypot(steer.x, steer.y) > 0) {
      limitVector(steer, this.maxSpeed);
      steer.x -= this.velocity.x;
      steer.y -= this.velocity.y;
      limitVector(steer, this.maxForce);
    }

    return steer;
  }

  alignment(boids) {
    const neighborDist = 50;
    let sum = { x: 0, y: 0 };
    let count = 0;

    for (let other of boids) {
      const d = distance(this.position, other.position);
      if (other !== this && d < neighborDist) {
        sum.x += other.velocity.x;
        sum.y += other.velocity.y;
        count++;
      }
    }

    if (count > 0) {
      sum.x /= count;
      sum.y /= count;
      limitVector(sum, this.maxSpeed);

      const steer = {
        x: sum.x - this.velocity.x,
        y: sum.y - this.velocity.y
      };

      limitVector(steer, this.maxForce);
      return steer;
    }

    return { x: 0, y: 0 };
  }

  cohesion(boids) {
    const neighborDist = 50;
    let center = { x: 0, y: 0 };
    let count = 0;

    for (let other of boids) {
      const d = distance(this.position, other.position);
      if (other !== this && d < neighborDist) {
        center.x += other.position.x;
        center.y += other.position.y;
        count++;
      }
    }

    if (count > 0) {
      center.x /= count;
      center.y /= count;
      return this.seek(center);
    }

    return { x: 0, y: 0 };
  }

  seek(target) {
    const desired = {
      x: target.x - this.position.x,
      y: target.y - this.position.y
    };

    limitVector(desired, this.maxSpeed);

    const steer = {
      x: desired.x - this.velocity.x,
      y: desired.y - this.velocity.y
    };

    limitVector(steer, this.maxForce);
    return steer;
  }

  // --------------------------------------------------
  // Update & Draw
  // --------------------------------------------------

  update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    limitVector(this.velocity, this.maxSpeed);

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    // Reset acceleration
    this.acceleration.x = 0;
    this.acceleration.y = 0;

    // Screen wrapping
    if (this.position.x < 0) this.position.x = canvas.width;
    if (this.position.y < 0) this.position.y = canvas.height;
    if (this.position.x > canvas.width) this.position.x = 0;
    if (this.position.y > canvas.height) this.position.y = 0;
  }

  draw() {
    ctx.fillStyle = "#f1faee";
    ctx.beginPath();
    ctx.arc(
      this.position.x,
      this.position.y,
      this.radius,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  flock(boids) {
    const sep = this.separation(boids);
    const ali = this.alignment(boids);
    const coh = this.cohesion(boids);

    // Weight forces
    sep.x *= 1.5;
    sep.y *= 1.5;

    ali.x *= 1.0;
    ali.y *= 1.0;

    coh.x *= 1.0;
    coh.y *= 1.0;

    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }
}

// ==================================================
// Simulation Setup
// ==================================================

const boids = [];
const BOID_COUNT = 120;

for (let i = 0; i < BOID_COUNT; i++) {
  boids.push(new Boid());
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  ctx.fillStyle = "rgba(14, 14, 14, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let boid of boids) {
    boid.flock(boids);
    boid.update();
    boid.draw();
  }

  requestAnimationFrame(animate);
}

animate();
