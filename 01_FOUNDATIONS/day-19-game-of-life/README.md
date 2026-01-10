# Day 19 – Game of Life

This sketch presents an enhanced version of Conway’s Game of Life.

In addition to the classic rules, the simulation introduces toroidal
edge wrapping and cell aging. Cells store their age, allowing visual
distinction between newly born and long-surviving cells.

## Concept

Small modifications to local rules and representation can significantly
alter the behavior and aesthetics of emergent systems. Aging and edge
wrapping provide a richer view of cellular dynamics.

## Techniques Used

- Cellular automata
- Conway’s Game of Life rules
- Toroidal grid wrapping
- Age-based visualization
- requestAnimationFrame
- HTML Canvas API
