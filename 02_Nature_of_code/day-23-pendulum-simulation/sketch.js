const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  origin.x = canvas.width / 2;
});

const gravity = 0.6;

const origin = {
  x: canvas.width / 2,
  y: 120
};

const pendulums = [
  createPendulum(220, Math.PI / 4, "#e63946"),
  createPendulum(300, Math.PI / 4, "#a8dadc"),
  createPendulum(380, Math.PI / 4, "#f1faee")
];

function createPendulum(length, angle, color) {
  return {
    length,
    angle,
    angularVelocity: 0,
    angularAcceleration: 0,
    damping: 0.995,
    color,
    trail: []
  };
}


function updatePendulum(p) {
  p.angularAcceleration =
    (-gravity / p.length) * Math.sin(p.angle);

  p.angularVelocity += p.angularAcceleration;
  p.angularVelocity *= p.damping;
  p.angle += p.angularVelocity;
}


function calculateEnergy(p) {
  const height =
    p.length * (1 - Math.cos(p.angle));

  const potential = gravity * height;
  const kinetic = 0.5 * p.angularVelocity * p.angularVelocity;

  return { potential, kinetic };
}


function drawPendulum(p, index) {
  const x =
    origin.x + p.length * Math.sin(p.angle);
  const y =
    origin.y + p.length * Math.cos(p.angle);

  // Trail
  p.trail.push({ x, y });
  if (p.trail.length > 60) p.trail.shift();

  ctx.strokeStyle = p.color;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  for (let i = 0; i < p.trail.length; i++) {
    const t = p.trail[i];
    ctx.lineTo(t.x, t.y);
  }
  ctx.stroke();
  ctx.globalAlpha = 1;

  // Arm
  ctx.strokeStyle = "#f1faee";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  ctx.lineTo(x, y);
  ctx.stroke();

  // Bob
  ctx.fillStyle = p.color;
  ctx.beginPath();
  ctx.arc(x, y, 14, 0, Math.PI * 2);
  ctx.fill();

  // Pivot
  ctx.fillStyle = "#f1faee";
  ctx.beginPath();
  ctx.arc(origin.x, origin.y, 5, 0, Math.PI * 2);
  ctx.fill();

  drawEnergyBars(p, index);
}



function drawEnergyBars(p, index) {
  const { potential, kinetic } = calculateEnergy(p);

  const maxBarHeight = 120;
  const x = 40 + index * 70;
  const baseY = canvas.height - 40;

  const peHeight = Math.min(potential * 40, maxBarHeight);
  const keHeight = Math.min(kinetic * 800, maxBarHeight);

  // Potential Energy
  ctx.fillStyle = "#457b9d";
  ctx.fillRect(x, baseY - peHeight, 20, peHeight);

  // Kinetic Energy
  ctx.fillStyle = "#e63946";
  ctx.fillRect(x + 24, baseY - keHeight, 20, keHeight);

  // Labels
  ctx.fillStyle = "#f1faee";
  ctx.font = "12px sans-serif";
  ctx.fillText("PE", x, baseY + 14);
  ctx.fillText("KE", x + 24, baseY + 14);
}



function animate() {
  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let p of pendulums) {
    updatePendulum(p);
    drawPendulum(p, pendulums.indexOf(p));
  }

  requestAnimationFrame(animate);
}

animate();
