// ================================
// Canvas Setup
// ================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill background with a dark tone
ctx.fillStyle = "#0b0b0b";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ================================
// 🕌 Islamic Tessellation Logic
// ================================

/*
  Islamic tessellations are based on:
  - precise geometry
  - rotational symmetry
  - infinite repetition

  A classic building block is the 8-point star.
  This star can be constructed by overlapping:
  1. A square aligned with the axes
  2. The same square rotated by 45 degrees

  Repeating this star in a grid creates a
  seamless tessellation pattern.
*/

// Size of each repeating tile
const tileSize = 80;

// --------------------------------
// Draw a single 8-point star
// --------------------------------
function drawStar(cx, cy, size) {
  // Save current canvas state
  ctx.save();

  // Move origin to the center of the star
  ctx.translate(cx, cy);

  // Set drawing style
  ctx.strokeStyle = "#e9c46a";
  ctx.lineWidth = 2;

  // Draw first square (axis-aligned)
  ctx.beginPath();
  ctx.rect(-size / 2, -size / 2, size, size);
  ctx.stroke();

  // Rotate canvas by 45 degrees (π/4 radians)
  ctx.rotate(Math.PI / 4);

  // Draw second square (rotated)
  ctx.beginPath();
  ctx.rect(-size / 2, -size / 2, size, size);
  ctx.stroke();

  // Restore original canvas state
  ctx.restore();
}

// ================================
// 🔁 Tessellate the Pattern
// ================================

/*
  The star is repeated across the canvas
  using a simple grid layout. Offsetting
  the grid slightly avoids harsh clipping
  at the edges.
*/

for (let y = -tileSize; y < canvas.height + tileSize; y += tileSize) {
  for (let x = -tileSize; x < canvas.width + tileSize; x += tileSize) {
    drawStar(x, y, tileSize * 0.6);
  }
}
