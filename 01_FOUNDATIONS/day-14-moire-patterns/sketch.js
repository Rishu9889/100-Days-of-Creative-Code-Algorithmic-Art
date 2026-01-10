// ================================
// Canvas Setup
// ================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill background
ctx.fillStyle = "#0e0e0e";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ================================
// 🌀 Moiré Pattern Logic
// ================================

/*
  Moiré patterns emerge when two similar
  repetitive structures overlap with
  a slight variation (offset or rotation).

  Here:
  - We draw two line grids
  - The second grid is slightly rotated
  - Their interference creates moiré waves
*/

// Distance between parallel lines
const spacing = 12;

// Line style
ctx.strokeStyle = "rgba(255, 255, 255, 0.6)";
ctx.lineWidth = 1;

// --------------------------------
// Draw first line grid
// --------------------------------
ctx.beginPath();

for (let x = -canvas.height; x < canvas.width + canvas.height; x += spacing) {
  ctx.moveTo(x, -canvas.height);
  ctx.lineTo(x, canvas.height * 2);
}

ctx.stroke();

// --------------------------------
// Draw second grid (slightly rotated)
// --------------------------------

// Save current canvas state
ctx.save();

// Move origin to center for rotation
ctx.translate(canvas.width / 2, canvas.height / 2);

// Rotate by a very small angle
ctx.rotate(Math.PI / 180 * 2); // 2 degrees

ctx.beginPath();

for (let x = -canvas.height; x < canvas.width + canvas.height; x += spacing) {
  ctx.moveTo(x, -canvas.height);
  ctx.lineTo(x, canvas.height * 2);
}

ctx.stroke();

// Restore canvas state
ctx.restore();
