/**
 * ========================================
 * ASCII Tree Renderer
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * Provides ASCII art visualization for all tree data structures.
 * Perfect for console output and step-by-step algorithm explanation.
 */

class ASCIIRenderer {
    constructor() {
        this.output = '';
    }

    /**
     * Renders an AVL Tree as ASCII art
     * @param {AVLTree} tree - The AVL tree to render
     * @returns {string} - ASCII representation
     */
    renderAVL(tree) {
        if (!tree.root) {
            return this.renderEmpty('AVL Tree');
        }

        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += '║           AVL TREE STRUCTURE             ║\n';
        output += '╚══════════════════════════════════════════╝\n\n';

        output += this.renderBinaryTree(tree.root);

        output += '\n┌──────────────────────────────────────────┐\n';
        output += '│ Legend: [value](height)                  │\n';
        output += '│ Balance Factor = height(left) - height(right) │\n';
        output += '└──────────────────────────────────────────┘\n';

        // Add traversals
        output += '\n📊 TRAVERSALS:\n';
        output += `   Inorder:   ${tree.inorderTraversal().join(' → ')}\n`;
        output += `   Preorder:  ${tree.preorderTraversal().join(' → ')}\n`;
        output += `   Postorder: ${tree.postorderTraversal().join(' → ')}\n`;

        return output;
    }

    /**
     * Renders a Red-Black Tree as ASCII art
     * @param {RedBlackTree} tree - The Red-Black tree to render
     * @returns {string} - ASCII representation
     */
    renderRBTree(tree) {
        if (!tree.root || tree.root === tree.NIL) {
            return this.renderEmpty('Red-Black Tree');
        }

        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += '║        RED-BLACK TREE STRUCTURE          ║\n';
        output += '╚══════════════════════════════════════════╝\n\n';

        output += this.renderRBBinaryTree(tree.root, tree.NIL);

        output += '\n┌──────────────────────────────────────────┐\n';
        output += '│ Legend: 🔴 = Red Node, ⚫ = Black Node   │\n';
        output += '│ Properties:                              │\n';
        output += '│  1. Root is always black                 │\n';
        output += '│  2. Red nodes have black children        │\n';
        output += '│  3. All paths have same black height     │\n';
        output += '└──────────────────────────────────────────┘\n';

        // Add traversal with colors
        const traversal = tree.inorderTraversal();
        output += '\n📊 INORDER TRAVERSAL:\n   ';
        output += traversal.map(n => `${n.color === 'RED' ? '🔴' : '⚫'}${n.value}`).join(' → ');
        output += '\n';

        return output;
    }

    /**
     * Renders a Trie as ASCII art
     * @param {Trie} trie - The Trie to render
     * @returns {string} - ASCII representation
     */
    renderTrie(trie) {
        if (trie.wordCount === 0) {
            return this.renderEmpty('Trie');
        }

        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += '║           TRIE (PREFIX TREE)             ║\n';
        output += '╚══════════════════════════════════════════╝\n\n';

        output += this.renderTrieStructure(trie.root, '', true);

        output += '\n┌──────────────────────────────────────────┐\n';
        output += '│ Legend: ● = End of word, ○ = Prefix only │\n';
        output += '└──────────────────────────────────────────┘\n';

        // Add word list
        const words = trie.getAllWords();
        output += '\n📝 STORED WORDS:\n';
        words.forEach((word, i) => {
            output += `   ${i + 1}. "${word}"\n`;
        });

        return output;
    }

    /**
     * Renders a Segment Tree as ASCII art
     * @param {SegmentTree} segTree - The Segment Tree to render
     * @returns {string} - ASCII representation
     */
    renderSegmentTree(segTree) {
        if (segTree.n === 0) {
            return this.renderEmpty('Segment Tree');
        }

        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += `║     SEGMENT TREE (${segTree.operation.toUpperCase()} OPERATION)        ║\n`;
        output += '╚══════════════════════════════════════════╝\n\n';

        // Render original array
        output += '📊 ORIGINAL ARRAY:\n';
        output += '   Index: ';
        for (let i = 0; i < segTree.n; i++) {
            output += `[${i}]`.padStart(5);
        }
        output += '\n   Value: ';
        segTree.getArray().forEach(val => {
            output += val.toString().padStart(5);
        });
        output += '\n\n';

        // Render tree structure
        output += '🌳 TREE STRUCTURE:\n';
        output += this.renderSegmentTreeStructure(segTree);

        output += '\n┌──────────────────────────────────────────┐\n';
        output += '│ Format: [value] covering range [L, R]    │\n';
        output += '│ Leaf nodes correspond to array elements  │\n';
        output += '└──────────────────────────────────────────┘\n';

        return output;
    }

