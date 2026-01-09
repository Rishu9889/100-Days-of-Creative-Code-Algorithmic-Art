# Day 70 – Motion Tracking

This sketch implements basic motion tracking using frame differencing.

Live webcam frames are compared against the previous frame to detect
pixel-level changes. Regions with significant differences are
highlighted, revealing motion within the scene.

## Concept

Motion is detected by analyzing changes in pixel values over time.
Frame differencing is one of the simplest and most fundamental motion
detection techniques in computer vision.

## Techniques Used

- getUserMedia (webcam input)
- Frame differencing
- Pixel-wise comparison
- Threshold-based motion detection
- HTML Canvas API
