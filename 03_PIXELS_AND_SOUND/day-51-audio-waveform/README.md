# Day 51 – Audio Waveform

This sketch visualizes live audio input as a waveform in the time
domain.

Microphone input is captured using the Web Audio API and analyzed in
real time. The amplitude values are mapped to vertical displacements,
revealing the shape of the sound signal over time.

## Concept

Sound is a continuous signal that varies over time. Visualizing the
waveform helps reveal rhythm, amplitude, and temporal structure before
moving to frequency-based analysis.

## Techniques Used

- Web Audio API
- AnalyserNode (time-domain data)
- Real-time signal visualization
- HTML Canvas API
