const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Track mouse position
let mouse = { x: 0, y: 0 };
canvas.addEventListener("mousemove", (e) => {
  const rect = canvas.getBoundingClientRect();
  mouse.x = e.clientX - rect.left;
  mouse.y = e.clientY - rect.top;
});

// Gravity force
const gravity = { x: 0, y: 0.6 };

// Ball class
class Ball {
  constructor(x, y) {
    this.position = { x, y };
    this.velocity = {
      x: (Math.random() - 0.5) * 6,
      y: Math.random() * 2
    };
    this.acceleration = { x: 0, y: 0 };
    this.radius = 10 + Math.random() * 20;
    this.mass = this.radius * 0.1;
    this.color = `hsl(${Math.random() * 360}, 80%, 65%)`;
  }

  applyForce(force) {
    this.acceleration.x += force.x / this.mass;
    this.acceleration.y += force.y / this.mass;
  }

  update() {
    this.applyForce(gravity);

    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.acceleration.x = 0;
    this.acceleration.y = 0;

    // Floor collision
    if (this.position.y + this.radius > canvas.height) {
      this.position.y = canvas.height - this.radius;
      this.velocity.y *= -0.85; // energy loss
    }

    // Walls
    if (this.position.x - this.radius < 0) {
      this.position.x = this.radius;
      this.velocity.x *= -0.9;
    }
    if (this.position.x + this.radius > canvas.width) {
      this.position.x = canvas.width - this.radius;
      this.velocity.x *= -0.9;
    }
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Hover detection
    const dx = mouse.x - this.position.x;
    const dy = mouse.y - this.position.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < this.radius) {
      const info = [
        `pos: (${this.position.x.toFixed(1)}, ${this.position.y.toFixed(1)})`,
        `vel: (${this.velocity.x.toFixed(2)}, ${this.velocity.y.toFixed(2)})`,
        `acc: (${this.acceleration.x.toFixed(2)}, ${this.acceleration.y.toFixed(2)})`
      ];

      ctx.save();
      ctx.font = "12px system-ui";
      ctx.fillStyle = "rgba(15,23,42,0.9)";
      ctx.strokeStyle = "#38bdf8";

      const w = 220;
      const h = 52;
      const x = this.position.x + this.radius + 10;
      const y = this.position.y - h / 2;

      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);

      ctx.fillStyle = "#e5e7eb";
      info.forEach((t, i) => {
        ctx.fillText(t, x + 8, y + 16 + i * 14);
      });

      ctx.restore();
    }
  }
}

// Collection of balls
const balls = [];

// Spawn some initially
for (let i = 0; i < 5; i++) {
  balls.push(new Ball(canvas.width / 2, 50 + i * 30));
}

// Click to add new balls
canvas.addEventListener("click", (e) => {
  balls.push(new Ball(e.clientX, e.clientY));
});

// Animation loop
function animate() {
  ctx.fillStyle = "rgba(2,6,23,0.35)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  balls.forEach((ball) => {
    ball.update();
    ball.draw();
  });

  requestAnimationFrame(animate);
}

animate();
