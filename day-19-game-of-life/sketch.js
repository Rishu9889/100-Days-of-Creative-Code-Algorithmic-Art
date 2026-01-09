let grid;
let cols;
let rows;
let resolution = 10;
let isRunning = true;
let speedSlider;   

function setup() {
    createCanvas(windowWidth, windowHeight);

    // Initialize theme
    currentTheme = themes.classic;

    // Initialize slider
    speedSlider = select('#speedSlider');

    // Initial Grid
    resetGrid();
    randomizeGrid();
}

function resetGrid() {
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = createEmptyGrid();
    generationCount = 0;
    updateGenCount();
}

function updateResolution(val) {
    resolution = parseInt(val);
    resetGrid();
    background(currentTheme.bg);
}

function changeTheme(themeName) {
    if (themes[themeName]) {
        currentTheme = themes[themeName];
        background(currentTheme.bg);
    }
}

function draw() {
    // Control speed
    frameRate(parseInt(speedSlider.value()));

    // Semi-transparent background for trails
    background(currentTheme.bg, currentTheme.trail);

    // Draw cells
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                fill(currentTheme.cell);
                noStroke();
                rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
            }
        }
    }

    // Interactive Drawing
    if (mouseIsPressed && mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        let x = floor(mouseX / resolution);
        let y = floor(mouseY / resolution);
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[x][y] = 1;
        }
    }

    // Game Logic
    if (isRunning) {
        let next = createEmptyGrid();
        let changed = false;

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = countNeighbors(grid, i, j);

                if (state == 0 && neighbors == 3) {
                    next[i][j] = 1;
                    changed = true;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                    changed = true;
                } else {
                    next[i][j] = state;
                }
            }
        }
        grid = next;
        if (changed) {
            generationCount++;
            updateGenCount();
        }
    }
}

function updateGenCount() {
    select('#genCount').html(generationCount);
}

function keyPressed() {
    if (key === 'c' || key === 'C') clearGrid();
    if (key === 'r' || key === 'R') randomizeGrid();
    if (key === ' ' || key === 'p' || key === 'P') togglePlay();
}

function togglePlay() {
    isRunning = !isRunning;
    let btn = select('#toggleBtn');
    btn.html(isRunning ? 'Pause' : 'Play');
}

function clearGrid() {
    grid = createEmptyGrid();
    generationCount = 0;
    updateGenCount();
    background(currentTheme.bg);
}

function createEmptyGrid() {
    let arr = new Array(cols);
    for (let i = 0; i < arr.length; i++) {
        arr[i] = new Array(rows).fill(0);
    }
    return arr;
}

function randomizeGrid() {
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            grid[i][j] = floor(random(2));
        }
    }
    generationCount = 0;
    updateGenCount();
    background(currentTheme.bg);
}

function countNeighbors(grid, x, y) {
    let sum = 0;
    for (let i = -1; i < 2; i++) {
        for (let j = -1; j < 2; j++) {
            let col = (x + i + cols) % cols;
            let row = (y + j + rows) % rows;
            sum += grid[col][row];
        }
    }
    sum -= grid[x][y];
    return sum;
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    // On resize, we create a new empty grid. 
    // Ideally we would copy old data, but mapping index changes is complex. 
    // Simply clearing is better than randomizing which destroys user intent.
    grid = createEmptyGrid();

    // Optional: Could center the old content, but for now just clear to avoid "static" noise bugs.
    background(currentTheme.bg);
}

function applyPattern(patternName) {
    // Clear first for clean slate? Or maybe overlay? Let's overlay but maybe center it.
    // For simplicity, let's clear then place in center.
    clearGrid();

    let cx = floor(cols / 2);
    let cy = floor(rows / 2);

    let pattern = [];

    if (patternName === 'glider') {
        pattern = [[0, -1], [1, 0], [-1, 1], [0, 1], [1, 1]];
    } else if (patternName === 'pulsar') {
        // "Diehard" - disappearing pattern
        pattern = [[-3, 0], [-2, 0], [-2, 1], [2, 1], [3, 1], [4, 1], [3, -1]];
    } else if (patternName === 'gosper') {
        // Actual Gosper Glider Gun coordinates (relative to center)
        pattern = [
            [-13, -4], [-14, -4], [-13, -3], [-14, -3], // Left Block
            [-4, -4], [-4, -3], [-4, -2], [-3, -5], [-3, -1], [-2, -6], [-2, 0], [-1, -6], [-1, 0], // Left arc
            [0, -3], [1, -5], [1, -1], [2, -4], [2, -3], [2, -2], [3, -3], // Head and Right arc
            [7, -5], [7, -4], [7, -3], [8, -5], [8, -4], [8, -3], [9, -6], [9, -2], // Right block structure
            [11, -7], [11, -1], // Far right dots
            [21, -5], [21, -4], [22, -5], [22, -4] // Far right block
        ];
    } else if (patternName === 'diehard') {
        pattern = [[-3, 0], [-2, 0], [-2, 1], [2, 1], [3, 1], [4, 1], [3, -1]];
    } else if (patternName === 'lwss') {
        // Lightweight spaceship
        pattern = [[-2, -1], [1, -1], [-3, 0], [-3, 1], [1, 1], [-3, 2], [-2, 2], [-1, 2], [0, 2]];
    }

    for (let p of pattern) {
        let x = cx + p[0];
        let y = cy + p[1];
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[x][y] = 1;
        }
    }

    // Reset selection so user can re-select same one if they want
    select('#patternSelect').value('');
}