# 🌊 Digital Pond Ecosystem — Days 97-99

A complete, interactive pond ecosystem simulation featuring fish, predators, plants, and algae with realistic behaviors, food chains, energy dynamics, and population management.

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Canvas](https://img.shields.io/badge/Canvas-2D-333333?style=flat)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)

---

## 📌 Overview

This capstone project (Days 97-99) creates a living, breathing digital pond ecosystem. It demonstrates advanced concepts in:

- **Agent-based simulation**
- **Flocking algorithms (Boids)**
- **Predator-prey dynamics**
- **Genetic inheritance & mutation**
- **Energy systems & food chains**
- **Population dynamics**

---

## ✨ Features

### 🐟 Ecosystem Entities

| Entity | Description | Behavior |
|--------|-------------|----------|
| **🐟 Fish** | Small prey fish | Flocking, food seeking, predator avoidance |
| **🦈 Predator** | Apex predators | Hunting, territorial separation |
| **🌱 Plant** | Aquatic vegetation | Growth, algae spawning |
| **🦠 Algae** | Floating food | Drift, decay |

### 🔄 Food Chain

```
☀️ Sunlight → 🌿 Plants → 🐟 Fish → 🦈 Predators
```

### 🧬 Genetic System

- **Inheritance**: Offspring inherit traits from parents
- **Mutation**: Random variations in size, speed, perception, and color
- **Natural Selection**: Fitter individuals survive longer and reproduce more

### 📊 Statistics & Metrics

- Real-time population counts
- Birth and death tracking
- Simulation time
- Interactive controls

---

## 🎮 Controls

### Mouse Interactions

| Action | Effect |
|--------|--------|
| **Left Click** | Create water ripple disturbance |
| **Right Click** | Feed area (spawn algae cluster) |

### Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `SPACE` | Pause / Resume simulation |
| `R` | Reset ecosystem |
| `F` | Add a new fish |
| `P` | Add a new predator |
| `T` | Add a new plant |
| `I` | Toggle info panel |

### Control Panel

- **Speed**: Adjust simulation speed (0.1x - 3.0x)
- **Initial Fish**: Set starting fish population
- **Initial Predators**: Set starting predator count
- **Initial Plants**: Set starting plant count
- **Mutation Rate**: Control genetic variation (0% - 50%)

---

## 🛠️ Technical Implementation

### Day 97 — Foundation

- Canvas-based 2D rendering system
- Vector mathematics for physics
- Water ripple effects with vertex displacement
- Spatial partitioning for performance optimization

### Day 98 — Entities & Behaviors

- **Fish Class**: Implements flocking behaviors (separation, alignment, cohesion)
- **Predator Class**: Hunting AI with predictive targeting
- **Plant Class**: Growth simulation and algae spawning
- **Algae Class**: Food source with drift physics

### Day 99 — Ecosystem Dynamics

- Energy transfer between trophic levels
- Reproduction mechanics with genetic inheritance
- Population limits and natural death
- UI controls and statistics display

---

## 📂 File Structure

```
day-97-99-digital-pond-ecosystem/
├── index.html      # Main HTML structure with UI panels
├── style.css       # Glassmorphism UI styling
├── ecosystem.js    # Core simulation engine
├── entities.js     # Entity classes (Fish, Predator, Plant, Algae)
├── sketch.js       # Application controller and event handling
└── README.md       # Documentation (this file)
```

---

## 🚀 Getting Started

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/motalib-code/100-Days-of-Creative-Code-Algorithmic-Art.git
   ```

2. Navigate to the project:
   ```bash
   cd 100-Days-of-Creative-Code-Algorithmic-Art/05_CAPSTONE/day-97-99-digital-pond-ecosystem
   ```

3. Open `index.html` in a browser:
   ```bash
   # Using Python's HTTP server
   python -m http.server 8000
   
   # Or use any local server (Live Server, etc.)
   ```

4. Visit `http://localhost:8000`

---

## 🎨 Algorithms & Techniques

### Flocking (Boids Algorithm)

Fish implement Craig Reynolds' Boids algorithm with three rules:

1. **Separation**: Avoid crowding nearby fish
2. **Alignment**: Steer towards average heading of neighbors
3. **Cohesion**: Move toward center of mass of neighbors

```javascript
// Separation steering
separate(neighbors) {
  const desiredSeparation = this.size * 3;
  // Calculate repulsion from each neighbor...
}

// Alignment steering
align(neighbors) {
  // Average velocity of visible neighbors...
}

// Cohesion steering
cohere(neighbors) {
  // Center of mass of visible neighbors...
}
```

### Predator-Prey Dynamics

- Predators use **predictive targeting** to intercept fish
- Fish detect predators and trigger **flee behavior**
- Energy transfers at 50% efficiency between trophic levels

### Spatial Partitioning

Grid-based spatial hashing for O(1) neighbor queries:

```javascript
updateGrid() {
  // Hash entities into grid cells
  const cellX = Math.floor(entity.position.x / this.gridSize);
  const cellY = Math.floor(entity.position.y / this.gridSize);
  // Store in grid map...
}
```

---

## 📈 Configuration

Adjust ecosystem parameters in `ecosystem.js`:

```javascript
const EcosystemConfig = {
  simulationSpeed: 1.0,
  maxFish: 100,
  maxPredators: 20,
  energyDecayRate: 0.1,
  reproductionThreshold: 150,
  mutationRate: 0.1,
  // ... more settings
};
```

---

## 🧪 Testing Scenarios

### Scenario 1: Balanced Ecosystem
- Fish: 20, Predators: 3, Plants: 15
- Watch population oscillate naturally

### Scenario 2: Predator Dominance
- Fish: 10, Predators: 8, Plants: 5
- Observe fish population crash

### Scenario 3: Resource Scarcity
- Fish: 30, Predators: 1, Plants: 3
- See competition for limited food

### Scenario 4: High Mutation
- Set mutation rate to 50%
- Watch rapid evolution of traits

---

## 🔧 Performance Tips

- Use Chrome or Firefox for best performance
- Reduce population if frame rate drops
- Lower simulation speed for complex scenarios
- Close other tabs to free memory

---

## 📚 Educational Value

This project demonstrates:

- ✅ Object-oriented programming in JavaScript
- ✅ Physics simulation with vector math
- ✅ Emergence from simple rules (flocking)
- ✅ State machines and AI behaviors
- ✅ Canvas 2D rendering and animation
- ✅ UI/UX design with CSS

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -m "Add feature"`
4. Push to branch: `git push origin feature-name`
5. Submit a Pull Request

---

## 📝 License

This project is part of the **100 Days of Creative Code** challenge and is open source.

---

## 🎉 Credits

- **Algorithm Inspiration**: Craig Reynolds' Boids
- **Nature of Code**: Daniel Shiffman
- **Challenge**: 100 Days of Creative Code & Algorithmic Art

---

**Happy Coding! 🌊🐟🌿**
