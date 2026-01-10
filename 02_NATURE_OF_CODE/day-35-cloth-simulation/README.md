# Day 35 – Cloth Simulation

This sketch simulates a cloth using a grid of particles connected by
distance constraints.

Each point is affected by gravity, and constraints enforce fixed
distances between neighboring points. By repeatedly relaxing these
constraints, flexible cloth-like behavior emerges.

## Concept

Cloth can be modeled as a mass–spring or constraint-based system.
Although each element is simple, their interaction produces realistic
fabric motion.

## Techniques Used

- Verlet integration
- Constraint relaxation
- Particle-based cloth modeling
- Gravity and boundary constraints
- HTML Canvas API
