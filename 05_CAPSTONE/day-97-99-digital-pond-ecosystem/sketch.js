/* ==================================================
   Digital Pond Ecosystem — Main Application
   Days 97-99 Capstone Project
   
   This file initializes the simulation and handles
   user interactions and UI updates.
   ================================================== */

/**
 * Main Application Class
 * Manages the canvas, animation loop, and UI interactions
 */
class PondApp {
  constructor() {
    // Get canvas element
    this.canvas = document.getElementById('pond-canvas');
    this.ctx = this.canvas.getContext('2d');

    // Initialize canvas size
    this.resizeCanvas();

    // Create ecosystem
    this.ecosystem = new Ecosystem(this.canvas);

    // Animation state
    this.lastTime = 0;
    this.animationId = null;

    // Bind methods
    this.animate = this.animate.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Setup event listeners
    this.setupEventListeners();
    this.setupUIControls();

    // Initialize ecosystem with default values
    this.initializeEcosystem();

    // Start animation
    this.start();

    console.log('🌿 Digital Pond Ecosystem initialized!');
  }

  /**
   * Initialize the ecosystem with UI slider values
   */
  initializeEcosystem() {
    const fishCount = parseInt(document.getElementById('fish-spawn').value);
    const predatorCount = parseInt(document.getElementById('predator-spawn').value);
    const plantCount = parseInt(document.getElementById('plant-spawn').value);

    this.ecosystem.initialize(fishCount, predatorCount, plantCount);
  }

  /**
   * Resize canvas to fill container
   */
  resizeCanvas() {
    const container = document.getElementById('pond-container');
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;

    if (this.ecosystem) {
      this.ecosystem.resize(this.canvas.width, this.canvas.height);
    }
  }

  /**
   * Handle window resize events
   */
  handleResize() {
    this.resizeCanvas();
  }

  /**
   * Setup event listeners for user interactions
   */
  setupEventListeners() {
    // Window resize
    window.addEventListener('resize', this.handleResize);

    // Canvas click - add ripple
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.ecosystem.addRipple(x, y);
    });

    // Right-click - feed area (spawn algae)
    this.canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.ecosystem.feedArea(x, y);
    });

    // Mouse wheel - zoom (future enhancement)
    this.canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      // Could be used for zoom functionality
    });

    // Info panel toggle
    const infoToggle = document.getElementById('info-toggle');
    const infoPanel = document.getElementById('info-panel');

    infoToggle.addEventListener('click', () => {
      infoPanel.classList.toggle('hidden');
    });
  }

  /**
   * Setup UI control interactions
   */
  setupUIControls() {
    // Speed slider
    const speedSlider = document.getElementById('speed-slider');
    const speedValue = document.getElementById('speed-value');

    speedSlider.addEventListener('input', () => {
      const value = parseFloat(speedSlider.value);
      EcosystemConfig.simulationSpeed = value;
      speedValue.textContent = value.toFixed(1) + 'x';
    });

    // Fish spawn slider
    const fishSpawn = document.getElementById('fish-spawn');
    const fishSpawnValue = document.getElementById('fish-spawn-value');

    fishSpawn.addEventListener('input', () => {
      fishSpawnValue.textContent = fishSpawn.value;
    });

    // Predator spawn slider
    const predatorSpawn = document.getElementById('predator-spawn');
    const predatorSpawnValue = document.getElementById('predator-spawn-value');

    predatorSpawn.addEventListener('input', () => {
      predatorSpawnValue.textContent = predatorSpawn.value;
    });

    // Plant spawn slider
    const plantSpawn = document.getElementById('plant-spawn');
    const plantSpawnValue = document.getElementById('plant-spawn-value');

    plantSpawn.addEventListener('input', () => {
      plantSpawnValue.textContent = plantSpawn.value;
    });

    // Mutation rate slider
    const mutationRate = document.getElementById('mutation-rate');
    const mutationValue = document.getElementById('mutation-value');

    mutationRate.addEventListener('input', () => {
      const value = parseFloat(mutationRate.value);
      EcosystemConfig.mutationRate = value;
      mutationValue.textContent = Math.round(value * 100) + '%';
    });

    // Pause button
    const pauseBtn = document.getElementById('pause-btn');

    pauseBtn.addEventListener('click', () => {
      EcosystemConfig.paused = !EcosystemConfig.paused;

      if (EcosystemConfig.paused) {
        pauseBtn.textContent = '▶️ Resume';
        pauseBtn.classList.add('paused');
      } else {
        pauseBtn.textContent = '⏸️ Pause';
        pauseBtn.classList.remove('paused');
      }
    });

    // Reset button
    const resetBtn = document.getElementById('reset-btn');

    resetBtn.addEventListener('click', () => {
      this.initializeEcosystem();
    });

    // Add entity buttons
    document.getElementById('add-fish-btn').addEventListener('click', () => {
      const pos = new Vector2D(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height
      );
      this.ecosystem.spawnFish(pos);
    });

    document.getElementById('add-predator-btn').addEventListener('click', () => {
      const pos = new Vector2D(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height
      );
      this.ecosystem.spawnPredator(pos);
    });

    document.getElementById('add-plant-btn').addEventListener('click', () => {
      const pos = new Vector2D(
        Math.random() * this.canvas.width,
        Math.random() * this.canvas.height
      );
      this.ecosystem.spawnPlant(pos);
    });
  }

  /**
   * Update UI statistics display
   */
  updateStats() {
    document.getElementById('fish-count').textContent = EcosystemStats.fishCount;
    document.getElementById('predator-count').textContent = EcosystemStats.predatorCount;
    document.getElementById('plant-count').textContent = EcosystemStats.plantCount;
    document.getElementById('algae-count').textContent = EcosystemStats.algaeCount;
    document.getElementById('birth-count').textContent = EcosystemStats.totalBirths;
    document.getElementById('death-count').textContent = EcosystemStats.totalDeaths;
    document.getElementById('sim-time').textContent = Math.floor(EcosystemStats.simulationTime) + 's';
  }

  /**
   * Main animation loop
   */
  animate(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - this.lastTime;
    this.lastTime = timestamp;

    // Cap delta time to prevent large jumps
    const cappedDelta = Math.min(deltaTime, 50);

    // Update ecosystem
    this.ecosystem.update(cappedDelta);

    // Render
    this.ecosystem.render();

    // Update stats (every 10 frames for performance)
    if (Math.floor(timestamp / 100) % 3 === 0) {
      this.updateStats();
    }

    // Continue animation
    this.animationId = requestAnimationFrame(this.animate);
  }

  /**
   * Start the animation
   */
  start() {
    this.lastTime = performance.now();
    this.animationId = requestAnimationFrame(this.animate);
  }

  /**
   * Stop the animation
   */
  stop() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }
}

