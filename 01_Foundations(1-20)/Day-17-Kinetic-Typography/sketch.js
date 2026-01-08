const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


const text = "100-Days-of-Creative-Code";
const words = text.split(" ");

const fontSize = 80;
ctx.font = `${fontSize}px sans-serif`;
ctx.textAlign = "center";
ctx.textBaseline = "middle";

const letterSpacing = fontSize * 0.6;
const wordSpacing = fontSize * 1.2;

let time = 0;
let lastTime = 0;

let mouseX = canvas.width / 2;

canvas.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
});


function animate(timestamp) {
  const delta = (timestamp - lastTime) * 0.001 || 0;
  lastTime = timestamp;
  time += delta;

  ctx.fillStyle = "#0e0e0e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const waveStrength = (mouseX / canvas.width) * 40;

  const centerY = canvas.height / 2;

  const wordDelay = 1.2;

  let currentX =
    canvas.width / 2 -
    ((text.length - 1) * letterSpacing +
      (words.length - 1) * (wordSpacing - letterSpacing)) /
      2;

  let globalIndex = 0;

  for (let w = 0; w < words.length; w++) {
    const wordStartTime = w * wordDelay;

    if (time < wordStartTime) break;

    const word = words[w];

    for (let i = 0; i < word.length; i++) {
      const char = word[i];

      const offsetY =
        Math.sin(time * 4 + globalIndex * 0.4) * waveStrength;

      ctx.fillStyle = "#eaeaea";
      ctx.fillText(
        char,
        currentX + i * letterSpacing,
        centerY + offsetY
      );

      globalIndex++;
    }

    currentX += word.length * letterSpacing + wordSpacing;
  }

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
