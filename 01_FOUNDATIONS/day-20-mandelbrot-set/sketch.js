// ==================================================
// Canvas Setup
// ==================================================

/*
  We use the Canvas API to render the Mandelbrot set
  by directly manipulating pixel data.
*/

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Make canvas fill the window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// 🧠 Mandelbrot Set Logic
// ==================================================

/*
  The Mandelbrot set is defined by iterating:

    zₙ₊₁ = zₙ² + c

  where:
  - z is a complex number (x + yi)
  - c is a complex constant mapped from each pixel

  If |z| ever exceeds 2, the sequence diverges.
  The number of iterations before divergence
  determines the pixel's color.
*/

// Maximum number of iterations before assuming convergence
const maxIterations = 100;

// Bounds of the complex plane we want to visualize
const xmin = -2.5;
const xmax = 1;
const ymin = -1.5;
const ymax = 1.5;

// Create an image buffer for efficient pixel manipulation
const imageData = ctx.createImageData(canvas.width, canvas.height);
const data = imageData.data;

// ==================================================
// 🖥️ Pixel-by-Pixel Rendering
// ==================================================

/*
  We loop over every pixel on the canvas.
  Each pixel is mapped to a complex number c.
*/

for (let px = 0; px < canvas.width; px++) {
  for (let py = 0; py < canvas.height; py++) {

    // Map pixel coordinates to the complex plane
    const a = xmin + (px / canvas.width) * (xmax - xmin);
    const b = ymin + (py / canvas.height) * (ymax - ymin);

    // z starts at 0 for every pixel
    let x = 0;
    let y = 0;
    let iteration = 0;

    /*
      Iterate the Mandelbrot equation:
        z = z² + c

      Stop if:
      - |z|² > 4 (diverges)
      - iteration limit is reached
    */
    while (x * x + y * y <= 4 && iteration < maxIterations) {
      const xTemp = x * x - y * y + a;
      y = 2 * x * y + b;
      x = xTemp;
      iteration++;
    }

    // Index in the pixel buffer
    const idx = (py * canvas.width + px) * 4;

    if (iteration === maxIterations) {
      // Points inside the Mandelbrot set are colored black
      data[idx] = 0;
      data[idx + 1] = 0;
      data[idx + 2] = 0;
    } else {
      /*
        Points outside the set are colored based
        on how quickly they diverge.

        Faster escape → different hue
      */
      const hue = (iteration / maxIterations) * 360;
      const [r, g, b] = hslToRgb(hue, 100, 50);

      data[idx] = r;
      data[idx + 1] = g;
      data[idx + 2] = b;
    }

    // Alpha channel (fully opaque)
    data[idx + 3] = 255;
  }
}

// Draw the computed image buffer to the canvas
ctx.putImageData(imageData, 0, 0);

// ==================================================
// 🎨 Utility: HSL → RGB Conversion
// ==================================================

/*
  Canvas works with RGB values.
  This helper converts HSL colors to RGB
  so we can smoothly color based on iteration count.
*/

function hslToRgb(h, s, l) {
  s /= 100;
  l /= 100;

  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n =>
    l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

  return [
    Math.round(255 * f(0)),
    Math.round(255 * f(8)),
    Math.round(255 * f(4)),
  ];
}
