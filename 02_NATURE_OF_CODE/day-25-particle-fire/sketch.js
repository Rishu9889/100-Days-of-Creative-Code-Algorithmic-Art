const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const emitter = {
  x: window.innerWidth / 2,
  y: window.innerHeight - 40,
  width: 200
};

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  emitter.x = canvas.width / 2;
  emitter.y = canvas.height - 40;
}

resize();
window.addEventListener("resize", resize);



class Particle {
  constructor(x, y, type = "flame") {
    this.reset(x, y, type);
  }

  reset(x, y, type) {
    this.position = { x, y };
    this.type = type;

    this.velocity = {
      x: (Math.random() - 0.5) * 2,
      y: -Math.random() * 4 - 2
    };

    this.acceleration = { x: 0, y: 0 };

    this.temperature = 1; 
    this.lifespan = 255;

    if (type === "core") {
      this.radius = Math.random() * 4 + 4;
      this.lifespan = 180;
    } else if (type === "ember") {
      this.radius = Math.random() * 6 + 4;
      this.velocity.y *= 0.3;
    } else {
      this.radius = Math.random() * 8 + 6;
    }
  }

  applyForce(force) {
    this.acceleration.x += force.x;
    this.acceleration.y += force.y;
  }

  update() {
    this.velocity.x += this.acceleration.x;
    this.velocity.y += this.acceleration.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    this.acceleration.x = 0;
    this.acceleration.y = 0;

    this.lifespan -= 3;
    this.temperature *= 0.97;
  }

  draw() {
  const alpha = this.lifespan / 255;
  const t = this.temperature;

  const r = 255;
  const g = Math.floor(200 * t);
  const b = Math.floor(60 * t);

  ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;

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


const particles = [];
const pool = [];

function getParticle(x, y, type) {
  if (pool.length) {
    const p = pool.pop();
    p.reset(x, y, type);
    return p;
  }
  return new Particle(x, y, type);
}

function releaseParticle(p) {
  pool.push(p);
}




const gravity = { x: 0, y: 0.05 };
const buoyancy = { x: 0, y: -0.12 };


window.addEventListener("mousemove", e => {
  emitter.x = e.clientX;
});


function animate() {
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(10, 10, 10, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.globalCompositeOperation = "lighter";

  for (let i = 0; i < 10; i++) {
    const x = emitter.x + (Math.random() - 0.5) * emitter.width;

    particles.push(getParticle(x, emitter.y, "core"));
    particles.push(getParticle(x, emitter.y, "flame"));

    if (Math.random() < 0.2) {
      particles.push(getParticle(x, emitter.y, "ember"));
    }
  }

  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];

    p.applyForce(gravity);
    p.applyForce(buoyancy);

    p.applyForce({
      x: (Math.random() - 0.5) * 0.08,
      y: 0
    });

    p.applyForce({
      x: -p.velocity.x * 0.02,
      y: -p.velocity.y * 0.01
    });

    p.update();
    p.draw();

    if (p.isDead()) {
      particles.splice(i, 1);
      releaseParticle(p);
    }
  }

  requestAnimationFrame(animate);
}

animate();
