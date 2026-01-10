// Get canvas element and drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to full window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Move origin to the center of the canvas
// This simplifies symmetric mathematical drawing
ctx.translate(canvas.width / 2, canvas.height / 2);

// Clear the background
ctx.fillStyle = "black";
ctx.fillRect(
  -canvas.width / 2,
  -canvas.height / 2,
  canvas.width,
  canvas.height
);

// --------------------------------
// 🌀 Spirograph Parameters
// --------------------------------

// Radius of the fixed outer circle
const R = Math.min(canvas.width, canvas.height) * 0.35;

// Radius of the rolling inner circle
const r = R * 0.35;

// Distance from the rolling circle's center to the drawing point
const d = r * 0.8;

// Drawing style
ctx.strokeStyle = "#ff6f61";
ctx.lineWidth = 2;

// --------------------------------
// 🌀 Draw Spirograph Curve
// --------------------------------
ctx.beginPath();

// Parameter 't' represents the rotation angle
// A larger upper limit allows the curve to fully close
for (let t = 0; t <= Math.PI * 40; t += 0.01) {
  /*
    Hypotrochoid (Spirograph) equations:

    x = (R - r) * cos(t) + d * cos((R - r) / r * t)
    y = (R - r) * sin(t) - d * sin((R - r) / r * t)

    These equations describe a point attached to a circle
    rolling inside another circle.
  */

  const x =
    (R - r) * Math.cos(t) +
    d * Math.cos(((R - r) / r) * t);

  const y =
    (R - r) * Math.sin(t) -
    d * Math.sin(((R - r) / r) * t);

  ctx.lineTo(x, y);
}

// Render the curve
ctx.stroke();
