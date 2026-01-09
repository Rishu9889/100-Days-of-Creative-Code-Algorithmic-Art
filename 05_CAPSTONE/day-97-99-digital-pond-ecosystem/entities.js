/* ==================================================
   Digital Pond Ecosystem — Entity Classes
   Days 97-99 Capstone Project
   
   This file contains all ecosystem entity classes:
   - Fish (Prey)
   - Predator
   - Plant
   - Algae
   ================================================== */

/**
 * Base Entity Class
 * Common properties and methods for all ecosystem entities
 */
class Entity {
    constructor(position) {
        this.position = position.clone();
        this.velocity = new Vector2D(0, 0);
        this.acceleration = new Vector2D(0, 0);
        this.alive = true;
        this.age = 0;
        this.id = Math.random().toString(36).substr(2, 9);
    }

    /**
     * Apply force to entity (F = ma, assuming m = 1)
     */
    applyForce(force) {
        this.acceleration.add(force);
    }

    /**
     * Wrap position around boundaries
     */
    wrapBoundary(width, height) {
        if (this.position.x < 0) this.position.x = width;
        if (this.position.x > width) this.position.x = 0;
        if (this.position.y < 0) this.position.y = height;
        if (this.position.y > height) this.position.y = 0;
    }

    /**
     * Keep entity within boundaries (bounce)
     */
    boundaryForce(width, height, margin = 50) {
        const force = new Vector2D(0, 0);

        if (this.position.x < margin) {
            force.x = (margin - this.position.x) * 0.05;
        } else if (this.position.x > width - margin) {
            force.x = (width - margin - this.position.x) * 0.05;
        }

        if (this.position.y < margin) {
            force.y = (margin - this.position.y) * 0.05;
        } else if (this.position.y > height - margin) {
            force.y = (height - margin - this.position.y) * 0.05;
        }

        return force;
    }
}

/**
 * Genes Class - Genetic traits for inheritance and mutation
 */
class Genes {
    constructor(parent = null) {
        if (parent) {
            // Inherit from parent with mutation
            this.size = this.mutate(parent.size, 0.5, 2);
            this.maxSpeed = this.mutate(parent.maxSpeed, 1, 4);
            this.maxForce = this.mutate(parent.maxForce, 0.05, 0.3);
            this.perception = this.mutate(parent.perception, 30, 100);
            this.hue = this.mutateHue(parent.hue, 30);
        } else {
            // Random genes
            this.size = 8 + Math.random() * 8;
            this.maxSpeed = 1.5 + Math.random() * 1.5;
            this.maxForce = 0.08 + Math.random() * 0.12;
            this.perception = 50 + Math.random() * 30;
            this.hue = Math.random() * 60 + 20; // Warm colors for fish
        }
    }

    /**
     * Mutate a value within bounds
     */
    mutate(value, min, max) {
        if (Math.random() < EcosystemConfig.mutationRate) {
            const change = (Math.random() - 0.5) * 0.4 * value;
            return Math.max(min, Math.min(max, value + change));
        }
        return value;
    }

    /**
     * Mutate hue value (wraps around)
     */
    mutateHue(hue, range) {
        if (Math.random() < EcosystemConfig.mutationRate) {
            return (hue + (Math.random() - 0.5) * range + 360) % 360;
        }
        return hue;
    }
}

/**
 * Fish Class - Prey entity
 * Behaviors: Flocking, food seeking, predator avoidance
 */
class Fish extends Entity {
    constructor(position, parentGenes = null) {
        super(position);

        // Genetic traits
        this.genes = new Genes(parentGenes);

        // Physical properties
        this.size = this.genes.size;
        this.maxSpeed = this.genes.maxSpeed;
        this.maxForce = this.genes.maxForce;

        // Energy system
        this.energy = EcosystemConfig.baseEnergy;
        this.maxEnergy = 200;
        this.hungerThreshold = 50;

        // State
        this.isHungry = false;
        this.isFleeing = false;

        // Initial velocity
        this.velocity = Vector2D.random().mult(this.maxSpeed * 0.5);

        // Visual properties
        this.tailAngle = 0;
        this.tailDirection = 1;
        this.hue = this.genes.hue;
    }

