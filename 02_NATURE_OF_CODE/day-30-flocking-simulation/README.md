# Day 30 – Flocking Simulation (Boids)

This sketch implements Craig Reynolds’ Boids algorithm to simulate
emergent flocking behavior.

Each agent follows three simple local rules: separation, alignment,
and cohesion. Despite the simplicity of these rules, complex group
behavior emerges without any centralized control.

## Concept

Flocking demonstrates how global order can arise from local interactions.
This principle appears in nature in bird flocks, fish schools, and
crowd dynamics.

## Techniques Used

- Agent-based simulation
- Separation, alignment, and cohesion rules
- Force accumulation and vector limiting
- Toroidal space wrapping
- HTML Canvas API
