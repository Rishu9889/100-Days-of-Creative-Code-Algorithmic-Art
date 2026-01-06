// ================================
// Canvas Setup
// ================================

// Get the canvas element and its 2D drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Make the canvas fill the entire browser window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================================
// 🎨 Color Palette Logic
// ================================

/*
  In generative art, color palettes are treated as data.

  Instead of choosing random colors freely (which often
  leads to visual noise), we define curated palettes
  and introduce randomness only in selecting *which*
  palette to use.
*/

// Each palette is an array of harmonious colors
const palettes = [
  // Earthy / natural tones
  ["#264653", "#2a9d8f", "#e9c46a", "#f4a261", "#e76f51"],

  // Ocean / cool tones
  ["#03045e", "#0077b6", "#00b4d8", "#90dbf4", "#caf0f8"],

  // Vibrant / high-contrast tones
  ["#ffbe0b", "#fb5607", "#ff006e", "#8338ec", "#3a86ff"],

  // Classic / muted tones
  ["#f1faee", "#e63946", "#457b9d", "#1d3557"],

  // Neon / futuristic tones
  ["#f72585", "#b5179e", "#7209b7", "#560bad", "#480ca8"],
];

// Randomly select one palette
// This introduces controlled randomness
const palette = palettes[Math.floor(Math.random() * palettes.length)];

// ================================
// 🧱 Palette Visualization Logic
// ================================

/*
  To visualize the palette clearly, the canvas is divided
  into vertical bands. Each band is filled with one color
  from the selected palette.

  This makes it easy to see:
  - color harmony
  - contrast
  - overall mood of the palette
*/

// Width of each vertical color band
const bandWidth = canvas.width / palette.length;

// Draw each color as a vertical strip
palette.forEach((color, index) => {
  ctx.fillStyle = color;

  ctx.fillRect(
    index * bandWidth, // x-position
    0,                 // y-position
    bandWidth,         // width
    canvas.height      // height
  );
});
