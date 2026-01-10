# Day 55 – Beat Detection

This sketch implements a simple energy-based beat detection algorithm.

Instantaneous audio energy is compared against the average energy of
recent frames. When a sudden spike occurs, a beat is detected and
visualized.

## Concept

Rhythm can be detected by measuring changes in signal energy over time.
This approach forms the basis for many real-time audio-reactive systems
and is computationally inexpensive.

## Techniques Used

- Web Audio API
- Time-domain signal analysis
- Energy-based beat detection
- Adaptive thresholding
- Real-time visualization
