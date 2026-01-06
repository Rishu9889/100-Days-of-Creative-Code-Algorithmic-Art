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

let audioCtx, analyser, dataArray;

// FFT size (time-domain resolution)
const FFT_SIZE = 1024;

// Energy history for adaptive threshold
const energyHistory = [];
const HISTORY_SIZE = 60;

// Beat state
let beatFlash = 0;
let lastBeatTime = 0;
let previousEnergy = 0;

// Minimum time between beats (ms)
const BEAT_COOLDOWN = 300;

// ==================================================
// Start Audio (required by browser)
// ==================================================

document.getElementById("start").addEventListener("click", async () => {
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  const source = audioCtx.createMediaStreamSource(stream);

  analyser = audioCtx.createAnalyser();
  analyser.fftSize = FFT_SIZE;

  dataArray = new Uint8Array(analyser.fftSize);
  source.connect(analyser);

  animate();
});

// ==================================================
// Beat Detection Logic
// ==================================================

function detectBeat() {
  analyser.getByteTimeDomainData(dataArray);

  // ----------------------------------------------
  // 1. Instantaneous Energy
  // ----------------------------------------------
  let instantEnergy = 0;
  for (let i = 0; i < dataArray.length; i++) {
    const sample = dataArray[i] - 128; // center around 0
    instantEnergy += sample * sample;
  }

  // ----------------------------------------------
  // 2. Maintain Energy History
  // ----------------------------------------------
  energyHistory.push(instantEnergy);
  if (energyHistory.length > HISTORY_SIZE) {
    energyHistory.shift();
  }

  const avgEnergy =
    energyHistory.reduce((a, b) => a + b, 0) / energyHistory.length;

  // ----------------------------------------------
  // 3. Energy Slope (prevents speech flicker)
  // ----------------------------------------------
  const energyRise = instantEnergy - previousEnergy;
  previousEnergy = instantEnergy;

  const now = performance.now();

  // ----------------------------------------------
  // 4. Beat Conditions (ALL must be true)
  // ----------------------------------------------
  const isBeat =
    instantEnergy > avgEnergy * 1.7 &&        // strong spike
    energyRise > avgEnergy * 0.12 &&           // rising edge
    now - lastBeatTime > BEAT_COOLDOWN;        // cooldown

  if (isBeat) {
    beatFlash = 1;
    lastBeatTime = now;
  }
}

// ==================================================
// Rendering
// ==================================================

function draw() {
  // Fading background (trails)
  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Beat visual
  if (beatFlash > 0.01) {
    ctx.fillStyle = `rgba(255, 70, 70, ${beatFlash})`;
    ctx.beginPath();
    ctx.arc(
      canvas.width / 2,
      canvas.height / 2,
      80 + beatFlash * 140,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // Fast decay = discrete beat, not flicker
    beatFlash *= 0.82;
  }
}

// ==================================================
// Animation Loop
// ==================================================

function animate() {
  detectBeat();
  draw();
  requestAnimationFrame(animate);
}
