// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Simulation Parameters
// ==================================================

const populationSize = 120;
const lifespan = 300;
let frame = 0;
let generation = 1;

const target = {
  x: canvas.width / 2,
  y: 80
};

// Obstacle
const obstacle = {
  x: canvas.width / 2 - 120,
  y: canvas.height / 2,
  w: 240,
  h: 20
};

// ==================================================
// DNA (Genetic Information)
// ==================================================

/*
  DNA controls steering behavior.
  Each gene is a force vector applied per frame.
*/

class DNA {
  constructor(genes) {
    this.genes = genes || Array.from({ length: lifespan }, () => ({
      x: (Math.random() - 0.5) * 0.6,
      y: (Math.random() - 0.5) * 0.6
    }));
  }

  crossover(partner) {
    const newGenes = [];
    const midpoint = Math.floor(Math.random() * this.genes.length);

    for (let i = 0; i < this.genes.length; i++) {
      newGenes[i] = i > midpoint ? this.genes[i] : partner.genes[i];
    }

    return new DNA(newGenes);
  }

  mutate() {
    for (let gene of this.genes) {
      if (Math.random() < 0.01) {
        gene.x += (Math.random() - 0.5) * 0.4;
        gene.y += (Math.random() - 0.5) * 0.4;
      }
    }
  }
}

// ==================================================
// Vehicle (Agent)
// ==================================================

class Vehicle {
  constructor(dna) {
    this.position = { x: canvas.width / 2, y: canvas.height - 40 };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };

    this.dna = dna || new DNA();
    this.completed = false;
    this.crashed = false;
    this.fitness = 0;
  }

  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  update() {
    const d = distance(this.position, target);

    // Check completion
    if (d < 10) {
      this.completed = true;
      this.position = { ...target };
    }

    // Obstacle collision
    if (
      this.position.x > obstacle.x &&
      this.position.x < obstacle.x + obstacle.w &&
      this.position.y > obstacle.y &&
      this.position.y < obstacle.y + obstacle.h
    ) {
      this.crashed = true;
    }

    if (!this.completed && !this.crashed) {
      // Apply gene force for this frame
      this.applyForce(this.dna.genes[frame]);

      // Integrate motion
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;

      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;

      this.acceleration.x = 0;
      this.acceleration.y = 0;
    }
  }

  calculateFitness() {
    const d = distance(this.position, target);
    this.fitness = 1 / (d * d);

    if (this.completed) this.fitness *= 10;
    if (this.crashed) this.fitness *= 0.1;
  }

  draw() {
    ctx.fillStyle = this.completed
      ? "#2a9d8f"
      : this.crashed
      ? "#e63946"
      : "#f1faee";

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 3, 0, Math.PI * 2);
    ctx.fill();
  }
}

// ==================================================
// Population
// ==================================================

let population = [];

function initPopulation() {
  population = [];
  for (let i = 0; i < populationSize; i++) {
    population.push(new Vehicle());
  }
}

initPopulation();

// ==================================================
// Evolution
// ==================================================

function evolve() {
  // Calculate fitness
  let maxFitness = 0;
  for (let v of population) {
    v.calculateFitness();
    maxFitness = Math.max(maxFitness, v.fitness);
  }

  // Normalize fitness
  for (let v of population) {
    v.fitness /= maxFitness;
  }

  // Create mating pool
  const matingPool = [];
  for (let v of population) {
    const n = v.fitness * 100;
    for (let i = 0; i < n; i++) {
      matingPool.push(v);
    }
  }

  // Reproduce
  population = population.map(() => {
    const a = matingPool[Math.floor(Math.random() * matingPool.length)];
    const b = matingPool[Math.floor(Math.random() * matingPool.length)];
    const childDNA = a.dna.crossover(b.dna);
    childDNA.mutate();
    return new Vehicle(childDNA);
  });

  frame = 0;
  generation++;
}

// ==================================================
// Helpers
// ==================================================

function distance(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  ctx.fillStyle = "rgba(14, 14, 14, 0.4)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw target
  ctx.fillStyle = "#e9c46a";
  ctx.beginPath();
  ctx.arc(target.x, target.y, 10, 0, Math.PI * 2);
  ctx.fill();

  // Draw obstacle
  ctx.fillStyle = "#264653";
  ctx.fillRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h);

  for (let v of population) {
    v.update();
    v.draw();
  }

  frame++;

  if (frame === lifespan) {
    evolve();
  }

  // Generation counter
  ctx.fillStyle = "#f1faee";
  ctx.fillText(`Generation: ${generation}`, 20, 30);

  requestAnimationFrame(animate);
}

animate();
