// ================================
// Canvas setup
// ================================

// Get canvas and drawing context
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Set canvas size to match window
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Fill background once
ctx.fillStyle = "black";
ctx.fillRect(0, 0, canvas.width, canvas.height);

// ================================
// 🌱 L-SYSTEM LOGIC
// ================================

/*
  An L-System (Lindenmayer System) works in two phases:

  1. STRING GENERATION
     - Start with an initial string (axiom)
     - Repeatedly apply rewriting rules
     - This simulates biological growth

  2. STRING INTERPRETATION
     - Each character is treated as a drawing command
     - Turtle graphics are used to draw the structure
*/

// Initial axiom (starting instruction)
let sentence = "F";

// Production rules
// F expands into branches using brackets
const rules = {
  F: "F[+F]F[-F]F",
};

// Number of times rules are applied
// Higher values = more complex plant
const iterations = 5;

// -------------------------------
// Generate the L-system sentence
// -------------------------------
for (let i = 0; i < iterations; i++) {
  let nextSentence = "";

  for (let char of sentence) {
    // Replace character if rule exists
    nextSentence += rules[char] || char;
  }

  sentence = nextSentence;
}

// ================================
// 🌿 TURTLE GRAPHICS LOGIC
// ================================

/*
  Turtle graphics logic:

  - The turtle has:
      • position (x, y)
      • direction (angle)

  - Commands:
      F : move forward & draw
      + : rotate right
      - : rotate left
      [ : save current state
      ] : restore saved state
*/

// Turtle starting position (bottom center)
let x = canvas.width / 2;
let y = canvas.height;

// Initial direction (upwards)
let angle = -Math.PI / 2;

// Rotation angle for branches
const angleStep = Math.PI / 6;

// Length of each branch segment
const length = canvas.height * 0.015;

// Stack to store turtle states
// Each state = { x, y, angle }
const stack = [];

// Drawing style
ctx.strokeStyle = "#2a9d8f";
ctx.lineWidth = 2;

ctx.beginPath();
ctx.moveTo(x, y);

// -------------------------------
// Interpret the generated sentence
// -------------------------------
for (let char of sentence) {
  if (char === "F") {
    // Move forward in the current direction
    const newX = x + Math.cos(angle) * length;
    const newY = y + Math.sin(angle) * length;

    ctx.lineTo(newX, newY);

    // Update turtle position
    x = newX;
    y = newY;
  } 
  else if (char === "+") {
    // Rotate right
    angle += angleStep;
  } 
  else if (char === "-") {
    // Rotate left
    angle -= angleStep;
  } 
  else if (char === "[") {
    // Save current turtle state
    stack.push({ x, y, angle });
  } 
  else if (char === "]") {
    // Restore last saved turtle state
    const state = stack.pop();
    x = state.x;
    y = state.y;
    angle = state.angle;

    // Move drawing cursor without drawing a line
    ctx.moveTo(x, y);
  }
}

// Render the full plant
ctx.stroke();
