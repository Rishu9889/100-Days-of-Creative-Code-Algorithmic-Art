# Day 03 – Perlin Terrain

This sketch explores smooth, natural randomness inspired by Perlin noise.

A grid of random values is generated and then smoothly interpolated
to create a terrain-like height map. Each cell’s brightness represents
its height, producing an organic, landscape-style pattern.

## Concept
Unlike pure randomness, Perlin-style noise produces smooth transitions,
which makes it ideal for simulating natural phenomena like terrain,
clouds, and water.

## Techniques Used
- Grid-based noise sampling
- Linear interpolation (lerp)
- Height-to-color mapping
- HTML Canvas API
