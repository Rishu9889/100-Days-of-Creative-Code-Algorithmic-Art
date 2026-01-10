// Get canvas and drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/*
  STEP 1: Draw a base image
  We start with a smooth gradient so the effect of pixel sorting
  is clearly visible after manipulation.
*/
const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
gradient.addColorStop(0, "#2E86DE");
gradient.addColorStop(1, "#E55039");
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, canvas.width, canvas.height);

/*
  STEP 2: Add noise
  Pixel sorting needs high-frequency detail.
  Without noise, sorting a smooth gradient does almost nothing.
*/
let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
let data = imageData.data;

for (let i = 0; i < data.length; i += 4) {
  const n = (Math.random() - 0.5) * 60;
  data[i] += n;     // Red
  data[i + 1] += n; // Green
  data[i + 2] += n; // Blue
}

ctx.putImageData(imageData, 0, 0);

/*
  STEP 3: Pixel sorting using brightness threshold
  Only pixels brighter than a threshold are sorted.
  This creates glitch-like streaks instead of smooth bands.
*/

// Helper to calculate brightness
function brightness(r, g, b) {
  return (r + g + b) / 3;
}

imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
data = imageData.data;

const threshold = 120; // Brightness cutoff

// Process image row by row
for (let y = 0; y < canvas.height; y++) {
  let segmentStart = -1;

  for (let x = 0; x < canvas.width; x++) {
    const index = (y * canvas.width + x) * 4;
    const b = brightness(data[index], data[index + 1], data[index + 2]);

    // Start a sortable segment
    if (b > threshold && segmentStart === -1) {
      segmentStart = x;
    }

    // End the segment
    if ((b <= threshold || x === canvas.width - 1) && segmentStart !== -1) {
      const segmentEnd = x;

      // Extract pixels in this segment
      const segment = [];
      for (let sx = segmentStart; sx < segmentEnd; sx++) {
        const si = (y * canvas.width + sx) * 4;
        segment.push([
          data[si],
          data[si + 1],
          data[si + 2],
          data[si + 3],
        ]);
      }

      // Sort pixels by brightness
      segment.sort(
        (a, b) => brightness(a[0], a[1], a[2]) - brightness(b[0], b[1], b[2])
      );

      // Write sorted pixels back
      for (let sx = segmentStart; sx < segmentEnd; sx++) {
        const si = (y * canvas.width + sx) * 4;
        const p = segment[sx - segmentStart];
        data[si] = p[0];
        data[si + 1] = p[1];
        data[si + 2] = p[2];
        data[si + 3] = p[3];
      }

      segmentStart = -1;
    }
  }
}

// Update canvas with sorted pixels
ctx.putImageData(imageData, 0, 0);
