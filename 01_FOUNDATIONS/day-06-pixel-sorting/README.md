# Day 06 – Pixel Sorting

This sketch explores pixel sorting, a generative art technique that
rearranges pixels based on visual properties such as brightness.

A smooth color gradient is first drawn to the canvas and then disturbed
with noise to introduce high-frequency detail. Pixels are selectively
sorted row by row using a brightness threshold, producing glitch-like
streaks and visual tearing.

## Concept
Pixel sorting demonstrates how applying simple rules to raw image data
can dramatically transform an image into an abstract composition.

## Techniques Used
- Canvas ImageData API
- Pixel-level manipulation
- Brightness-based thresholding
- Partial row sorting
