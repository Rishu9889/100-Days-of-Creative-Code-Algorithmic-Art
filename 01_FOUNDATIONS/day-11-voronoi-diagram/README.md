# Day 11 – Voronoi Diagram

This sketch generates a Voronoi diagram using a set of randomly placed
points known as *sites*.

For each pixel on the canvas, the distance to every site is calculated.
The pixel is assigned the color of the closest site, partitioning the
plane into distinct regions called Voronoi cells.

## Concept

A Voronoi diagram divides space based on proximity. Each cell contains
all points that are closer to its site than to any other site. This
structure appears in nature, biology, and procedural generation.

## Techniques Used

- Distance-based partitioning
- Squared Euclidean distance
- Nested iteration over pixels
- HTML Canvas API
