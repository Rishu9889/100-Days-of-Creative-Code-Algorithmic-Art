# Day 60 – Webcam ASCII

This sketch converts live webcam video into ASCII art in real time.

Video frames are captured using the MediaDevices API and rendered to a
canvas. Pixel brightness values are sampled and mapped to ASCII
characters based on luminance, producing a text-based visualization of
the video stream.

## Concept

Images are data. By reducing pixel information to brightness values,
visual information can be represented using text instead of color.

## Techniques Used

- getUserMedia (webcam access)
- Canvas pixel sampling
- Luminance calculation
- ASCII character mapping
- Real-time text rendering
