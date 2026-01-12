// Moiré Patterns - p5.js implementation
// Day 14 of Creative Coding

let patternType = 'circles';
let rotationAngle = 15; // degrees
let spacing = 50; // pixels
let offsetX = 10; // pixels
let offsetY = 10; // pixels
let colorScheme = 'sunset';
let animationSpeed = 1.0;
let time = 0;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let manualOffsetX = 0;
let manualOffsetY = 0;

// Color palettes
const colorPalettes = {
    sunset: { primary: '#ff7e5f', secondary: '#feb47b', bg: '#0a0a1a' },
    ocean: { primary: '#86a8e7', secondary: '#91eae4', bg: '#0a0a1a' },
    purple: { primary: '#667eea', secondary: '#764ba2', bg: '#0a0a1a' },
    pink: { primary: '#f093fb', secondary: '#f5576c', bg: '#0a0a1a' },
    blue: { primary: '#4facfe', secondary: '#00f2fe', bg: '#0a0a1a' }
};

function setup() {
    const canvasContainer = document.getElementById('p5-canvas');
    const canvas = createCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
    canvas.parent('p5-canvas');
    
    // Set up event listeners for controls
    setupControls();
    
    // Set initial canvas background
    background(colorPalettes[colorScheme].bg);
    
    // Set drawing defaults
    strokeWeight(2);
    noFill();
}

function draw() {
    // Clear canvas with background color
    background(colorPalettes[colorScheme].bg);
    
    // Calculate center with mouse influence
    const centerX = width / 2 + (mouseX - width / 2) * 0.1;
    const centerY = height / 2 + (mouseY - height / 2) * 0.1;
    
    // Get colors from palette
    const primaryColor = color(colorPalettes[colorScheme].primary);
    const secondaryColor = color(colorPalettes[colorScheme].secondary);
    
    // Calculate total offset including manual drag
    const totalOffsetX = offsetX + manualOffsetX;
    const totalOffsetY = offsetY + manualOffsetY;
    
    // Draw first layer
    stroke(primaryColor);
    drawPatternLayer(
        centerX - totalOffsetX / 2, 
        centerY - totalOffsetY / 2, 
        0, // No rotation for first layer
        primaryColor
    );
    
    // Draw second layer with rotation and offset
    stroke(secondaryColor);
    drawPatternLayer(
        centerX + totalOffsetX / 2, 
        centerY + totalOffsetY / 2, 
        rotationAngle, // Rotation for second layer
        secondaryColor
    );
    
    // Increment time for animations
    time += 0.02 * animationSpeed;
}

function drawPatternLayer(x, y, angle, color) {
    push();
    
    // Set color
    stroke(color);
    
    // Move to center point
    translate(x, y);
    
    // Apply rotation if needed
    if (angle !== 0) {
        rotate(radians(angle));
    }
    
    // Draw the selected pattern
    switch(patternType) {
        case 'circles':
            drawCircles();
            break;
        case 'lines':
            drawLines();
            break;
        case 'grid':
            drawGrid();
            break;
        case 'dots':
            drawDots();
            break;
        case 'spiral':
            drawSpiral();
            break;
        case 'waves':
            drawWaves();
            break;
    }
    
    pop();
}

function drawCircles() {
    const maxRadius = dist(0, 0, width, height);
    const circleCount = Math.floor(maxRadius / spacing);
    
    for (let i = 1; i <= circleCount; i++) {
        const radius = i * spacing;
        ellipse(0, 0, radius * 2);
    }
}

function drawLines() {
    const lineCount = Math.ceil(width / spacing) + 2;
    
    for (let i = -lineCount/2; i <= lineCount/2; i++) {
        const x = i * spacing;
        line(x, -height, x, height * 2);
    }
}

function drawGrid() {
    const lineCountX = Math.ceil(width / spacing) + 2;
    const lineCountY = Math.ceil(height / spacing) + 2;
    
    // Vertical lines
    for (let i = -lineCountX/2; i <= lineCountX/2; i++) {
        const x = i * spacing;
        line(x, -height, x, height * 2);
    }
    
    // Horizontal lines
    for (let i = -lineCountY/2; i <= lineCountY/2; i++) {
        const y = i * spacing;
        line(-width, y, width * 2, y);
    }
}