    /**
     * Update fish state and movement
     */
    update(dt, ecosystem, nearbyFish, nearbyPredators, nearbyAlgae, nearbyPlants) {
        if (!this.alive) return;

        this.age += dt * 0.001;

        // Energy decay
        this.energy -= EcosystemConfig.energyDecayRate * dt * 0.01;
        this.isHungry = this.energy < this.hungerThreshold;

        // Check for death
        if (this.energy <= 0) {
            this.alive = false;
            return;
        }

        // Check for predators (flee behavior)
        this.isFleeing = nearbyPredators.length > 0;

        // Calculate steering forces
        const forces = new Vector2D(0, 0);

        // 1. Predator avoidance (highest priority)
        if (nearbyPredators.length > 0) {
            const flee = this.flee(nearbyPredators);
            flee.mult(EcosystemConfig.predatorAvoidWeight);
            forces.add(flee);
        }

        // 2. Food seeking (when hungry)
        if (this.isHungry && (nearbyAlgae.length > 0 || nearbyPlants.length > 0)) {
            const foodSources = [...nearbyAlgae];
            nearbyPlants.forEach(p => {
                if (p.size > 5) foodSources.push(p);
            });

            if (foodSources.length > 0) {
                const seek = this.seekFood(foodSources);
                seek.mult(EcosystemConfig.foodSeekWeight);
                forces.add(seek);
            }
        }

        // 3. Flocking behaviors
        if (nearbyFish.length > 1) {
            const separation = this.separate(nearbyFish);
            const alignment = this.align(nearbyFish);
            const cohesion = this.cohere(nearbyFish);

            separation.mult(EcosystemConfig.separationWeight);
            alignment.mult(EcosystemConfig.alignmentWeight);
            cohesion.mult(EcosystemConfig.cohesionWeight);

            forces.add(separation);
            forces.add(alignment);
            forces.add(cohesion);
        }

        // 4. Boundary avoidance
        const boundary = this.boundaryForce(ecosystem.width, ecosystem.height);
        forces.add(boundary);

        // Apply forces
        this.applyForce(forces);

        // Update physics
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.isFleeing ? this.maxSpeed * 1.5 : this.maxSpeed);
        this.position.add(this.velocity.clone().mult(dt * 0.06));
        this.acceleration.mult(0);

        // Wrap boundaries
        this.wrapBoundary(ecosystem.width, ecosystem.height);

        // Try to eat nearby food
        this.tryEat(nearbyAlgae, nearbyPlants, ecosystem);

