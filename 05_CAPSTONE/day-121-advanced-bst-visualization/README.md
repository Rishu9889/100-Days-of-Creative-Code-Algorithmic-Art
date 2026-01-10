# Day 121: Advanced Binary Search Tree Operations with DSA Visualization 🌳

> Part of [100 Days of Creative Code & Algorithmic Art](https://github.com/motalib-code/100-Days-of-Creative-Code-Algorithmic-Art) challenge

[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

## 🎯 Overview

An interactive visualization tool for advanced Binary Search Tree operations, featuring four powerful data structures with real-time visual representations, step-by-step algorithm explanations, and comprehensive test suites.

![Preview](preview.png)

## ✨ Features

### Data Structures Implemented

| Structure | Description | Time Complexity |
|-----------|-------------|-----------------|
| **AVL Tree** | Self-balancing BST with height difference ≤ 1 | O(log n) |
| **Red-Black Tree** | Self-balancing BST with color properties | O(log n) |
| **Trie** | Prefix tree for string operations | O(m) where m = key length |
| **Segment Tree** | Range query data structure | O(log n) |

### Visualization Features

- 🎨 **Canvas Visualization**: Beautiful gradient nodes, animated edges, and smooth transitions
- 📟 **ASCII Art**: Terminal-style tree representations for algorithm understanding
- 🔄 **Rotation Steps**: Step-by-step explanations of all rotations and rebalancing
- 📊 **Complexity Analysis**: Real-time time/space complexity display
- 📈 **Statistics Panel**: Live stats including node count, height, and balance status

### Interactive Operations

- ➕ **Insert**: Add values with automatic balancing
- ➖ **Delete**: Remove values with rebalancing visualization
- 🔍 **Search**: Find values with path highlighting
- 🎲 **Random**: Generate random test data
- 🧪 **Test Suite**: Run comprehensive unit tests

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- No build tools or dependencies required!

### Installation

1. Clone the repository:
```bash
git clone https://github.com/motalib-code/100-Days-of-Creative-Code-Algorithmic-Art.git
cd 100-Days-of-Creative-Code-Algorithmic-Art/05_CAPSTONE/day-121-advanced-bst-visualization
```

2. Open `index.html` in your browser:
```bash
# Option 1: Direct open
open index.html

# Option 2: Use a local server (recommended)
npx serve .
# or
python -m http.server 8000
```

## 📖 Data Structure Details

### AVL Tree ⚖️

AVL trees maintain strict balance where the height difference between left and right subtrees is at most 1.

**Rotation Types:**
- **Left Rotation (LL)**: Right subtree is heavy
- **Right Rotation (RR)**: Left subtree is heavy  
- **Left-Right Rotation (LR)**: Left-Right case
- **Right-Left Rotation (RL)**: Right-Left case

```
Before Right Rotation:        After:
        30                      20
       /                       /  \
      20                      10   30
     /
    10
```

### Red-Black Tree 🔴⚫

Red-Black trees use node coloring to maintain balance with the following properties:

1. Every node is RED or BLACK
2. Root is always BLACK
3. All leaves (NIL) are BLACK
4. RED nodes have BLACK children
5. All paths have the same black height

### Trie (Prefix Tree) 📝

Efficient for string operations like:
- Autocomplete suggestions
- Spell checking
- Prefix matching
- Word dictionary

```
Root
├── a
│   ├── p
│   │   └── p ●
│   │       └── l
│   │           └── e ● → "apple"
│   └── n
│       └── t ● → "ant"
└── c
    └── a
        └── t ● → "cat"
```

### Segment Tree 📊

Perfect for range queries (sum, min, max, GCD) with efficient updates.

**Supported Operations:**
- `sum`: Range sum queries
- `min`: Range minimum queries
- `max`: Range maximum queries
- `gcd`: Range GCD queries

## 🧪 Test Suite

The project includes comprehensive unit tests:

```javascript
// Run all tests
const testSuite = new TestSuite();
const results = testSuite.runAllTests();
```

**Test Categories:**
- AVL Tree: 10 tests (rotations, search, delete, balance)
- Red-Black Tree: 7 tests (properties, colors, operations)
- Trie: 8 tests (insert, search, prefix, delete)
- Segment Tree: 8 tests (queries, updates, operations)
- Performance: 4 benchmarks

## 📁 Project Structure

```
day-121-advanced-bst-visualization/
├── index.html                      # Main HTML file
├── styles.css                      # Premium CSS styling
├── main.js                         # Application controller
├── data-structures/
│   ├── avl-tree.js                # AVL Tree implementation
│   ├── red-black-tree.js          # Red-Black Tree implementation
│   ├── trie.js                    # Trie implementation
│   └── segment-tree.js            # Segment Tree implementation
├── visualization/
│   ├── tree-visualizer.js         # Canvas rendering
│   └── ascii-renderer.js          # ASCII art output
├── tests/
│   └── test-suite.js              # Unit tests & benchmarks
└── README.md                       # This file
```

## ⚡ Complexity Analysis

| Operation | AVL Tree | Red-Black Tree | Trie | Segment Tree |
|-----------|----------|----------------|------|--------------|
| Insert | O(log n) | O(log n) | O(m) | O(log n) |
| Delete | O(log n) | O(log n) | O(m) | O(log n) |
| Search | O(log n) | O(log n) | O(m) | O(log n) |
| Space | O(n) | O(n) | O(ALPHABET × m × n) | O(n) |

Where:
- `n` = number of elements
- `m` = length of key/string

## 🎨 Design Highlights

- **Modern UI**: Glassmorphism effects, gradients, and micro-animations
- **Dark Theme**: Eye-friendly dark color palette
- **Responsive**: Works on all screen sizes
- **Accessible**: High contrast and keyboard navigation

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guidelines](../../Contributing.md) before submitting a PR.

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📚 Learning Resources

- [AVL Trees - GeeksforGeeks](https://www.geeksforgeeks.org/avl-tree-set-1-insertion/)
- [Red-Black Trees - Visualgo](https://visualgo.net/en/bst)
- [Trie Data Structure - Wikipedia](https://en.wikipedia.org/wiki/Trie)
- [Segment Trees - CP Algorithms](https://cp-algorithms.com/data_structures/segment_tree.html)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

## 🙏 Acknowledgments

- 100 Days of Creative Code challenge community
- Algorithm visualization inspiration from VisuAlgo
- Modern UI design patterns from Dribbble

---

<p align="center">
  Made with ❤️ as part of the 100 Days of Creative Code challenge
  <br>
  <a href="https://github.com/motalib-code/100-Days-of-Creative-Code-Algorithmic-Art">View Full Project</a>
</p>
