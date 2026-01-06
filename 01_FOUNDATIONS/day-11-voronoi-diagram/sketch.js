// ================================
// Canvas Setup
// ================================

// Get canvas and drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================================
// 🌐 Voronoi Diagram Parameters
// ================================

// Number of Voronoi sites (seed points)
const NUM_POINTS = 40;

// Each site has a position and a color
const points = [];

// Generate random sites
for (let i = 0; i < NUM_POINTS; i++) {
  points.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    color: `hsl(${Math.random() * 360}, 70%, 60%)`,
  });
}

// ================================
// 🧠 Voronoi Logic
// ================================

/*
  Core idea of a Voronoi diagram:

  For every pixel in the plane:
  - Measure its distance to every site
  - Find the site with the minimum distance
  - Assign the pixel to that site

  Using squared distance avoids unnecessary square roots
  and preserves correct distance comparisons.
*/

// Loop over every pixel on the canvas
for (let y = 0; y < canvas.height; y++) {
  for (let x = 0; x < canvas.width; x++) {
    let minDist = Infinity;
    let closestPoint = null;

    // Compare distance to each site
    for (let p of points) {
      const dx = x - p.x;
      const dy = y - p.y;

      // Squared Euclidean distance
      const dist = dx * dx + dy * dy;

      if (dist < minDist) {
        minDist = dist;
        closestPoint = p;
      }
    }

    // Color pixel based on nearest site
    ctx.fillStyle = closestPoint.color;
    ctx.fillRect(x, y, 1, 1);
  }
}

// ================================
// 🔴 Draw Sites on Top
// ================================

// Draw the seed points to visualize cell centers
for (let p of points) {
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
  ctx.fill();
}
