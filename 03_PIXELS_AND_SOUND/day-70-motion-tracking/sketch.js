// ==================================================
// Day 70 – Motion Tracking (Frame Differencing)
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Webcam video
const video = document.createElement("video");
video.autoplay = true;

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

// Offscreen canvas to process pixels
const buffer = document.createElement("canvas");
const bctx = buffer.getContext("2d");

let previousFrame = null;

// Motion sensitivity
const THRESHOLD = 40;

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  if (video.videoWidth === 0) {
    requestAnimationFrame(animate);
    return;
  }

  // Resize canvases
  buffer.width = video.videoWidth;
  buffer.height = video.videoHeight;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;

  // Draw current frame
  bctx.drawImage(video, 0, 0);
  const currentFrame = bctx.getImageData(
    0,
    0,
    buffer.width,
    buffer.height
  );

  // Clear output
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (previousFrame) {
    const motionData = ctx.createImageData(
      buffer.width,
      buffer.height
    );

    // Pixel-by-pixel comparison
    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const rDiff = Math.abs(
        currentFrame.data[i] - previousFrame.data[i]
      );
      const gDiff = Math.abs(
        currentFrame.data[i + 1] - previousFrame.data[i + 1]
      );
      const bDiff = Math.abs(
        currentFrame.data[i + 2] - previousFrame.data[i + 2]
      );

      const diff = (rDiff + gDiff + bDiff) / 3;

      if (diff > THRESHOLD) {
        // Motion detected → highlight
        motionData.data[i] = 255;
        motionData.data[i + 1] = 255;
        motionData.data[i + 2] = 255;
        motionData.data[i + 3] = 255;
      } else {
        // No motion
        motionData.data[i + 3] = 255;
      }
    }

    ctx.putImageData(motionData, 0, 0);
  }

  // Store frame for next comparison
  previousFrame = currentFrame;

  requestAnimationFrame(animate);
}

animate();
