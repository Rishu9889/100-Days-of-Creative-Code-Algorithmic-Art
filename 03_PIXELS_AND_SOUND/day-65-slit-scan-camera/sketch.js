// ==================================================
// Slit Scan Camera
// ==================================================

/*
  This sketch captures webcam frames and extracts
  a single vertical slice from each frame.

  Each slice is drawn sequentially across the canvas,
  turning time into a horizontal spatial dimension.
*/

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

// Offscreen canvas to read pixels
const buffer = document.createElement("canvas");
const bctx = buffer.getContext("2d");

let xOffset = 0; // current slit position

// =================================================
// Animation Loop
// ==================================================

function animate() {
  if (video.videoWidth === 0) {
    requestAnimationFrame(animate);
    return;
  }

  // Match buffer to video size
  buffer.width = video.videoWidth;
  buffer.height = video.videoHeight;

  // Draw current webcam frame
  bctx.drawImage(video, 0, 0);

  /*
    Extract a vertical slice from the center
    of the webcam frame.
  */
  const sliceX = Math.floor(video.videoWidth / 2);
  const sliceWidth = 1;

  // Draw the slice stretched to canvas height
  ctx.drawImage(
    buffer,
    sliceX,
    0,
    sliceWidth,
    video.videoHeight,
    xOffset,
    0,
    1,
    canvas.height
  );

  // Advance horizontal position
  xOffset++;

  // When canvas is full, start over
  if (xOffset >= canvas.width) {
    xOffset = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(animate);
}

animate();
