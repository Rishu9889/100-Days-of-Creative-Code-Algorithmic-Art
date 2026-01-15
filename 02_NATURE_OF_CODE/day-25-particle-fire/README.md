# Day 25 – Particle Fire

A fire-like particle system built using the HTML Canvas API and basic
physics principles.

## Concept

This sketch simulates fire by emitting hundreds of short-lived particles
that rise due to buoyancy, flicker due to turbulence, and fade as they
cool.

## Techniques Used

- Particle systems
- Temperature-based color mapping
- Buoyancy and gravity forces
- Drag and turbulence
- Additive (light) blending
- Object pooling for performance
- HTML Canvas API

## Controls

- Move the mouse horizontally to shift the fire source
- Resize the window to adapt the canvas

## Physics Model

Each particle accumulates forces every frame:
- Initial upward velocity
- Buoyancy (hot air rise)
- Gravity
- Air resistance (drag)
- Random turbulence

## Possible Extensions

- Smoke particles
- Wind force
- Color-temperature gradient
- WebGL implementation
