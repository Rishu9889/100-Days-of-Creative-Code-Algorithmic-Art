# 🧱 Friction & Air Drag Simulation

A physics-based simulation demonstrating the effects of **kinetic friction** and **air drag** on a moving object.

Built using **HTML, CSS, and vanilla JavaScript** with real force equations and time-based integration.

---

## 🎯 Features

- Kinetic friction modeling
- Quadratic air drag force
- Velocity decay over time
- Force-based motion
- Interactive push and reset controls

---

## 🧠 Physics Model

The block experiences two resistive forces:

### Kinetic Friction
F_friction = μ · m · g

### Air Drag
F_drag = c · v²

### Net Force
F_net = −F_friction − F_drag

Acceleration:
a = F_net / m

Velocity and position are updated numerically each frame.

---

## 🛠️ Tech Stack

- HTML5 Canvas
- CSS3
- Vanilla JavaScript
- `requestAnimationFrame` loop

---

## 🚀 Getting Started

1. Clone the repository
   ```bash
   git clone https://github.com/your-username/friction-drag-simulation.git