/* ==================================================
   Initialize Application on DOM Ready
   ================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Create the pond application
  window.pondApp = new PondApp();

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    switch (e.key.toLowerCase()) {
      case ' ': // Spacebar - toggle pause
        e.preventDefault();
        document.getElementById('pause-btn').click();
        break;
      case 'r': // R - reset
        document.getElementById('reset-btn').click();
        break;
      case 'f': // F - add fish
        document.getElementById('add-fish-btn').click();
        break;
      case 'p': // P - add predator
        document.getElementById('add-predator-btn').click();
        break;
      case 't': // T - add plant (t for tree/vegetation)
        document.getElementById('add-plant-btn').click();
        break;
      case 'i': // I - toggle info
        document.getElementById('info-toggle').click();
        break;
    }
  });

  // Log welcome message
  console.log(`
    🌊 ================================================== 🌊
    |                                                    |
    |        Digital Pond Ecosystem — Days 97-99         |
    |        100 Days of Creative Code Challenge         |
    |                                                    |
    |    Keyboard Shortcuts:                             |
    |    SPACE - Pause/Resume                            |
    |    R     - Reset simulation                        |
    |    F     - Add fish                                |
    |    P     - Add predator                            |
    |    T     - Add plant                               |
    |    I     - Toggle info panel                       |
    |                                                    |
    |    Mouse:                                          |
    |    Left click  - Create ripple                     |
    |    Right click - Feed area (spawn algae)           |
    |                                                    |
    🌊 ================================================== 🌊
  `);
});

/* ==================================================
   Additional Utility Functions
   ================================================== */

/**
 * Download canvas as image
 * @param {string} filename - Name for the downloaded file
 */
function downloadCanvasImage(filename = 'pond-ecosystem.png') {
  const canvas = document.getElementById('pond-canvas');
  const link = document.createElement('a');
  link.download = filename;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

/**
 * Get ecosystem statistics as JSON
 * @returns {object} Current ecosystem stats
 */
function getEcosystemStats() {
  return {
    fish: EcosystemStats.fishCount,
    predators: EcosystemStats.predatorCount,
    plants: EcosystemStats.plantCount,
    algae: EcosystemStats.algaeCount,
    births: EcosystemStats.totalBirths,
    deaths: EcosystemStats.totalDeaths,
    time: EcosystemStats.simulationTime,
    config: { ...EcosystemConfig }
  };
}

// Expose utility functions globally
window.downloadCanvasImage = downloadCanvasImage;
window.getEcosystemStats = getEcosystemStats;
