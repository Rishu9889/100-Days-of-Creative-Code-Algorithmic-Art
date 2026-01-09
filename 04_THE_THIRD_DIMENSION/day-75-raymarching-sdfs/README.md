# Day 75 – Raymarching with Signed Distance Fields

This sketch demonstrates raymarching using Signed Distance Functions
(SDFs) implemented in a fragment shader.

Instead of traditional meshes, the scene is defined mathematically.
Rays are cast from the camera and iteratively marched through space until
they intersect an implicit surface.

## Concept

Raymarching renders 3D scenes by evaluating distance functions rather
than geometry. Signed Distance Fields describe how far a point is from
the surface of an object, enabling procedural shapes and smooth blending.

## Techniques Used

- GLSL fragment shaders
- Signed Distance Functions (SDF)
- Raymarching
- Normal estimation
- Diffuse lighting
