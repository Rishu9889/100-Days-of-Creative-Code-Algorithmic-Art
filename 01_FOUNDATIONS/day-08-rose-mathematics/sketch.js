// Get canvas element and 2D drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match the browser window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Move the coordinate system origin to the center of the canvas
// This makes polar-to-Cartesian conversion easier and symmetric
ctx.translate(canvas.width / 2, canvas.height / 2);

// Clear the background with a solid black color
ctx.fillStyle = "black";
ctx.fillRect(
  -canvas.width / 2,
  -canvas.height / 2,
  canvas.width,
  canvas.height
);

// -------------------------------
// 🌸 Rose Curve Parameters
// -------------------------------

// 'a' controls the overall size of the rose
const a = Math.min(canvas.width, canvas.height) * 0.35;

// 'k' controls the number of petals
// If k is odd → k petals
// If k is even → 2k petals
const k = 5;

// -------------------------------
// 🌹 Draw Layered Rose Curves
// -------------------------------
// Multiple layers are drawn with slightly different scales
// and opacity values to give depth and softness to the rose
for (let layer = 0; layer < 6; layer++) {
  ctx.beginPath();

  // Each layer is slightly smaller than the previous one
  const scale = 1 - layer * 0.06;

  // Gradually increase opacity for inner layers
  const alpha = 0.15 + layer * 0.1;

  // Deep rose red color with transparency
  ctx.strokeStyle = `rgba(214, 40, 40, ${alpha})`;

  // Slightly thinner strokes for inner layers
  ctx.lineWidth = 2 - layer * 0.2;

  // Draw the rose curve using polar coordinates
  for (let theta = 0; theta <= Math.PI * 2; theta += 0.01) {
    // Polar equation of a rose curve:
    // r = a * cos(k * θ)
    const r = a * scale * Math.cos(k * theta);

    // Convert polar coordinates (r, θ) to Cartesian (x, y)
    const x = r * Math.cos(theta);
    const y = r * Math.sin(theta);

    ctx.lineTo(x, y);
  }

  ctx.stroke();
}
