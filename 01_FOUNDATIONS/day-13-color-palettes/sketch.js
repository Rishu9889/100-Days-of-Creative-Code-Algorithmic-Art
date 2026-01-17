const generateBtn = document.getElementById('generate');
const schemeSelect = document.getElementById('scheme');
const paletteDiv = document.getElementById('palette');
const hueSlider = document.getElementById('hueSlider');
const satSlider = document.getElementById('satSlider');
const brightSlider = document.getElementById('brightSlider');
const copyBtn = document.getElementById('copyHex');
const downloadBtn = document.getElementById('download');
const examplesDiv = document.getElementById('examples');

let currentPalette = [];

// HSB to HEX
function hsbToHex(h, s, b) {
  s /= 100;
  b /= 100;
  const k = (n) => (n + h / 60) % 6;
  const f = (n) => b - b * s * Math.max(Math.min(k(n), 4 - k(n), 1), 0);
  const r = Math.round(f(5) * 255);
  const g = Math.round(f(3) * 255);
  const bl = Math.round(f(1) * 255);
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + bl).toString(16).slice(1);
}

// Generate Palette based on schema
function generatePalette() {
  const baseHue = Math.floor(Math.random() * 360);
  const scheme = schemeSelect.value;
  let hues = [];

  switch(scheme){
    case 'monochromatic':
      hues = [baseHue, baseHue, baseHue];
      break;
    case 'complementary':
      hues = [baseHue, (baseHue + 180) % 360];
      break;
    case 'analogous':
      hues = [baseHue, (baseHue + 30) % 360, (baseHue - 30 + 360) % 360];
      break;
    case 'triadic':
      hues = [baseHue, (baseHue + 120) % 360, (baseHue + 240) % 360];
      break;
    case 'tetradic':
      hues = [baseHue, (baseHue + 90) % 360, (baseHue + 180) % 360, (baseHue + 270) % 360];
      break;
    default:
      hues = [baseHue, (baseHue + 180) % 360];
  }

  const s = parseInt(satSlider.value);
  const b = parseInt(brightSlider.value);

  currentPalette = hues.map(h => hsbToHex(h, s, b));
  updatePalette();
  generateExamples();
}

// Update Palette Display
function updatePalette() {
  paletteDiv.innerHTML = '';
  currentPalette.forEach((color, i) => {
    const div = document.createElement('div');
    div.classList.add('color-block');
    div.style.backgroundColor = color;
    div.innerHTML = `<span>${color}</span>`;

    div.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
      showTooltip(div, "Copied!");
    });

    paletteDiv.appendChild(div);
  });
}

// Tooltip
function showTooltip(element, text) {
  const tooltip = document.createElement('div');
  tooltip.classList.add('copied-tooltip');
  tooltip.innerText = text;
  element.appendChild(tooltip);
  setTimeout(() => tooltip.remove(), 1000);
}

// Examples below palette
function generateExamples() {
  examplesDiv.innerHTML = '';
  for(let i=0; i<10; i++){
    const hue = Math.floor(Math.random()*360);
    const sat = Math.floor(Math.random()*100);
    const bright = Math.floor(Math.random()*100);
    const color = hsbToHex(hue, sat, bright);
    const div = document.createElement('div');
    div.classList.add('example-block');
    div.style.backgroundColor = color;
    div.innerHTML = `<span>${color}</span>`;
    div.addEventListener('click', () => {
      navigator.clipboard.writeText(color);
      showTooltip(div, "Copied!");
    });
    examplesDiv.appendChild(div);
  }
}

// Sliders change
[hueSlider, satSlider, brightSlider].forEach(slider => {
  slider.addEventListener('input', () => {
    const h = parseInt(hueSlider.value);
    const s = parseInt(satSlider.value);
    const b = parseInt(brightSlider.value);
    currentPalette = currentPalette.map((_, i) => hsbToHex((h + i*30) % 360, s, b));
    updatePalette();
  });
});

// Buttons
generateBtn.addEventListener('click', generatePalette);

copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(currentPalette.join(', '));
  alert('Hex codes copied!');
});

downloadBtn.addEventListener('click', () => {
  const canvas = document.createElement('canvas');
  canvas.width = currentPalette.length * 100;
  canvas.height = 100;
  const ctx = canvas.getContext('2d');
  currentPalette.forEach((color, i) => {
    ctx.fillStyle = color;
    ctx.fillRect(i*100,0,100,100);
  });
  const link = document.createElement('a');
  link.download = 'palette.png';
  link.href = canvas.toDataURL();
  link.click();
});

// Initialize
generatePalette();