function drawDots() {
    const dotCountX = Math.ceil(width / spacing) + 2;
    const dotCountY = Math.ceil(height / spacing) + 2;
    const dotRadius = Math.max(2, spacing / 8);
    
    for (let i = -dotCountX/2; i <= dotCountX/2; i++) {
        for (let j = -dotCountY/2; j <= dotCountY/2; j++) {
            const x = i * spacing;
            const y = j * spacing;
            
            ellipse(x, y, dotRadius * 2);
        }
    }
}

function drawSpiral() {
    const maxRadius = dist(0, 0, width, height);
    const coilCount = 8;
    
    beginShape();
    for (let angle = 0; angle < Math.PI * 2 * coilCount; angle += 0.05) {
        const radius = spacing * angle / (Math.PI * 2);
        if (radius > maxRadius) break;
        
        const x = cos(angle + time) * radius;
        const y = sin(angle + time) * radius;
        
        vertex(x, y);
    }
    endShape();
}

function drawWaves() {
    const amplitude = spacing / 3;
    const frequency = 0.05;
    
    beginShape();
    for (let x = -width; x < width * 2; x += 2) {
        const y = sin((x + width/2) * frequency + time) * amplitude;
        vertex(x, y);
    }
    endShape();
}

function windowResized() {
    const canvasContainer = document.getElementById('p5-canvas');
    resizeCanvas(canvasContainer.clientWidth, canvasContainer.clientHeight);
}

// Mouse interaction
function mousePressed() {
    isDragging = true;
    dragStartX = manualOffsetX;
    dragStartY = manualOffsetY;
}

function mouseReleased() {
    isDragging = false;
}

function mouseDragged() {
    if (isDragging) {
        manualOffsetX = dragStartX + (mouseX - pmouseX);
        manualOffsetY = dragStartY + (mouseY - pmouseY);
    }
}

// Control setup
function setupControls() {
    // Get DOM elements
    const angleSlider = document.getElementById('angleSlider');
    const spacingSlider = document.getElementById('spacingSlider');
    const offsetSlider = document.getElementById('offsetSlider');
    const speedSlider = document.getElementById('speedSlider');
    const angleValue = document.getElementById('angleValue');
    const spacingValue = document.getElementById('spacingValue');
    const offsetValue = document.getElementById('offsetValue');
    const speedValue = document.getElementById('speedValue');
    const patternButtons = document.querySelectorAll('.pattern-btn');
    const colorOptions = document.querySelectorAll('.color-option');
    const resetBtn = document.getElementById('resetBtn');
    
    // Update slider value displays
    angleSlider.addEventListener('input', function() {
        rotationAngle = parseInt(this.value);
        angleValue.textContent = rotationAngle;
    });
    
    spacingSlider.addEventListener('input', function() {
        spacing = parseInt(this.value);
        spacingValue.textContent = spacing;
    });
    
    offsetSlider.addEventListener('input', function() {
        offsetX = parseInt(this.value);
        offsetY = parseInt(this.value);
        offsetValue.textContent = offsetX;
    });
    
    speedSlider.addEventListener('input', function() {
        animationSpeed = parseFloat(this.value);
        speedValue.textContent = animationSpeed.toFixed(1);
    });
    
    // Pattern selection
    patternButtons.forEach(button => {
        button.addEventListener('click', function() {
            patternButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            patternType = this.getAttribute('data-pattern');
        });
    });
    
    // Color selection
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            colorScheme = this.getAttribute('data-color');
        });
    });
    
    // Reset button
    resetBtn.addEventListener('click', function() {
        rotationAngle = 15;
        spacing = 50;
        offsetX = 10;
        offsetY = 10;
        animationSpeed = 1;
        manualOffsetX = 0;
        manualOffsetY = 0;
        
        angleSlider.value = rotationAngle;
        spacingSlider.value = spacing;
        offsetSlider.value = offsetX;
        speedSlider.value = animationSpeed;
        
        angleValue.textContent = rotationAngle;
        spacingValue.textContent = spacing;
        offsetValue.textContent = offsetX;
        speedValue.textContent = animationSpeed.toFixed(1);
        
        // Reset pattern and color to default
        patternButtons.forEach(btn => btn.classList.remove('active'));
        document.querySelector('[data-pattern="circles"]').classList.add('active');
        patternType = 'circles';
        
        colorOptions.forEach(opt => opt.classList.remove('active'));
        document.querySelector('[data-color="sunset"]').classList.add('active');
        colorScheme = 'sunset';
    });
}