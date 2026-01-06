# Day 40 – Fluid Simulation

This sketch demonstrates a simple grid-based fluid simulation inspired
by stable fluid methods.

The simulation stores velocity and dye values on a grid. Dye is advected
through the velocity field, creating fluid-like motion. Mouse movement
injects velocity and dye into the system.

## Concept

Fluids can be approximated by discretizing space and simulating how
quantities like velocity and density move across a grid. Even simple
rules can produce convincing fluid behavior.

## Techniques Used

- Grid-based simulation
- Velocity fields
- Advection
- Mouse-driven force injection
- HTML Canvas API
