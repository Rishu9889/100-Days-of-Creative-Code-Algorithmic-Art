const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// ---------------------------------------------
// Utility
// ---------------------------------------------
function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------------------------------------------
// Entities
// ---------------------------------------------
class Fish {
  constructor(x, y) {
    this.pos = { x, y };
    this.vel = { x: rand(-1, 1), y: rand(-0.5, 0.5) };
    this.size = rand(6, 12);
    this.speed = rand(0.6, 1.4);
    this.color = `hsl(${rand(180, 210)}, 80%, ${rand(55, 65)}%)`;
  }

  update(food) {
    // Attraction to food
    if (food.length) {
      const f = food[0];
      const dx = f.x - this.pos.x;
      const dy = f.y - this.pos.y;
      const d = Math.hypot(dx, dy);
      if (d < 250) {
        this.vel.x += dx / d * 0.03;
        this.vel.y += dy / d * 0.03;
      }
    }

    // Swim
    this.pos.x += this.vel.x * this.speed;
    this.pos.y += this.vel.y * this.speed;

    // Boundaries
    if (this.pos.x < 0 || this.pos.x > canvas.width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > canvas.height) this.vel.y *= -1;

    // Slight damping
    this.vel.x *= 0.99;
    this.vel.y *= 0.99;
  }

  draw() {
    ctx.save();
    ctx.translate(this.pos.x, this.pos.y);
    const angle = Math.atan2(this.vel.y, this.vel.x);
    ctx.rotate(angle);

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, this.size * 1.2, this.size * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail
    ctx.beginPath();
    ctx.moveTo(-this.size * 1.2, 0);
    ctx.lineTo(-this.size * 2, -this.size * 0.6);
    ctx.lineTo(-this.size * 2, this.size * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();
  }
}

class Plant {
  constructor(x) {
    this.x = x;
    this.baseY = canvas.height;
    this.height = rand(80, 150);
    this.phase = rand(0, Math.PI * 2);
  }

  draw(t) {
    ctx.strokeStyle = "rgba(40,200,120,0.7)";
    ctx.lineWidth = 3;
    ctx.beginPath();

    for (let i = 0; i < 20; i++) {
      const y = this.baseY - (i / 20) * this.height;
      const sway = Math.sin(t * 0.002 + this.phase + i * 0.3) * 6;
      const x = this.x + sway;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }

    ctx.stroke();
  }
}

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = 0;
    this.life = 1;
  }

  update() {
    this.r += 2.5;
    this.life -= 0.01;
  }

  draw() {
    ctx.strokeStyle = `rgba(180,240,255,${this.life})`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.stroke();
  }
}

// ---------------------------------------------
// World State
// ---------------------------------------------
const fish = [];
const plants = [];
const ripples = [];
const food = [];

for (let i = 0; i < 10; i++) {
  fish.push(new Fish(rand(0, canvas.width), rand(0, canvas.height)));
}
for (let i = 0; i < 6; i++) {
  plants.push(new Plant(rand(0, canvas.width)));
}

// ---------------------------------------------
// Interaction
// ---------------------------------------------
canvas.addEventListener("click", e => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  ripples.push(new Ripple(x, y));
  food.length = 0;
  food.push({ x, y });
});

document.getElementById("addFish").onclick = () => {
  fish.push(new Fish(rand(0, canvas.width), rand(0, canvas.height)));
};

document.getElementById("addPlant").onclick = () => {
  plants.push(new Plant(rand(0, canvas.width)));
};

// ---------------------------------------------
// Render Loop
// ---------------------------------------------
let time = 0;

function drawBackground() {
  const g = ctx.createLinearGradient(0, 0, 0, canvas.height);
  g.addColorStop(0, "#0a3a4a");
  g.addColorStop(1, "#02161f");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function animate() {
  time++;
  drawBackground();

  plants.forEach(p => p.draw(time));

  fish.forEach(f => {
    f.update(food);
    f.draw();
  });

  for (let i = ripples.length - 1; i >= 0; i--) {
    ripples[i].update();
    ripples[i].draw();
    if (ripples[i].life <= 0) ripples.splice(i, 1);
  }

  requestAnimationFrame(animate);
}

animate();
