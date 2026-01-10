/**
 * ========================================
 * Tree Visualizer - Canvas Rendering
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * Provides beautiful canvas-based visualization for all tree data structures
 * with animations, highlights, and interactive features.
 */

class TreeVisualizer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');

        // Set up high DPI canvas
        this.setupCanvas();

        // Visual configuration
        this.config = {
            nodeRadius: 22,
            levelHeight: 70,
            horizontalSpacing: 40,
            animationDuration: 500,

            // Colors
            colors: {
                node: {
                    default: '#6366f1',
                    highlight: '#22d3ee',
                    insert: '#10b981',
                    delete: '#ef4444',
                    search: '#f59e0b',
                    red: '#ef4444',
                    black: '#1e293b'
                },
                edge: {
                    default: 'rgba(148, 163, 184, 0.6)',
                    highlight: '#22d3ee'
                },
                text: {
                    light: '#ffffff',
                    dark: '#0f172a'
                },
                background: '#0f0f23'
            },

            // Fonts
            fonts: {
                node: 'bold 14px Inter, sans-serif',
                label: '11px JetBrains Mono, monospace',
                height: '10px JetBrains Mono, monospace'
            }
        };

        // Animation state
        this.animationFrame = null;
        this.highlightedNodes = new Set();
        this.searchPath = [];

        // Current tree type
        this.currentType = 'avl';
    }

    /**
     * Sets up the canvas for high DPI displays
     */
    setupCanvas() {
        const rect = this.canvas.parentElement.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;

        this.canvas.width = rect.width * dpr;
        this.canvas.height = (rect.height || 480) * dpr;
        this.canvas.style.width = `${rect.width}px`;
        this.canvas.style.height = `${rect.height || 480}px`;

        this.ctx.scale(dpr, dpr);

        this.width = rect.width;
        this.height = rect.height || 480;
    }

    /**
     * Clears the canvas
     */
    clear() {
        this.ctx.fillStyle = this.config.colors.background;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    /**
     * Renders an AVL Tree
     * @param {AVLTree} tree - The AVL tree to render
     */
    renderAVL(tree) {
        this.currentType = 'avl';
        this.clear();

        if (!tree.root) {
            this.drawEmptyMessage('Empty AVL Tree');
            return;
        }

        // Calculate positions
        const positions = this.calculatePositions(tree.root, this.width / 2, 50, this.width / 4);

        // Draw edges first
        this.drawEdges(tree.root, positions);

        // Draw nodes
        this.drawAVLNodes(tree.root, positions);
    }

    /**
     * Renders a Red-Black Tree
     * @param {RedBlackTree} tree - The Red-Black tree to render
     */
    renderRBTree(tree) {
        this.currentType = 'rbtree';
        this.clear();

        if (!tree.root || tree.root === tree.NIL) {
            this.drawEmptyMessage('Empty Red-Black Tree');
            return;
        }

        // Calculate positions
        const positions = this.calculateRBPositions(tree.root, tree.NIL, this.width / 2, 50, this.width / 4);

        // Draw edges first
        this.drawRBEdges(tree.root, tree.NIL, positions);

        // Draw nodes
        this.drawRBNodes(tree.root, tree.NIL, positions);
    }

    /**
     * Renders a Trie
     * @param {Trie} trie - The Trie to render
     */
    renderTrie(trie) {
        this.currentType = 'trie';
        this.clear();

        if (trie.wordCount === 0) {
            this.drawEmptyMessage('Empty Trie - Add some words!');
            return;
        }

        // Get level order representation
        const levels = trie.levelOrderTraversal();

        // Draw Trie structure
        this.drawTrieStructure(trie.root, levels);
    }

    /**
     * Renders a Segment Tree
     * @param {SegmentTree} segTree - The Segment Tree to render
     */
    renderSegmentTree(segTree) {
        this.currentType = 'segment';
        this.clear();

        if (segTree.n === 0) {
            this.drawEmptyMessage('Empty Segment Tree - Add an array!');
            return;
        }

        // Draw the tree structure
        this.drawSegmentTreeStructure(segTree);

        // Draw the original array at the bottom
        this.drawArray(segTree.getArray());
    }

    /**
     * Calculates node positions for binary trees
     * @param {Object} node - Current node
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} spread - Horizontal spread
     * @returns {Map} - Position map
     */
    calculatePositions(node, x, y, spread, positions = new Map()) {
        if (!node) return positions;

        positions.set(node, { x, y });
        node.x = x;
        node.y = y;

        const nextSpread = spread * 0.55;
        const nextY = y + this.config.levelHeight;

        if (node.left) {
            this.calculatePositions(node.left, x - spread, nextY, nextSpread, positions);
        }
        if (node.right) {
            this.calculatePositions(node.right, x + spread, nextY, nextSpread, positions);
        }

        return positions;
    }

    /**
     * Calculates positions for Red-Black tree
     */
    calculateRBPositions(node, NIL, x, y, spread, positions = new Map()) {
        if (!node || node === NIL) return positions;

        positions.set(node, { x, y });
        node.x = x;
        node.y = y;

        const nextSpread = spread * 0.55;
        const nextY = y + this.config.levelHeight;

        if (node.left && node.left !== NIL) {
            this.calculateRBPositions(node.left, NIL, x - spread, nextY, nextSpread, positions);
        }
        if (node.right && node.right !== NIL) {
            this.calculateRBPositions(node.right, NIL, x + spread, nextY, nextSpread, positions);
        }

        return positions;
    }

    /**
     * Draws edges for binary tree
     */
    drawEdges(node, positions) {
        if (!node) return;

        const pos = positions.get(node);

        if (node.left) {
            const leftPos = positions.get(node.left);
            this.drawEdge(pos.x, pos.y, leftPos.x, leftPos.y);
            this.drawEdges(node.left, positions);
        }

        if (node.right) {
            const rightPos = positions.get(node.right);
            this.drawEdge(pos.x, pos.y, rightPos.x, rightPos.y);
            this.drawEdges(node.right, positions);
        }
    }

    /**
     * Draws edges for Red-Black tree
     */
    drawRBEdges(node, NIL, positions) {
        if (!node || node === NIL) return;

        const pos = positions.get(node);

        if (node.left && node.left !== NIL) {
            const leftPos = positions.get(node.left);
            this.drawEdge(pos.x, pos.y, leftPos.x, leftPos.y);
            this.drawRBEdges(node.left, NIL, positions);
        }

        if (node.right && node.right !== NIL) {
            const rightPos = positions.get(node.right);
            this.drawEdge(pos.x, pos.y, rightPos.x, rightPos.y);
            this.drawRBEdges(node.right, NIL, positions);
        }
    }

    /**
     * Draws a single edge
     */
    drawEdge(x1, y1, x2, y2, highlighted = false) {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1 + this.config.nodeRadius);
        this.ctx.lineTo(x2, y2 - this.config.nodeRadius);

        const gradient = this.ctx.createLinearGradient(x1, y1, x2, y2);
        if (highlighted) {
            gradient.addColorStop(0, this.config.colors.edge.highlight);
            gradient.addColorStop(1, this.config.colors.edge.highlight);
        } else {
            gradient.addColorStop(0, 'rgba(99, 102, 241, 0.4)');
            gradient.addColorStop(1, 'rgba(236, 72, 153, 0.4)');
        }

        this.ctx.strokeStyle = gradient;
        this.ctx.lineWidth = highlighted ? 3 : 2;
        this.ctx.stroke();
    }

    /**
     * Draws AVL tree nodes
     */
    drawAVLNodes(node, positions) {
        if (!node) return;

        const pos = positions.get(node);
        const isHighlighted = this.highlightedNodes.has(node.value);
        const isInPath = this.searchPath.includes(node.value);

        // Determine color
        let color = this.config.colors.node.default;
        if (isHighlighted) {
            color = this.config.colors.node.highlight;
        } else if (isInPath) {
            color = this.config.colors.node.search;
        }

        // Draw node
        this.drawNode(pos.x, pos.y, node.value.toString(), color);

        // Draw height label
        this.ctx.font = this.config.fonts.height;
        this.ctx.fillStyle = 'rgba(148, 163, 184, 0.8)';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(`h:${node.height}`, pos.x, pos.y + this.config.nodeRadius + 15);

        // Recursively draw children
        if (node.left) this.drawAVLNodes(node.left, positions);
        if (node.right) this.drawAVLNodes(node.right, positions);
    }

    /**
     * Draws Red-Black tree nodes
     */
    drawRBNodes(node, NIL, positions) {
        if (!node || node === NIL) return;

        const pos = positions.get(node);
        const isHighlighted = this.highlightedNodes.has(node.value);

        // Use red or black color based on node color
        let color = node.color === 'RED'
            ? this.config.colors.node.red
            : this.config.colors.node.black;

        if (isHighlighted) {
            color = this.config.colors.node.highlight;
        }

        // Draw node with appropriate styling
        this.drawRBNode(pos.x, pos.y, node.value.toString(), node.color, isHighlighted);

        // Recursively draw children
        if (node.left && node.left !== NIL) this.drawRBNodes(node.left, NIL, positions);
        if (node.right && node.right !== NIL) this.drawRBNodes(node.right, NIL, positions);
    }

    /**
     * Draws a basic node
     */
    drawNode(x, y, text, color) {
        const radius = this.config.nodeRadius;

        // Draw shadow
        this.ctx.beginPath();
        this.ctx.arc(x, y + 3, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fill();

        // Draw gradient background
        const gradient = this.ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
        gradient.addColorStop(0, this.lightenColor(color, 20));
        gradient.addColorStop(1, color);

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = gradient;
        this.ctx.fill();

        // Draw border
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw text
        this.ctx.font = this.config.fonts.node;
        this.ctx.fillStyle = this.config.colors.text.light;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);
    }

    /**
     * Draws a Red-Black node with special styling
     */
    drawRBNode(x, y, text, nodeColor, isHighlighted) {
        const radius = this.config.nodeRadius;

        // Draw shadow
        this.ctx.beginPath();
        this.ctx.arc(x, y + 3, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        this.ctx.fill();

        // Draw node
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (nodeColor === 'RED') {
            const gradient = this.ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
            gradient.addColorStop(0, '#f87171');
            gradient.addColorStop(1, '#dc2626');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createRadialGradient(x - 5, y - 5, 0, x, y, radius);
            gradient.addColorStop(0, '#475569');
            gradient.addColorStop(1, '#1e293b');
            this.ctx.fillStyle = gradient;
        }

        this.ctx.fill();

        // Draw highlight ring if highlighted
        if (isHighlighted) {
            this.ctx.strokeStyle = this.config.colors.node.highlight;
            this.ctx.lineWidth = 4;
            this.ctx.stroke();
        } else {
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }

        // Draw text
        this.ctx.font = this.config.fonts.node;
        this.ctx.fillStyle = this.config.colors.text.light;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(text, x, y);

        // Draw color indicator
        this.ctx.font = '10px Inter, sans-serif';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText(nodeColor === 'RED' ? 'R' : 'B', x, y + radius + 12);
    }

    /**
     * Draws Trie structure
     */
    drawTrieStructure(root, levels) {
        const startX = this.width / 2;
        const startY = 50;
        const levelHeight = 60;

        // Draw nodes level by level
        const nodePositions = new Map();

        levels.forEach((level, levelIndex) => {
            const y = startY + levelIndex * levelHeight;
            const levelWidth = this.width - 100;
            const nodeSpacing = levelWidth / (level.length + 1);

            level.forEach((node, nodeIndex) => {
                const x = 50 + nodeSpacing * (nodeIndex + 1);
                const key = `${levelIndex}-${node.char}`;
                nodePositions.set(key, { x, y, node });

                // Draw node
                this.drawTrieNode(x, y, node.char, node.isEndOfWord);
            });
        });

        // Draw edges (simplified for Trie)
        this.drawTrieEdges(root, startX, startY, this.width / 3, levelHeight);
    }

    /**
     * Draws a Trie node
     */
    drawTrieNode(x, y, char, isEndOfWord) {
        const radius = 18;

        // Draw node
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);

        if (isEndOfWord) {
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#34d399');
            gradient.addColorStop(1, '#10b981');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            gradient.addColorStop(0, '#818cf8');
            gradient.addColorStop(1, '#6366f1');
            this.ctx.fillStyle = gradient;
        }

        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Draw character
        this.ctx.font = 'bold 14px JetBrains Mono, monospace';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(char === 'root' ? '⊙' : char, x, y);
    }

    /**
     * Draws Trie edges recursively
     */
    drawTrieEdges(node, x, y, spread, levelHeight, depth = 0) {
        if (!node) return;

        const children = Object.entries(node.children);
        if (children.length === 0) return;

        const childSpread = spread / Math.max(children.length, 1);
        const startX = x - spread / 2 + childSpread / 2;

        children.forEach(([char, childNode], index) => {
            const childX = startX + index * childSpread;
            const childY = y + levelHeight;

            // Draw edge
            this.ctx.beginPath();
            this.ctx.moveTo(x, y + 18);
            this.ctx.lineTo(childX, childY - 18);
            this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.4)';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // Draw child node
            this.drawTrieNode(childX, childY, char, childNode.isEndOfWord);

            // Recursively draw children
            this.drawTrieEdges(childNode, childX, childY, childSpread * 0.8, levelHeight, depth + 1);
        });
    }

    /**
     * Draws Segment Tree structure
     */
    drawSegmentTreeStructure(segTree) {
        const structure = segTree.getTreeStructure();
        const levels = {};

        // Group by level
        structure.forEach(item => {
            if (!levels[item.level]) levels[item.level] = [];
            levels[item.level].push(item);
        });

        const startY = 50;
        const levelHeight = 65;

        // Draw each level
        Object.keys(levels).forEach(level => {
            const levelNodes = levels[level];
            const y = startY + parseInt(level) * levelHeight;
            const levelWidth = this.width - 60;
            const nodeSpacing = levelWidth / (levelNodes.length + 1);

            levelNodes.forEach((node, index) => {
                const x = 30 + nodeSpacing * (index + 1);
                this.drawSegmentNode(x, y, node.value, node.range, node.isLeaf);
            });
        });
    }

    /**
     * Draws a Segment Tree node
     */
    drawSegmentNode(x, y, value, range, isLeaf) {
        const width = 50;
        const height = 35;

        // Draw rounded rectangle
        this.ctx.beginPath();
        this.roundRect(x - width / 2, y - height / 2, width, height, 8);

        if (isLeaf) {
            const gradient = this.ctx.createLinearGradient(x, y - height / 2, x, y + height / 2);
            gradient.addColorStop(0, '#34d399');
            gradient.addColorStop(1, '#10b981');
            this.ctx.fillStyle = gradient;
        } else {
            const gradient = this.ctx.createLinearGradient(x, y - height / 2, x, y + height / 2);
            gradient.addColorStop(0, '#818cf8');
            gradient.addColorStop(1, '#6366f1');
            this.ctx.fillStyle = gradient;
        }

        this.ctx.fill();
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        this.ctx.lineWidth = 1;
        this.ctx.stroke();

        // Draw value
        this.ctx.font = 'bold 12px Inter, sans-serif';
        this.ctx.fillStyle = '#ffffff';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(value.toString(), x, y - 5);

        // Draw range
        this.ctx.font = '9px JetBrains Mono, monospace';
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        this.ctx.fillText(`[${range[0]},${range[1]}]`, x, y + 10);
    }

    /**
     * Draws the original array for Segment Tree
     */
    drawArray(arr) {
        const y = this.height - 40;
        const cellWidth = Math.min(50, (this.width - 60) / arr.length);
        const startX = (this.width - cellWidth * arr.length) / 2;

        // Draw label
        this.ctx.font = '12px Inter, sans-serif';
        this.ctx.fillStyle = '#94a3b8';
        this.ctx.textAlign = 'left';
        this.ctx.fillText('Original Array:', 20, y);

        // Draw array cells
        arr.forEach((val, index) => {
            const x = startX + index * cellWidth;

            // Draw cell
            this.ctx.fillStyle = '#1e293b';
            this.ctx.fillRect(x, y - 15, cellWidth - 2, 30);
            this.ctx.strokeStyle = '#6366f1';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y - 15, cellWidth - 2, 30);

            // Draw value
            this.ctx.font = 'bold 11px JetBrains Mono, monospace';
            this.ctx.fillStyle = '#f8fafc';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(val.toString(), x + cellWidth / 2 - 1, y + 2);

            // Draw index
            this.ctx.font = '9px JetBrains Mono, monospace';
            this.ctx.fillStyle = '#64748b';
            this.ctx.fillText(index.toString(), x + cellWidth / 2 - 1, y + 25);
        });
    }

    /**
     * Draws empty tree message
     */
    drawEmptyMessage(message) {
        this.ctx.font = '18px Inter, sans-serif';
        this.ctx.fillStyle = '#64748b';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(message, this.width / 2, this.height / 2);

        // Draw decorative circle
        this.ctx.beginPath();
        this.ctx.arc(this.width / 2, this.height / 2 - 50, 30, 0, Math.PI * 2);
        this.ctx.strokeStyle = 'rgba(99, 102, 241, 0.3)';
        this.ctx.lineWidth = 2;
        this.ctx.setLineDash([5, 5]);
        this.ctx.stroke();
        this.ctx.setLineDash([]);
    }

    /**
     * Helper to draw rounded rectangle
     */
    roundRect(x, y, width, height, radius) {
        this.ctx.moveTo(x + radius, y);
        this.ctx.lineTo(x + width - radius, y);
        this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        this.ctx.lineTo(x + width, y + height - radius);
        this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        this.ctx.lineTo(x + radius, y + height);
        this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        this.ctx.lineTo(x, y + radius);
        this.ctx.quadraticCurveTo(x, y, x + radius, y);
    }

    /**
     * Lightens a color
     */
    lightenColor(color, percent) {
        const num = parseInt(color.replace('#', ''), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return '#' + (
            0x1000000 +
            (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)
        ).toString(16).slice(1);
    }

    /**
     * Highlights specific nodes
     */
    highlightNodes(values) {
        this.highlightedNodes = new Set(values);
    }

    /**
     * Sets the search path for visualization
     */
    setSearchPath(path) {
        this.searchPath = path;
    }

    /**
     * Clears highlights
     */
    clearHighlights() {
        this.highlightedNodes.clear();
        this.searchPath = [];
    }

    /**
     * Handles window resize
     */
    resize() {
        this.setupCanvas();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TreeVisualizer };
}
