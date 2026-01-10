# Day 16 – Blob Detection

This sketch demonstrates basic blob detection using a grid-based
flood-fill algorithm.

A random binary grid is generated, where active cells represent
foreground pixels. The grid is scanned to find connected components
(blobs), and each detected blob is assigned a unique color.

## Concept

Blob detection identifies contiguous regions in a dataset. It is a
fundamental technique in image processing, computer vision, and
procedural analysis.

## Techniques Used

- Grid-based representation
- Flood-fill (depth-first search)
- Connected component labeling
- HTML Canvas API
