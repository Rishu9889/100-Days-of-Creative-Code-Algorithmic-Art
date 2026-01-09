/* ==================================================
   Digital Pond Ecosystem — Core Ecosystem Logic
   Days 97-99 Capstone Project
   
   This file contains the simulation engine and
   ecosystem management logic.
   ================================================== */

/**
 * EcosystemConfig - Configuration settings for the simulation
 * Allows fine-tuning of ecosystem parameters
 */
const EcosystemConfig = {
    // Simulation settings
    simulationSpeed: 1.0,
    paused: false,

    // Population limits (to prevent explosion)
    maxFish: 100,
    maxPredators: 20,
    maxPlants: 50,
    maxAlgae: 200,

    // Energy constants
    baseEnergy: 100,
    energyDecayRate: 0.1,        // Energy lost per frame
    reproductionThreshold: 150,   // Energy needed to reproduce
    reproductionCost: 60,         // Energy cost of reproduction

    // Movement constants
    fishSpeed: 2.0,
    predatorSpeed: 2.5,

    // Behavior weights (for steering)
    separationWeight: 1.5,
    alignmentWeight: 1.0,
    cohesionWeight: 1.0,
    foodSeekWeight: 2.0,
    predatorAvoidWeight: 3.0,

    // Perception ranges
    fishPerception: 60,
    predatorPerception: 80,

    // Mutation rate for reproduction
    mutationRate: 0.1,

    // Food chain energy transfer efficiency (%)
    energyTransferRate: 0.5,

    // Plant growth settings
    plantGrowthRate: 0.02,
    maxPlantSize: 30,

    // Algae settings
    algaeSpawnRate: 0.01,
    algaeEnergy: 15
};

/**
 * Statistics - Tracks ecosystem metrics
 */
const EcosystemStats = {
    fishCount: 0,
    predatorCount: 0,
    plantCount: 0,
    algaeCount: 0,
    totalBirths: 0,
    totalDeaths: 0,
    simulationTime: 0,

    // Reset all stats
    reset() {
        this.fishCount = 0;
        this.predatorCount = 0;
        this.plantCount = 0;
        this.algaeCount = 0;
        this.totalBirths = 0;
        this.totalDeaths = 0;
        this.simulationTime = 0;
    },

    // Record a birth event
    recordBirth(type) {
        this.totalBirths++;
        this[`${type}Count`]++;
    },

    // Record a death event
    recordDeath(type) {
        this.totalDeaths++;
        this[`${type}Count`]--;
    }
};

/**
 * Vector2D - Simple 2D vector class for physics calculations
 * Used for position, velocity, acceleration, and forces
 */
class Vector2D {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    // Create copy of this vector
    clone() {
        return new Vector2D(this.x, this.y);
    }

    // Add another vector
    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    // Subtract another vector
    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    // Multiply by scalar
    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    // Divide by scalar
    div(n) {
        if (n !== 0) {
            this.x /= n;
            this.y /= n;
        }
        return this;
    }

    // Get magnitude (length) of vector
    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    // Normalize to unit vector
    normalize() {
        const m = this.mag();
        if (m > 0) this.div(m);
        return this;
    }

    // Set magnitude to specific value
    setMag(n) {
        return this.normalize().mult(n);
    }

    // Limit magnitude to maximum
    limit(max) {
        if (this.mag() > max) {
            this.setMag(max);
        }
        return this;
    }

    // Get heading angle in radians
    heading() {
        return Math.atan2(this.y, this.x);
    }

    // Rotate vector by angle
    rotate(angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        const x = this.x * cos - this.y * sin;
        const y = this.x * sin + this.y * cos;
        this.x = x;
        this.y = y;
        return this;
    }

    // Distance to another vector
    dist(v) {
        return Math.sqrt((this.x - v.x) ** 2 + (this.y - v.y) ** 2);
    }

    // Static methods for creating vectors
    static random() {
        const angle = Math.random() * Math.PI * 2;
        return new Vector2D(Math.cos(angle), Math.sin(angle));
    }

    static sub(v1, v2) {
        return new Vector2D(v1.x - v2.x, v1.y - v2.y);
    }

    static add(v1, v2) {
        return new Vector2D(v1.x + v2.x, v1.y + v2.y);
    }
}

/**
 * Ecosystem - Main simulation controller
 * Manages all entities and simulation logic
 */
class Ecosystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;

        // Entity collections
        this.fish = [];
        this.predators = [];
        this.plants = [];
        this.algae = [];
        this.ripples = [];

        // Spatial partitioning grid for optimization
        this.gridSize = 50;
        this.grid = new Map();

        // Camera/view offset for panning
        this.viewOffset = new Vector2D(0, 0);
        this.zoom = 1.0;

        // Bind methods
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
    }

    /**
     * Initialize the ecosystem with starting entities
     */
    initialize(fishCount = 20, predatorCount = 3, plantCount = 15) {
        // Clear existing entities
        this.fish = [];
        this.predators = [];
        this.plants = [];
        this.algae = [];
        this.ripples = [];

        // Reset statistics
        EcosystemStats.reset();

        // Spawn initial fish
        for (let i = 0; i < fishCount; i++) {
            this.spawnFish();
        }

        // Spawn initial predators
        for (let i = 0; i < predatorCount; i++) {
            this.spawnPredator();
        }

        // Spawn initial plants
        for (let i = 0; i < plantCount; i++) {
            this.spawnPlant();
        }

        // Spawn initial algae
        for (let i = 0; i < 30; i++) {
            this.spawnAlgae();
        }
    }

    /**
     * Spawn a new fish at random position
     */
    spawnFish(position = null, parentGenes = null) {
        if (this.fish.length >= EcosystemConfig.maxFish) return null;

        const pos = position || new Vector2D(
            Math.random() * this.width,
            Math.random() * this.height
        );

        const fish = new Fish(pos, parentGenes);
        this.fish.push(fish);
        EcosystemStats.recordBirth('fish');

        return fish;
    }

    /**
     * Spawn a new predator at random position
     */
    spawnPredator(position = null, parentGenes = null) {
        if (this.predators.length >= EcosystemConfig.maxPredators) return null;

        const pos = position || new Vector2D(
            Math.random() * this.width,
            Math.random() * this.height
        );

        const predator = new Predator(pos, parentGenes);
        this.predators.push(predator);
        EcosystemStats.recordBirth('predator');

        return predator;
    }

    /**
     * Spawn a new plant at random position
     */
    spawnPlant(position = null) {
        if (this.plants.length >= EcosystemConfig.maxPlants) return null;

        const pos = position || new Vector2D(
            Math.random() * this.width,
            Math.random() * this.height
        );

        const plant = new Plant(pos);
        this.plants.push(plant);
        EcosystemStats.recordBirth('plant');

        return plant;
    }

    /**
     * Spawn algae at position or random
     */
    spawnAlgae(position = null) {
        if (this.algae.length >= EcosystemConfig.maxAlgae) return null;

        const pos = position || new Vector2D(
            Math.random() * this.width,
            Math.random() * this.height
        );

        const alga = new Algae(pos);
        this.algae.push(alga);
        EcosystemStats.recordBirth('algae');

        return alga;
    }

    /**
     * Add ripple effect at position
     */
    addRipple(x, y) {
        this.ripples.push({
            x: x,
            y: y,
            radius: 0,
            maxRadius: 80,
            opacity: 1.0
        });
    }

    /**
     * Feed area - spawn multiple algae at location
     */
    feedArea(x, y) {
        const count = 5 + Math.floor(Math.random() * 5);
        for (let i = 0; i < count; i++) {
            const offsetX = (Math.random() - 0.5) * 50;
            const offsetY = (Math.random() - 0.5) * 50;
            this.spawnAlgae(new Vector2D(x + offsetX, y + offsetY));
        }
        this.addRipple(x, y);
    }

    /**
     * Update spatial partitioning grid
     */
    updateGrid() {
        this.grid.clear();

        const addToGrid = (entity, type) => {
            const cellX = Math.floor(entity.position.x / this.gridSize);
            const cellY = Math.floor(entity.position.y / this.gridSize);
            const key = `${cellX},${cellY}`;

            if (!this.grid.has(key)) {
                this.grid.set(key, { fish: [], predators: [], plants: [], algae: [] });
            }
            this.grid.get(key)[type].push(entity);
        };

        this.fish.forEach(f => addToGrid(f, 'fish'));
        this.predators.forEach(p => addToGrid(p, 'predators'));
        this.plants.forEach(p => addToGrid(p, 'plants'));
        this.algae.forEach(a => addToGrid(a, 'algae'));
    }

    /**
     * Get nearby entities using spatial grid
     */
    getNearby(position, type, range) {
        const nearby = [];
        const cellX = Math.floor(position.x / this.gridSize);
        const cellY = Math.floor(position.y / this.gridSize);
        const cellRange = Math.ceil(range / this.gridSize);

        for (let dx = -cellRange; dx <= cellRange; dx++) {
            for (let dy = -cellRange; dy <= cellRange; dy++) {
                const key = `${cellX + dx},${cellY + dy}`;
                if (this.grid.has(key)) {
                    const cell = this.grid.get(key)[type];
                    cell.forEach(entity => {
                        if (position.dist(entity.position) <= range) {
                            nearby.push(entity);
                        }
                    });
                }
            }
        }

        return nearby;
    }

    /**
     * Main update loop - called each frame
     */
    update(deltaTime) {
        if (EcosystemConfig.paused) return;

        const dt = deltaTime * EcosystemConfig.simulationSpeed;
        EcosystemStats.simulationTime += dt / 1000;

        // Update spatial grid
        this.updateGrid();

        // Natural algae spawning
        if (Math.random() < EcosystemConfig.algaeSpawnRate) {
            this.spawnAlgae();
        }

        // Plant spawning (if below minimum)
        if (this.plants.length < 3 && Math.random() < 0.002) {
            this.spawnPlant();
        }

        // Update plants
        for (let i = this.plants.length - 1; i >= 0; i--) {
            const plant = this.plants[i];
            plant.update(dt, this);

            // Plants can spawn algae
            if (plant.size > 20 && Math.random() < 0.001) {
                const offset = Vector2D.random().mult(plant.size);
                this.spawnAlgae(Vector2D.add(plant.position, offset));
            }

            // Check if plant dies
            if (!plant.alive) {
                this.plants.splice(i, 1);
                EcosystemStats.recordDeath('plant');
            }
        }

        // Update algae
        for (let i = this.algae.length - 1; i >= 0; i--) {
            const alga = this.algae[i];
            alga.update(dt, this);

            if (!alga.alive) {
                this.algae.splice(i, 1);
                EcosystemStats.recordDeath('algae');
            }
        }

        // Update fish
        const newFish = [];
        for (let i = this.fish.length - 1; i >= 0; i--) {
            const fish = this.fish[i];

            // Get nearby entities for behavior
            const nearbyFish = this.getNearby(fish.position, 'fish', EcosystemConfig.fishPerception);
            const nearbyPredators = this.getNearby(fish.position, 'predators', EcosystemConfig.fishPerception);
            const nearbyAlgae = this.getNearby(fish.position, 'algae', EcosystemConfig.fishPerception);
            const nearbyPlants = this.getNearby(fish.position, 'plants', EcosystemConfig.fishPerception);

            fish.update(dt, this, nearbyFish, nearbyPredators, nearbyAlgae, nearbyPlants);

            // Check for reproduction
            const offspring = fish.tryReproduce(this);
            if (offspring) newFish.push(offspring);

            // Check if fish dies
            if (!fish.alive) {
                this.fish.splice(i, 1);
                EcosystemStats.recordDeath('fish');
            }
        }

        // Add new fish offspring
        newFish.forEach(f => {
            if (f) this.fish.push(f);
        });

        // Update predators
        const newPredators = [];
        for (let i = this.predators.length - 1; i >= 0; i--) {
            const predator = this.predators[i];

            // Get nearby entities
            const nearbyPredators = this.getNearby(predator.position, 'predators', EcosystemConfig.predatorPerception);
            const nearbyFish = this.getNearby(predator.position, 'fish', EcosystemConfig.predatorPerception);

            predator.update(dt, this, nearbyPredators, nearbyFish);

            // Check for reproduction
            const offspring = predator.tryReproduce(this);
            if (offspring) newPredators.push(offspring);

            // Check if predator dies
            if (!predator.alive) {
                this.predators.splice(i, 1);
                EcosystemStats.recordDeath('predator');
            }
        }

        // Add new predator offspring
        newPredators.forEach(p => {
            if (p) this.predators.push(p);
        });

        // Update ripples
        for (let i = this.ripples.length - 1; i >= 0; i--) {
            const ripple = this.ripples[i];
            ripple.radius += 2;
            ripple.opacity -= 0.02;

            if (ripple.opacity <= 0 || ripple.radius >= ripple.maxRadius) {
                this.ripples.splice(i, 1);
            }
        }

        // Update statistics counts
        EcosystemStats.fishCount = this.fish.length;
        EcosystemStats.predatorCount = this.predators.length;
        EcosystemStats.plantCount = this.plants.length;
        EcosystemStats.algaeCount = this.algae.length;
    }

    /**
     * Render the ecosystem
     */
    render() {
        const ctx = this.ctx;

        // Clear canvas with gradient background
        const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
        gradient.addColorStop(0, '#0a1a2e');
        gradient.addColorStop(1, '#020b14');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, this.width, this.height);

        // Draw water caustics effect
        this.renderCaustics(ctx);

        // Draw ripples
        this.ripples.forEach(ripple => {
            ctx.beginPath();
            ctx.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(30, 136, 229, ${ripple.opacity * 0.5})`;
            ctx.lineWidth = 2;
            ctx.stroke();
        });

        // Draw plants (back layer)
        this.plants.forEach(plant => plant.render(ctx));

        // Draw algae
        this.algae.forEach(alga => alga.render(ctx));

        // Draw fish
        this.fish.forEach(fish => fish.render(ctx));

        // Draw predators (front layer)
        this.predators.forEach(predator => predator.render(ctx));
    }

    /**
     * Render underwater caustic light effect
     */
    renderCaustics(ctx) {
        const time = Date.now() * 0.001;

        ctx.save();
        ctx.globalAlpha = 0.03;

        for (let i = 0; i < 5; i++) {
            ctx.beginPath();

            for (let x = 0; x < this.width; x += 30) {
                const y = Math.sin(x * 0.02 + time + i) * 20 + this.height / 2;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }

            ctx.strokeStyle = '#4fc3f7';
            ctx.lineWidth = 15;
            ctx.stroke();
        }

        ctx.restore();
    }

    /**
     * Handle window resize
     */
    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }
}

// Export for use in other files
window.EcosystemConfig = EcosystemConfig;
window.EcosystemStats = EcosystemStats;
window.Vector2D = Vector2D;
window.Ecosystem = Ecosystem;
