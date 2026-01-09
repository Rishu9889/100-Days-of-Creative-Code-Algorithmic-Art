# 🎯 Overview

This project demonstrates kinetic typography, where text is animated over time to enhance meaning and expression.
Instead of treating text as a static block, each character is animated independently using mathematical functions and time-based motion.

The goal is to introduce motion design fundamentals through creative coding.

#

# 🧠 Core Concept

Kinetic typography combines:

- Typography (letters as visual elements)
- Time (animation over frames)
- Motion (position changes driven by math)

In this sketch:
- Each letter follows a sine-wave motion
- Letters are phase-shifted to create a flowing wave
- Words appear sequentially to establish hierarchy
- Mouse movement controls animation intensity

# 🚀 Quick Start

- Download the index.html file.
- Open it in any modern web browser (Chrome, Firefox, Safari).
- Interact: Drag your mouse across the screen to "seed" new life into the system.

# ⚙️ How It Works
- Text is split into words, then characters
- Each character’s vertical position is offset using:
```bash
sin(time + index * phase)
``` 
- Time advances smoothly using frame timestamps
- Mouse position affects wave amplitude
- Canvas resizes dynamically with the window

# 📂 Files
``` bash
day-17-kinetic-typography/
├── index.html
├── sketch.js
└── README.md
```
