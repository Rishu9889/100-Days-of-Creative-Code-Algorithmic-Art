const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const sensitivitySlider = document.getElementById("sensitivity");
let THRESHOLD = parseInt(sensitivitySlider.value);

const fpsDisplay = document.getElementById("fps");
let lastTime = performance.now();
let frameCount = 0;

// Resize canvas
function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// Webcam video
const video = document.createElement("video");
video.autoplay = true;

navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
  video.srcObject = stream;
});

// Offscreen canvas
const buffer = document.createElement("canvas");
const bctx = buffer.getContext("2d");

let previousFrame = null;

// Update threshold dynamically
sensitivitySlider.addEventListener("input", () => {
  THRESHOLD = parseInt(sensitivitySlider.value);
});

// Motion trail settings
const TRAIL_ALPHA = 0.3;

// ==================================================
// Animation Loop
// ==================================================
function animate() {
  if (video.videoWidth === 0) {
    requestAnimationFrame(animate);
    return;
  }

  buffer.width = video.videoWidth;
  buffer.height = video.videoHeight;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  bctx.drawImage(video, 0, 0, buffer.width, buffer.height);
  const currentFrame = bctx.getImageData(0, 0, buffer.width, buffer.height);

  // Motion visualization with trail effect
  ctx.fillStyle = `rgba(0,0,0,${TRAIL_ALPHA})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (previousFrame) {
    const motionData = ctx.createImageData(buffer.width, buffer.height);

    for (let i = 0; i < currentFrame.data.length; i += 4) {
      const rDiff = Math.abs(currentFrame.data[i] - previousFrame.data[i]);
      const gDiff = Math.abs(currentFrame.data[i + 1] - previousFrame.data[i + 1]);
      const bDiff = Math.abs(currentFrame.data[i + 2] - previousFrame.data[i + 2]);

      const diff = (rDiff + gDiff + bDiff) / 3;

      if (diff > THRESHOLD) {
        // Colorful motion
        motionData.data[i] = 255;
        motionData.data[i + 1] = Math.random() * 255;
        motionData.data[i + 2] = Math.random() * 255;
        motionData.data[i + 3] = 200;
      } else {
        motionData.data[i + 3] = 0;
      }
    }

    ctx.putImageData(motionData, 0, 0);
  }

  previousFrame = currentFrame;

  // FPS calculation
  frameCount++;
  const now = performance.now();
  if (now - lastTime >= 1000) {
    fpsDisplay.textContent = `FPS: ${frameCount}`;
    frameCount = 0;
    lastTime = now;
  }

  requestAnimationFrame(animate);
}

animate();
