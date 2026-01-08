let grid;
let cols;
let rows;
let resolution = 10;
let isRunning = true;
let speedSlider;

function setup() {
    createCanvas(windowWidth, windowHeight);
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = createEmptyGrid();
    randomizeGrid();
    background(0);

    speedSlider = select('#speedSlider');
}

function draw() {
    // Control speed
    frameRate(parseInt(speedSlider.value()));

    // Semi-transparent background creates the "trailing" effect
    background(0, 40);

    if (mouseIsPressed) {
        let x = floor(mouseX / resolution);
        let y = floor(mouseY / resolution);
        if (x >= 0 && x < cols && y >= 0 && y < rows) {
            grid[x][y] = 1;
        }
    }

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            if (grid[i][j] == 1) {
                fill(0, 200, 255); // Cyan for living
                noStroke();
                rect(i * resolution, j * resolution, resolution - 1, resolution - 1);
            }
        }
    }

    if (isRunning) {
        let next = createEmptyGrid();

        for (let i = 0; i < cols; i++) {
            for (let j = 0; j < rows; j++) {
                let state = grid[i][j];
                let neighbors = countNeighbors(grid, i, j);

                if (state == 0 && neighbors == 3) {
                    next[i][j] = 1;
                } else if (state == 1 && (neighbors < 2 || neighbors > 3)) {
                    next[i][j] = 0;
                } else {
                    next[i][j] = state;
                }
            }
        }
        grid = next;
    }
}

function keyPressed() {
    if (key === 'c' || key === 'C') clearGrid();
    if (key === 'r' || key === 'R') randomizeGrid();
    if (key === ' ' || key === 'p' || key === 'P') togglePlay();
}

function togglePlay() {
    isRunning = !isRunning;
    let btn = select('#toggleBtn');
    if (isRunning) {
        btn.html('Pause');
    } else {
        btn.html('Play');
    }
}

function clearGrid() {
    grid = createEmptyGrid();
    background(0);
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
    background(0);
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
    let oldGrid = grid;
    let oldCols = cols;
    let oldRows = rows;

    resizeCanvas(windowWidth, windowHeight);
    cols = floor(width / resolution);
    rows = floor(height / resolution);
    grid = createEmptyGrid();

    // Attempt to copy over old state
    for (let i = 0; i < min(oldCols, cols); i++) {
        for (let j = 0; j < min(oldRows, rows); j++) {
            grid[i][j] = oldGrid[i][j];
        }
    }
    background(0);
}