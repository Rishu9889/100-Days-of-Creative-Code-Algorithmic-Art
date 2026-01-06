const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Start from center
let x = canvas.width / 2;
let y = canvas.height / 2;

// Background once
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

ctx.lineWidth = 1;

for (let i = 0; i < 15000; i++) {
  const prevX = x;
  const prevY = y;

  const step = Math.random() * 4;
  if (step < 1) x += 2;
  else if (step < 2) x -= 2;
  else if (step < 3) y += 2;
  else y -= 2;

  ctx.strokeStyle = `hsl(${i / 40}, 70%, 60%)`;
  ctx.beginPath();
  ctx.moveTo(prevX, prevY);
  ctx.lineTo(x, y);
  ctx.stroke();
}