    /**
     * Renders a binary tree structure
     * @param {Object} node - Root node
     * @returns {string} - ASCII tree
     */
    renderBinaryTree(node) {
        if (!node) return '';

        const lines = [];
        const level = [];
        const next = [];

        level.push(node);
        let widest = 0;
        let nodeCount = 1;

        while (nodeCount > 0) {
            const line = [];
            const nextLine = [];
            nodeCount = 0;

            for (const n of level) {
                if (!n) {
                    line.push(null);
                    nextLine.push(null, null);
                } else {
                    const nodeStr = `[${n.value}](${n.height})`;
                    line.push(nodeStr);
                    if (nodeStr.length > widest) widest = nodeStr.length;

                    nextLine.push(n.left, n.right);
                    if (n.left) nodeCount++;
                    if (n.right) nodeCount++;
                }
            }

            if (line.some(n => n !== null)) {
                lines.push(line);
            }
            level.length = 0;
            level.push(...nextLine);
        }

        return this.formatTreeLines(lines, widest);
    }

    /**
     * Renders a Red-Black binary tree structure
     * @param {Object} node - Root node
     * @param {Object} NIL - NIL sentinel node
     * @returns {string} - ASCII tree
     */
    renderRBBinaryTree(node, NIL) {
        if (!node || node === NIL) return '';

        const lines = [];
        const level = [];
        const next = [];

        level.push(node);
        let widest = 0;
        let nodeCount = 1;

        while (nodeCount > 0) {
            const line = [];
            const nextLine = [];
            nodeCount = 0;

            for (const n of level) {
                if (!n || n === NIL) {
                    line.push(null);
                    nextLine.push(null, null);
                } else {
                    const colorSymbol = n.color === 'RED' ? '🔴' : '⚫';
                    const nodeStr = `${colorSymbol}${n.value}`;
                    line.push(nodeStr);
                    if (nodeStr.length > widest) widest = nodeStr.length;

                    nextLine.push(
                        n.left === NIL ? null : n.left,
                        n.right === NIL ? null : n.right
                    );
                    if (n.left && n.left !== NIL) nodeCount++;
                    if (n.right && n.right !== NIL) nodeCount++;
                }
            }

            if (line.some(n => n !== null)) {
                lines.push(line);
            }
            level.length = 0;
            level.push(...nextLine);
        }

        return this.formatTreeLines(lines, widest);
    }

    /**
     * Formats tree lines into ASCII output
     * @param {Array} lines - Lines of nodes
     * @param {number} widest - Widest node string
     * @returns {string} - Formatted output
     */
    formatTreeLines(lines, widest) {
        let output = '';
        const perPiece = widest + 4;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const elementsCount = Math.pow(2, i);
            const totalWidth = elementsCount * perPiece;
            const indent = Math.floor((80 - totalWidth) / 2);

            // Draw nodes
            let nodeRow = ' '.repeat(Math.max(0, indent));
            const gap = Math.floor(perPiece / 2);

            for (let j = 0; j < line.length; j++) {
                const node = line[j];
                if (node) {
                    const padding = Math.floor((perPiece - node.length) / 2);
                    nodeRow += ' '.repeat(padding) + node + ' '.repeat(perPiece - padding - node.length);
                } else {
                    nodeRow += ' '.repeat(perPiece);
                }
            }
            output += nodeRow + '\n';

            // Draw connectors
            if (i < lines.length - 1) {
                let connectorRow = ' '.repeat(Math.max(0, indent));
                for (let j = 0; j < line.length; j++) {
                    const node = line[j];
                    const halfPiece = Math.floor(perPiece / 2);
                    if (node) {
                        const hasLeft = lines[i + 1] && lines[i + 1][j * 2];
                        const hasRight = lines[i + 1] && lines[i + 1][j * 2 + 1];

                        if (hasLeft && hasRight) {
                            connectorRow += ' '.repeat(halfPiece - 1) + '┌' + '─'.repeat(halfPiece - 1) + '┴' + '─'.repeat(halfPiece - 1) + '┐' + ' '.repeat(halfPiece - 1);
                        } else if (hasLeft) {
                            connectorRow += ' '.repeat(halfPiece - 1) + '┌' + '─'.repeat(halfPiece) + ' '.repeat(halfPiece);
                        } else if (hasRight) {
                            connectorRow += ' '.repeat(halfPiece) + '─'.repeat(halfPiece) + '┐' + ' '.repeat(halfPiece - 1);
                        } else {
                            connectorRow += ' '.repeat(perPiece);
                        }
                    } else {
                        connectorRow += ' '.repeat(perPiece);
                    }
                }
                output += connectorRow + '\n';
            }
        }

