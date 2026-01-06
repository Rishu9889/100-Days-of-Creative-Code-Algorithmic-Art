// ==================================================
// Webcam ASCII (Fullscreen, Correct Scaling)
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const asciiEl = document.getElementById("ascii");

// Dark → light characters
const chars = "@#S%?*+;:,.";
const resolution = 8; // ASCII detail level

// Webcam video
const video = document.createElement("video");
video.autoplay = true;

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  if (video.videoWidth === 0) {
    requestAnimationFrame(animate);
    return;
  }

  // Compute ASCII grid size based on screen
  const cols = Math.floor(window.innerWidth / resolution);
  const rows = Math.floor(window.innerHeight / resolution);

  // Resize canvas to match ASCII grid
  canvas.width = cols;
  canvas.height = rows;

  // Draw webcam frame scaled down
  ctx.drawImage(video, 0, 0, cols, rows);

  const imageData = ctx.getImageData(0, 0, cols, rows).data;

  let ascii = "";

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4;

      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];

      // Luminance
      const brightness = 0.299 * r + 0.587 * g + 0.114 * b;

      const charIndex = Math.floor(
        (brightness / 255) * (chars.length - 1)
      );

      ascii += chars[charIndex];
    }
    ascii += "\n";
  }

  // Dynamically scale text to fill screen
  asciiEl.style.fontSize = `${resolution}px`;
  asciiEl.textContent = ascii;

  requestAnimationFrame(animate);
}

animate();
