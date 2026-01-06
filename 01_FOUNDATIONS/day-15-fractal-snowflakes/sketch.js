// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill background with deep winter blue
ctx.fillStyle = "#0b132b";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Line style for snowflake
ctx.strokeStyle = "rgba(224, 242, 255, 0.9)";
ctx.lineWidth = 1.2;
ctx.lineCap = "round";

// Add subtle glow for icy feel
ctx.shadowColor = "rgba(180, 220, 255, 0.6)";
ctx.shadowBlur = 4;

// ==================================================
// ❄️ Koch Curve Logic (Fractal Edge)
// ==================================================

/*
  The Koch curve is a recursive fractal defined by:

  Base case:
  - If recursion depth is 0 → draw a straight line

  Recursive rule:
  - Divide a line segment into three equal parts
  - Replace the middle segment with two segments
    that form an outward equilateral triangle

  This replacement increases complexity while
  preserving self-similarity at every scale.
*/

function drawKoch(x1, y1, x2, y2, depth) {
  // Base case: draw the segment directly
  if (depth === 0) {
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    return;
  }

  // Vector from start to end
  const dx = x2 - x1;
  const dy = y2 - y1;

  // Points dividing the segment into thirds
  const xA = x1 + dx / 3;
  const yA = y1 + dy / 3;

  const xB = x1 + (2 * dx) / 3;
  const yB = y1 + (2 * dy) / 3;

  /*
    To construct the triangular "bump":

    - Rotate the middle segment by -60 degrees
    - Length of the bump equals one third of the segment
  */
  const angle = Math.atan2(dy, dx) - Math.PI / 3;
  const length = Math.sqrt(dx * dx + dy * dy) / 3;

  const xPeak = xA + Math.cos(angle) * length;
  const yPeak = yA + Math.sin(angle) * length;

  // Recursively draw the four resulting segments
  drawKoch(x1, y1, xA, yA, depth - 1);
  drawKoch(xA, yA, xPeak, yPeak, depth - 1);
  drawKoch(xPeak, yPeak, xB, yB, depth - 1);
  drawKoch(xB, yB, x2, y2, depth - 1);
}

// ==================================================
// ❄️ Snowflake Construction
// ==================================================

/*
  A Koch snowflake is formed by applying the
  Koch curve to all three sides of an
  equilateral triangle.

  The symmetry of the triangle combined with
  recursive edge refinement produces a
  snowflake-like fractal structure.
*/

// Snowflake parameters
const size = Math.min(canvas.width, canvas.height) * 0.48;
const depth = 4;

// Center of canvas
const cx = canvas.width / 2;
const cy = canvas.height / 2;

// Height of equilateral triangle
const h = (Math.sqrt(3) / 2) * size;

// Triangle vertices
const p1 = { x: cx - size / 2, y: cy + h / 3 };
const p2 = { x: cx + size / 2, y: cy + h / 3 };
const p3 = { x: cx, y: cy - (2 * h) / 3 };

// Draw the three Koch edges
drawKoch(p1.x, p1.y, p2.x, p2.y, depth);
drawKoch(p2.x, p2.y, p3.x, p3.y, depth);
drawKoch(p3.x, p3.y, p1.x, p1.y, depth);
