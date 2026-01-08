# Day 65 – Slit Scan Camera

This sketch implements a slit-scan camera effect using live webcam input.

Instead of displaying full frames, the program extracts a single vertical
slice from each frame and draws it sequentially across the canvas. Over
time, the horizontal axis represents time, creating stretched and warped
visuals of motion.

## Concept

Slit-scan imaging transforms time into space. Motion is no longer shown
as discrete frames but as continuous spatial distortion, revealing
patterns invisible to normal video playback.

## Techniques Used

- getUserMedia  (webcam access)
- Offscreen canvas pixel extraction
- Time-based image accumulation
- Canvas drawImage slicing
