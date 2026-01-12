# Day 14: Moiré Patterns

An interactive visualization of moiré patterns created with p5.js. Moiré patterns are interference patterns that appear when overlapping grids, lines, or dots are superimposed.

## Features

- **6 Different Pattern Types:**
  - Concentric Circles
  - Parallel Lines
  - Square Grid
  - Dot Matrix
  - Spiral
  - Sine Waves

- **Interactive Controls:**
  - Adjust rotation angle between layers
  - Modify spacing between pattern elements
  - Change offset between layers
  - Select from 5 color schemes
  - Control animation speed

- **Mouse Interaction:**
  - Move mouse to see interactive effects
  - Click and drag to manually adjust layer offset

## How to Run

1. Download all files into the same directory:
   - `index.html`
   - `style.css`
   - `sketch.js`
   - `README.md`

2. Open `index.html` in a web browser

3. Use the controls on the right to adjust the moiré patterns

## How Moiré Patterns Work

Moiré patterns are created by superimposing two or more similar patterns with slight differences in:
- Rotation
- Spacing
- Offset
- Scale

The interference between these patterns creates new, emergent patterns that aren't present in the individual layers. These patterns are highly sensitive to small changes, making them fascinating to explore interactively.

## Applications

Moiré patterns have practical applications in:
- **Physics**: Measuring small displacements and deformations
- **Art**: Creating optical illusions and visual effects
- **Security**: Anti-counterfeiting patterns on banknotes
- **Optical Measurements**: Determining angles and alignments
- **Fabric Design**: Creating interesting textile patterns

## Technical Implementation

This project uses:
- **p5.js** for canvas drawing and animation
- **HTML/CSS** for the user interface
- **Vanilla JavaScript** for control interactions

The patterns are drawn by creating two identical layers with slight variations in position and rotation. The interference between these layers creates the moiré effect.

## Customization

You can modify the code to:
- Add new pattern types
- Create more color schemes
- Adjust the range of control parameters
- Add save/export functionality
- Implement touch controls for mobile devices

## License

This project is open source and available for educational and personal use.

## Credits

Created as part of a 30-day creative coding challenge.

Pattern algorithms inspired by mathematical principles of interference and wave superposition.