// ==================================================
// Canvas Setup
// ==================================================

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ==================================================
// Audio Setup
// ==================================================

let audioCtx;
let analyser;
let dataArray;
let bufferLength;

// Button required by browser autoplay policies
document.getElementById("start").addEventListener("click", async () => {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  // Request microphone access
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioCtx.createMediaStreamSource(stream);

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  bufferLength = analyser.fftSize;
  dataArray = new Uint8Array(bufferLength);

  source.connect(analyser);

  animate();
});

// ==================================================
// Rendering
// ==================================================

function drawWaveform() {
  analyser.getByteTimeDomainData(dataArray);

  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00ffcc";
  ctx.beginPath();

  const sliceWidth = canvas.width / bufferLength;
  let x = 0;

  for (let i = 0; i < bufferLength; i++) {
    // Convert [0,255] → [-1,1]
    const v = dataArray[i] / 128.0 - 1;
    const y = canvas.height / 2 + v * canvas.height / 3;

    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);

    x += sliceWidth;
  }

  ctx.stroke();
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  drawWaveform();
  requestAnimationFrame(animate);
}