        return output;
    }

    /**
     * Renders Trie structure as ASCII
     * @param {Object} node - Current node
     * @param {string} prefix - Current prefix for indentation
     * @param {boolean} isRoot - Whether this is the root node
     * @returns {string} - ASCII representation
     */
    renderTrieStructure(node, prefix, isRoot = false) {
        let output = '';

        if (isRoot) {
            output += '   (root)\n';
        }

        const children = Object.entries(node.children);
        children.forEach(([char, childNode], index) => {
            const isLast = index === children.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            const endMarker = childNode.isEndOfWord ? '●' : '○';

            output += `   ${prefix}${connector}${char} ${endMarker}`;
            if (childNode.isEndOfWord && childNode.word) {
                output += ` → "${childNode.word}"`;
            }
            output += '\n';

            const newPrefix = prefix + (isLast ? '    ' : '│   ');
            output += this.renderTrieStructure(childNode, newPrefix, false);
        });

        return output;
    }

    /**
     * Renders Segment Tree structure as ASCII
     * @param {SegmentTree} segTree - The segment tree
     * @returns {string} - ASCII representation
     */
    renderSegmentTreeStructure(segTree) {
        const levels = segTree.levelOrder();
        let output = '';

        levels.forEach((level, levelIndex) => {
            const indent = '   ' + ' '.repeat((levels.length - levelIndex - 1) * 4);

            const nodes = level.map(node => {
                return `[${node.value}]<${node.range[0]},${node.range[1]}>`;
            });

            output += indent + nodes.join('  ') + '\n';

            // Draw connectors
            if (levelIndex < levels.length - 1) {
                const connectorIndent = '   ' + ' '.repeat((levels.length - levelIndex - 2) * 4);
                let connectors = '';
                for (let i = 0; i < level.length; i++) {
                    connectors += '  ┌─┴─┐  ';
                }
                output += connectorIndent + connectors + '\n';
            }
        });

        return output;
    }

    /**
     * Renders empty tree message
     * @param {string} treeName - Name of the tree type
     * @returns {string} - ASCII message
     */
    renderEmpty(treeName) {
        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += `║           EMPTY ${treeName.toUpperCase().padEnd(25)}║\n`;
        output += '╠══════════════════════════════════════════╣\n';
        output += '║                                          ║\n';
        output += '║      ┌─────────────────────────┐         ║\n';
        output += '║      │    No elements yet!    │         ║\n';
        output += '║      │   Insert some values   │         ║\n';
        output += '║      │     to visualize       │         ║\n';
        output += '║      └─────────────────────────┘         ║\n';
        output += '║                                          ║\n';
        output += '╚══════════════════════════════════════════╝\n';
        return output;
    }

    /**
     * Renders rotation steps as ASCII
     * @param {Array} steps - Array of rotation steps
     * @returns {string} - ASCII representation
     */
    renderRotationSteps(steps) {
        if (!steps || steps.length === 0) {
            return '   No rotations performed.\n';
        }

        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += '║           ROTATION STEPS                 ║\n';
        output += '╚══════════════════════════════════════════╝\n\n';

        steps.forEach((step, index) => {
            output += `   Step ${index + 1}: ${step.type}\n`;
            output += `   Node: ${step.node}\n`;
            output += `   ${step.description}\n`;
            output += '   ' + '─'.repeat(40) + '\n';
        });

        return output;
    }

    /**
     * Renders complexity analysis as ASCII
     * @param {Object} complexity - Complexity information
     * @returns {string} - ASCII representation
     */
    renderComplexity(complexity) {
        let output = '';
        output += '╔══════════════════════════════════════════╗\n';
        output += '║        COMPLEXITY ANALYSIS               ║\n';
        output += '╠══════════════════════════════════════════╣\n';
        output += `║  Insert:  ${complexity.insert.padEnd(30)}║\n`;
        output += `║  Delete:  ${complexity.delete.padEnd(30)}║\n`;
        output += `║  Search:  ${complexity.search.padEnd(30)}║\n`;
        output += `║  Space:   ${complexity.space.padEnd(30)}║\n`;
        output += '╚══════════════════════════════════════════╝\n';
        return output;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ASCIIRenderer };
}
