# 🎯 Overview

This project simulates pendulum motion using physics-based equations, starting with a single pendulum built from scratch, and extending to a double pendulum system that demonstrates chaotic behavior.

The focus is on modeling real-world motion, not scripting animation.

# 🧠 Core Concepts

A pendulum is described using angular quantities:

- Angle (θ)
- Angular velocity (ω)
- Angular acceleration (α)

Gravity acts as a restoring force, producing oscillatory motion.

The simulation evolves over time using numerical integration.

# ⚙️ Physics Model

The angular acceleration is calculated using the standard pendulum equation:
```bash
α = -(g / L) · sin(θ)
```

Where:

- g is gravity
- L is the pendulum length
- θ is the current angle

Energy loss is simulated using damping, representing friction and air resistance.

# 🔄 Numerical Integration

The simulation uses Euler integration to update motion over time:

- Compute angular acceleration
- Update angular velocity
- Apply damping
- Update angle

This approach prioritizes clarity and learning over physical perfection.

# 🎨 Visual Features

Multiple Pendulums
- Three pendulums with different lengths
- Same gravity and initial angle
- Clearly demonstrates how length affects oscillation period

Motion Trails
- Fading trails visualize recent motion
- Helps observe oscillatory paths and energy decay

Energy Visualization

Each pendulum displays:

Potential Energy (PE) – based on vertical height

Kinetic Energy (KE) – based on angular velocity

Energy bars update in real time, making energy transfer visually intuitive.

# 📂 Project Structure
``` bash
day-23-pendulum-simulation/
├── index.html
├── sketch.js
└── README.md
```
