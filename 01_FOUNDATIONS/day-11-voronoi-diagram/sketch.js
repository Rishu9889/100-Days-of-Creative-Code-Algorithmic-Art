const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  generate();
}
window.addEventListener("resize", resize);

let points = [];
const NUM_POINTS = 30;

function generate() {
  points = [];
  for (let i = 0; i < NUM_POINTS; i++) {
    points.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      color: hslToRgb(Math.random() * 360, 0.7, 0.6),
    });
  }
  drawVoronoi();
}

function drawVoronoi() {
  const w = canvas.width;
  const h = canvas.height;
  const img = ctx.createImageData(w, h);
  const data = img.data;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let minDist = Infinity;
      let closest = 0;

      for (let i = 0; i < points.length; i++) {
        const dx = x - points[i].x;
        const dy = y - points[i].y;
        const d = dx * dx + dy * dy;
        if (d < minDist) {
          minDist = d;
          closest = i;
        }
      }

      const idx = (y * w + x) * 4;
      const c = points[closest].color;

      data[idx] = c[0];
      data[idx + 1] = c[1];
      data[idx + 2] = c[2];
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(img, 0, 0);

  // Draw seed points
  for (let p of points) {
    ctx.fillStyle = "#000";
    ctx.beginPath();
    ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function hslToRgb(h, s, l) {
  h /= 360;
  let r, g, b;

  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p, q, t) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }

  return [
    Math.round(r * 255),
    Math.round(g * 255),
    Math.round(b * 255),
  ];
}

// Add new site on click
canvas.addEventListener("click", (e) => {
  points.push({
    x: e.clientX,
    y: e.clientY,
    color: hslToRgb(Math.random() * 360, 0.7, 0.6),
  });
  drawVoronoi();
});

resize();