        // Animate tail
        this.tailAngle += this.tailDirection * 0.3;
        if (Math.abs(this.tailAngle) > 0.5) {
            this.tailDirection *= -1;
        }
    }

    /**
     * Flee from predators
     */
    flee(predators) {
        const steer = new Vector2D(0, 0);
        let count = 0;

        for (const predator of predators) {
            const d = this.position.dist(predator.position);
            if (d < this.genes.perception && d > 0) {
                const diff = Vector2D.sub(this.position, predator.position);
                diff.normalize();
                diff.div(d); // Weight by distance
                steer.add(diff);
                count++;
            }
        }

        if (count > 0) {
            steer.div(count);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce * 2); // Emergency response
        }

        return steer;
    }

    /**
     * Seek nearest food source
     */
    seekFood(foodSources) {
        let nearest = null;
        let nearestDist = Infinity;

        for (const food of foodSources) {
            const d = this.position.dist(food.position);
            if (d < nearestDist) {
                nearestDist = d;
                nearest = food;
            }
        }

        if (nearest) {
            const desired = Vector2D.sub(nearest.position, this.position);
            desired.setMag(this.maxSpeed);
            const steer = Vector2D.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector2D(0, 0);
    }

    /**
     * Separation - Avoid crowding neighbors
     */
    separate(neighbors) {
        const desiredSeparation = this.size * 3;
        const steer = new Vector2D(0, 0);
        let count = 0;

        for (const other of neighbors) {
            if (other.id === this.id) continue;

            const d = this.position.dist(other.position);
            if (d > 0 && d < desiredSeparation) {
                const diff = Vector2D.sub(this.position, other.position);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }

        if (count > 0) {
            steer.div(count);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }

        return steer;
    }

    /**
     * Alignment - Steer towards average heading of neighbors
     */
    align(neighbors) {
        const sum = new Vector2D(0, 0);
        let count = 0;

        for (const other of neighbors) {
            if (other.id === this.id) continue;

            const d = this.position.dist(other.position);
            if (d > 0 && d < this.genes.perception) {
                sum.add(other.velocity);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            sum.setMag(this.maxSpeed);
            const steer = Vector2D.sub(sum, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector2D(0, 0);
    }

    /**
     * Cohesion - Steer towards center of neighbors
     */
    cohere(neighbors) {
        const sum = new Vector2D(0, 0);
        let count = 0;

        for (const other of neighbors) {
            if (other.id === this.id) continue;

            const d = this.position.dist(other.position);
            if (d > 0 && d < this.genes.perception) {
                sum.add(other.position);
                count++;
            }
        }

        if (count > 0) {
            sum.div(count);
            const desired = Vector2D.sub(sum, this.position);
            desired.setMag(this.maxSpeed);
            const steer = Vector2D.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        return new Vector2D(0, 0);
    }

    /**
     * Try to eat nearby food
     */
    tryEat(algae, plants, ecosystem) {
        // Eat algae
        for (let i = algae.length - 1; i >= 0; i--) {
            const alga = algae[i];
            if (this.position.dist(alga.position) < this.size + alga.size) {
                this.energy = Math.min(this.maxEnergy, this.energy + alga.energy);
                alga.alive = false;
            }
        }

        // Nibble plants
        for (const plant of plants) {
            if (this.position.dist(plant.position) < this.size + plant.size) {
                const bite = Math.min(2, plant.size);
                if (plant.size > 3) {
                    plant.size -= bite * 0.1;
                    this.energy = Math.min(this.maxEnergy, this.energy + bite * 3);
                }
            }
        }
    }

    /**
     * Attempt reproduction if energy is high
     */
    tryReproduce(ecosystem) {
        if (this.energy > EcosystemConfig.reproductionThreshold &&
            ecosystem.fish.length < EcosystemConfig.maxFish &&
            Math.random() < 0.005) {

            this.energy -= EcosystemConfig.reproductionCost;

            const offset = Vector2D.random().mult(this.size * 2);
            const childPos = Vector2D.add(this.position, offset);

            const child = new Fish(childPos, this.genes);
            child.energy = EcosystemConfig.reproductionCost * 0.8;

            EcosystemStats.recordBirth('fish');
            return child;
        }

        return null;
    }

    /**
     * Render fish
     */
    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.heading());

        // Energy indicator (opacity based on energy)
        const energyRatio = this.energy / this.maxEnergy;
        const alpha = 0.5 + energyRatio * 0.5;

        // Fleeing indicator
        const saturation = this.isFleeing ? 90 : 70;
        const lightness = this.isFleeing ? 60 : 50;

        // Body
        ctx.fillStyle = `hsla(${this.hue}, ${saturation}%, ${lightness}%, ${alpha})`;
        ctx.beginPath();
        ctx.ellipse(0, 0, this.size, this.size * 0.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Tail
        ctx.save();
        ctx.translate(-this.size, 0);
        ctx.rotate(this.tailAngle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.size * 0.7, -this.size * 0.4);
        ctx.lineTo(-this.size * 0.7, this.size * 0.4);
        ctx.closePath();
        ctx.fillStyle = `hsla(${this.hue}, ${saturation - 10}%, ${lightness - 10}%, ${alpha})`;
        ctx.fill();
        ctx.restore();

        // Eye
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.size * 0.4, -this.size * 0.15, this.size * 0.15, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(this.size * 0.45, -this.size * 0.15, this.size * 0.08, 0, Math.PI * 2);
        ctx.fill();

        // Hunger indicator (stomach)
        if (this.isHungry) {
            ctx.strokeStyle = 'rgba(255, 100, 100, 0.5)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.3, 0, Math.PI * 2);
            ctx.stroke();
        }

        ctx.restore();
    }
}

/**
 * Predator Class - Apex predator entity
 * Behaviors: Hunting fish, territorial separation
 */
class Predator extends Entity {
    constructor(position, parentGenes = null) {
        super(position);

        // Predator genes (different from fish)
        if (parentGenes) {
            this.size = this.mutate(parentGenes.size, 15, 30);
            this.maxSpeed = this.mutate(parentGenes.maxSpeed, 1.5, 3.5);
            this.maxForce = this.mutate(parentGenes.maxForce, 0.08, 0.25);
            this.hue = this.mutateHue(parentGenes.hue, 20);
        } else {
            this.size = 18 + Math.random() * 8;
            this.maxSpeed = 2.0 + Math.random() * 1.0;
            this.maxForce = 0.12 + Math.random() * 0.08;
            this.hue = Math.random() * 30 + 340; // Red/purple tones
        }

        // Energy system
        this.energy = EcosystemConfig.baseEnergy * 1.5;
        this.maxEnergy = 300;
        this.hungerThreshold = 80;

        // State
        this.isHunting = false;
        this.target = null;

        // Genes for reproduction
        this.genes = { size: this.size, maxSpeed: this.maxSpeed, maxForce: this.maxForce, hue: this.hue };

        // Initial velocity
        this.velocity = Vector2D.random().mult(this.maxSpeed * 0.3);

        // Visual
        this.finAngle = 0;
        this.finDirection = 1;
    }

    mutate(value, min, max) {
        if (Math.random() < EcosystemConfig.mutationRate) {
            const change = (Math.random() - 0.5) * 0.4 * value;
            return Math.max(min, Math.min(max, value + change));
        }
        return value;
    }

    mutateHue(hue, range) {
        if (Math.random() < EcosystemConfig.mutationRate) {
            return (hue + (Math.random() - 0.5) * range + 360) % 360;
        }
        return hue;
    }

    /**
     * Update predator state and movement
     */
    update(dt, ecosystem, nearbyPredators, nearbyFish) {
        if (!this.alive) return;

        this.age += dt * 0.001;

        // Energy decay (slower than fish)
        this.energy -= EcosystemConfig.energyDecayRate * 0.7 * dt * 0.01;
        this.isHunting = this.energy < this.hungerThreshold || this.target !== null;

        // Check for death
        if (this.energy <= 0) {
            this.alive = false;
            return;
        }

        const forces = new Vector2D(0, 0);

        // 1. Hunt fish when hungry
        if (nearbyFish.length > 0 && this.energy < this.maxEnergy * 0.8) {
            const hunt = this.hunt(nearbyFish);
            hunt.mult(2.0);
            forces.add(hunt);
        }

        // 2. Separation from other predators (territorial)
        if (nearbyPredators.length > 1) {
            const separation = this.separate(nearbyPredators);
            separation.mult(2.0);
            forces.add(separation);
        }

        // 3. Wander when not hunting
        if (!this.isHunting) {
            const wander = Vector2D.random().mult(this.maxForce * 0.5);
            forces.add(wander);
        }

        // 4. Boundary avoidance
        const boundary = this.boundaryForce(ecosystem.width, ecosystem.height, 80);
        forces.add(boundary);

        // Apply forces
        this.applyForce(forces);

        // Update physics
        this.velocity.add(this.acceleration);
        this.velocity.limit(this.isHunting ? this.maxSpeed : this.maxSpeed * 0.6);
        this.position.add(this.velocity.clone().mult(dt * 0.06));
        this.acceleration.mult(0);

        // Wrap boundaries
        this.wrapBoundary(ecosystem.width, ecosystem.height);

        // Try to catch fish
        this.tryCatch(nearbyFish);

        // Animate fins
        this.finAngle += this.finDirection * 0.2;
        if (Math.abs(this.finAngle) > 0.4) {
            this.finDirection *= -1;
        }
    }

    /**
     * Hunt nearest fish
     */
    hunt(fish) {
        let nearest = null;
        let nearestDist = Infinity;

        for (const f of fish) {
            const d = this.position.dist(f.position);
            if (d < nearestDist && d < EcosystemConfig.predatorPerception) {
                nearestDist = d;
                nearest = f;
            }
        }

        if (nearest) {
            this.target = nearest;

            // Predict fish position
            const prediction = Vector2D.add(nearest.position, nearest.velocity.clone().mult(10));
            const desired = Vector2D.sub(prediction, this.position);
            desired.setMag(this.maxSpeed);
            const steer = Vector2D.sub(desired, this.velocity);
            steer.limit(this.maxForce);
            return steer;
        }

        this.target = null;
        return new Vector2D(0, 0);
    }

    /**
     * Separation from other predators
     */
    separate(neighbors) {
        const desiredSeparation = this.size * 5;
        const steer = new Vector2D(0, 0);
        let count = 0;

        for (const other of neighbors) {
            if (other.id === this.id) continue;

            const d = this.position.dist(other.position);
            if (d > 0 && d < desiredSeparation) {
                const diff = Vector2D.sub(this.position, other.position);
                diff.normalize();
                diff.div(d);
                steer.add(diff);
                count++;
            }
        }

        if (count > 0) {
            steer.div(count);
            steer.setMag(this.maxSpeed);
            steer.sub(this.velocity);
            steer.limit(this.maxForce);
        }

        return steer;
    }

    /**
     * Try to catch and eat fish
     */
    tryCatch(fish) {
        for (const f of fish) {
            const d = this.position.dist(f.position);
            if (d < this.size + f.size) {
                // Caught a fish!
                const energyGain = f.energy * EcosystemConfig.energyTransferRate;
                this.energy = Math.min(this.maxEnergy, this.energy + energyGain);
                f.alive = false;
                this.target = null;
                break;
            }
        }
    }

    /**
     * Attempt reproduction
     */
    tryReproduce(ecosystem) {
        if (this.energy > EcosystemConfig.reproductionThreshold * 1.5 &&
            ecosystem.predators.length < EcosystemConfig.maxPredators &&
            Math.random() < 0.002) {

            this.energy -= EcosystemConfig.reproductionCost * 1.2;

            const offset = Vector2D.random().mult(this.size * 3);
            const childPos = Vector2D.add(this.position, offset);

            const child = new Predator(childPos, this.genes);
            child.energy = EcosystemConfig.reproductionCost;

            EcosystemStats.recordBirth('predator');
            return child;
        }

        return null;
    }

    /**
     * Render predator
     */
    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);
        ctx.rotate(this.velocity.heading());

        const energyRatio = this.energy / this.maxEnergy;
        const alpha = 0.6 + energyRatio * 0.4;

        // Body (shark-like)
        const gradient = ctx.createLinearGradient(-this.size, 0, this.size, 0);
        gradient.addColorStop(0, `hsla(${this.hue}, 70%, 35%, ${alpha})`);
        gradient.addColorStop(1, `hsla(${this.hue}, 60%, 45%, ${alpha})`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(this.size, 0);
        ctx.quadraticCurveTo(this.size * 0.5, -this.size * 0.4, -this.size * 0.5, -this.size * 0.3);
        ctx.lineTo(-this.size, 0);
        ctx.lineTo(-this.size * 0.5, this.size * 0.3);
        ctx.quadraticCurveTo(this.size * 0.5, this.size * 0.4, this.size, 0);
        ctx.fill();

        // Dorsal fin
        ctx.save();
        ctx.rotate(this.finAngle * 0.3);
        ctx.fillStyle = `hsla(${this.hue}, 60%, 30%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 0.3);
        ctx.lineTo(-this.size * 0.3, -this.size * 0.8);
        ctx.lineTo(-this.size * 0.4, -this.size * 0.3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Tail fin
        ctx.save();
        ctx.translate(-this.size * 0.8, 0);
        ctx.rotate(this.finAngle);
        ctx.fillStyle = `hsla(${this.hue}, 50%, 35%, ${alpha})`;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-this.size * 0.5, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.3, 0);
        ctx.lineTo(-this.size * 0.5, this.size * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Eye
        ctx.fillStyle = `rgba(255, 255, 200, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.size * 0.5, -this.size * 0.1, this.size * 0.12, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `rgba(20, 0, 0, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.size * 0.52, -this.size * 0.1, this.size * 0.06, 0, Math.PI * 2);
        ctx.fill();

        // Hunting indicator
        if (this.isHunting && this.target) {
            ctx.strokeStyle = 'rgba(255, 50, 50, 0.4)';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            ctx.beginPath();
            ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
            ctx.stroke();
            ctx.setLineDash([]);
        }

        ctx.restore();
    }
}

/**
 * Plant Class - Aquatic vegetation
 * Provides food for fish, grows over time
 */
class Plant extends Entity {
    constructor(position) {
        super(position);

        this.size = 5 + Math.random() * 10;
        this.maxSize = 20 + Math.random() * 15;
        this.growthRate = 0.01 + Math.random() * 0.02;

        // Visual properties
        this.numLeaves = 3 + Math.floor(Math.random() * 4);
        this.leafAngles = [];
        this.leafLengths = [];

        for (let i = 0; i < this.numLeaves; i++) {
            this.leafAngles.push(-Math.PI / 2 + (Math.random() - 0.5) * 0.8);
            this.leafLengths.push(0.6 + Math.random() * 0.4);
        }

        this.swayOffset = Math.random() * Math.PI * 2;
        this.hue = 100 + Math.random() * 40; // Green tones
    }

    /**
     * Update plant growth
     */
    update(dt, ecosystem) {
        if (!this.alive) return;

        this.age += dt * 0.001;

        // Grow
        if (this.size < this.maxSize) {
            this.size += this.growthRate * dt * 0.01;
        }

        // Age death (very old plants die)
        if (this.age > 120 + Math.random() * 60) {
            this.alive = false;
        }
    }

    /**
     * Render plant
     */
    render(ctx) {
        ctx.save();
        ctx.translate(this.position.x, this.position.y);

        const time = Date.now() * 0.001;
        const sway = Math.sin(time + this.swayOffset) * 0.1;

        // Draw leaves
        for (let i = 0; i < this.numLeaves; i++) {
            const angle = this.leafAngles[i] + sway;
            const length = this.size * this.leafLengths[i];

            ctx.save();
            ctx.rotate(angle);

            // Leaf gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, -length);
            gradient.addColorStop(0, `hsla(${this.hue - 10}, 60%, 25%, 0.9)`);
            gradient.addColorStop(1, `hsla(${this.hue + 10}, 70%, 45%, 0.8)`);

            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.quadraticCurveTo(
                length * 0.2, -length * 0.5,
                0, -length
            );
            ctx.quadraticCurveTo(
                -length * 0.2, -length * 0.5,
                0, 0
            );
            ctx.fill();

            ctx.restore();
        }

        // Root base
        ctx.fillStyle = `hsla(${this.hue - 20}, 40%, 20%, 0.8)`;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
    }
}

/**
 * Algae Class - Floating food particles
 * Primary food source for fish
 */
class Algae extends Entity {
    constructor(position) {
        super(position);

        this.size = 2 + Math.random() * 3;
        this.energy = EcosystemConfig.algaeEnergy;
        this.lifespan = 30 + Math.random() * 30; // seconds

        // Drift velocity
        this.velocity = Vector2D.random().mult(0.1 + Math.random() * 0.2);

        // Visual
        this.hue = 70 + Math.random() * 30; // Yellow-green
        this.pulseOffset = Math.random() * Math.PI * 2;
    }

    /**
     * Update algae drift and aging
     */
    update(dt, ecosystem) {
        if (!this.alive) return;

        this.age += dt * 0.001;

        // Die after lifespan
        if (this.age > this.lifespan) {
            this.alive = false;
            return;
        }

        // Gentle drift
        this.position.add(this.velocity.clone().mult(dt * 0.03));

        // Random wobble
        this.velocity.rotate((Math.random() - 0.5) * 0.1);

        // Wrap boundaries
        this.wrapBoundary(ecosystem.width, ecosystem.height);
    }

    /**
     * Render algae
     */
    render(ctx) {
        const time = Date.now() * 0.003;
        const pulse = 1 + Math.sin(time + this.pulseOffset) * 0.2;
        const renderSize = this.size * pulse;

        // Fade out near death
        const lifeRatio = 1 - (this.age / this.lifespan);
        const alpha = Math.min(0.8, lifeRatio);

        // Glow effect
        ctx.save();
        ctx.globalAlpha = alpha * 0.3;
        ctx.fillStyle = `hsl(${this.hue}, 80%, 60%)`;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, renderSize * 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Core
        ctx.fillStyle = `hsla(${this.hue}, 70%, 50%, ${alpha})`;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, renderSize, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Export classes
window.Fish = Fish;
window.Predator = Predator;
window.Plant = Plant;
window.Algae = Algae;
