/**
 * ========================================
 * Red-Black Tree Implementation
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * Red-Black Tree is a self-balancing Binary Search Tree with the following properties:
 * 1. Every node is either red or black
 * 2. The root is always black
 * 3. Every leaf (NIL) is black
 * 4. If a node is red, then both its children are black
 * 5. For each node, all simple paths from the node to descendant leaves 
 *    contain the same number of black nodes
 * 
 * Time Complexity:
 * - Insert: O(log n)
 * - Delete: O(log n)
 * - Search: O(log n)
 * 
 * Space Complexity: O(n)
 */

// Color constants
const RED = 'RED';
const BLACK = 'BLACK';

class RBNode {
    /**
     * Creates a Red-Black Tree node
     * @param {number} value - The value to store in the node
     */
    constructor(value) {
        this.value = value;
        this.color = RED; // New nodes are always RED
        this.left = null;
        this.right = null;
        this.parent = null;
        this.x = 0;  // For visualization
        this.y = 0;  // For visualization
    }
}

class RedBlackTree {
    constructor() {
        // NIL node (sentinel node)
        this.NIL = new RBNode(null);
        this.NIL.color = BLACK;
        this.NIL.left = null;
        this.NIL.right = null;

        this.root = this.NIL;
        this.rotationSteps = [];
        this.rotationCount = 0;
        this.nodeCount = 0;
        this.operationLog = [];
    }

    /**
     * Performs a Left Rotation
     * 
     *       x                               y
     *      / \      Left Rotation          /  \
     *     α   y    - - - - - - - >        x    γ
     *        / \                         / \
     *       β   γ                       α   β
     * 
     * @param {RBNode} x - The node to rotate around
     */
    leftRotate(x) {
        this.rotationCount++;
        this.rotationSteps.push({
            type: 'Left Rotation',
            node: x.value,
            description: `Left rotation at node ${x.value}. Right child ${x.right.value} becomes new parent.`
        });

        const y = x.right;

        // Turn y's left subtree into x's right subtree
        x.right = y.left;
        if (y.left !== this.NIL) {
            y.left.parent = x;
        }

        // Link x's parent to y
        y.parent = x.parent;
        if (x.parent === null) {
            this.root = y;
        } else if (x === x.parent.left) {
            x.parent.left = y;
        } else {
            x.parent.right = y;
        }

        // Put x on y's left
        y.left = x;
        x.parent = y;

        this.logOperation('rotation', `Left rotation performed at node ${x.value}`);
    }

    /**
     * Performs a Right Rotation
     * 
     *         y                               x
     *        / \     Right Rotation          /  \
     *       x   γ   - - - - - - - >        α    y 
     *      / \                                 / \
     *     α   β                               β   γ
     * 
     * @param {RBNode} y - The node to rotate around
     */
    rightRotate(y) {
        this.rotationCount++;
        this.rotationSteps.push({
            type: 'Right Rotation',
            node: y.value,
            description: `Right rotation at node ${y.value}. Left child ${y.left.value} becomes new parent.`
        });

        const x = y.left;

        // Turn x's right subtree into y's left subtree
        y.left = x.right;
        if (x.right !== this.NIL) {
            x.right.parent = y;
        }

        // Link y's parent to x
        x.parent = y.parent;
        if (y.parent === null) {
            this.root = x;
        } else if (y === y.parent.right) {
            y.parent.right = x;
        } else {
            y.parent.left = x;
        }

        // Put y on x's right
        x.right = y;
        y.parent = x;

        this.logOperation('rotation', `Right rotation performed at node ${y.value}`);
    }

    /**
     * Inserts a value into the Red-Black tree
     * @param {number} value - Value to insert
     * @returns {boolean} - True if inserted successfully
     */
    insert(value) {
        this.rotationSteps = [];

        // Check for duplicate
        if (this.search(value).found) {
            return false;
        }

        const node = new RBNode(value);
        node.left = this.NIL;
        node.right = this.NIL;

        let y = null;
        let x = this.root;

        // Standard BST insert
        while (x !== this.NIL) {
            y = x;
            if (node.value < x.value) {
                x = x.left;
            } else {
                x = x.right;
            }
        }

        node.parent = y;
        if (y === null) {
            this.root = node;
        } else if (node.value < y.value) {
            y.left = node;
        } else {
            y.right = node;
        }

        this.nodeCount++;

        // If new node is root, color it black and return
        if (node.parent === null) {
            node.color = BLACK;
            this.logOperation('insert', `Inserted ${value} as root (colored BLACK)`);
            return true;
        }

        // If grandparent is null, just return
        if (node.parent.parent === null) {
            this.logOperation('insert', `Inserted ${value} (no fixup needed)`);
            return true;
        }

        // Fix the tree
        this.insertFixup(node);
        this.logOperation('insert', `Inserted ${value}`);
        return true;
    }

    /**
     * Fixes the Red-Black tree after insertion
     * @param {RBNode} k - The newly inserted node
     */
    insertFixup(k) {
        while (k.parent && k.parent.color === RED) {
            if (k.parent === k.parent.parent.right) {
                // Uncle is on the left
                const uncle = k.parent.parent.left;

                if (uncle.color === RED) {
                    // Case 1: Uncle is red
                    this.rotationSteps.push({
                        type: 'Case 1: Red Uncle',
                        node: k.value,
                        description: `Uncle is RED. Recoloring: parent and uncle to BLACK, grandparent to RED.`
                    });
                    uncle.color = BLACK;
                    k.parent.color = BLACK;
                    k.parent.parent.color = RED;
                    k = k.parent.parent;
                } else {
                    // Case 2: Uncle is black and k is left child
                    if (k === k.parent.left) {
                        this.rotationSteps.push({
                            type: 'Case 2: Black Uncle, Left Child',
                            node: k.value,
                            description: `Uncle is BLACK and node is left child. Right rotation at parent.`
                        });
                        k = k.parent;
                        this.rightRotate(k);
                    }
                    // Case 3: Uncle is black and k is right child
                    this.rotationSteps.push({
                        type: 'Case 3: Black Uncle, Right Child',
                        node: k.value,
                        description: `Uncle is BLACK and node is right child. Recolor and left rotation at grandparent.`
                    });
                    k.parent.color = BLACK;
                    k.parent.parent.color = RED;
                    this.leftRotate(k.parent.parent);
                }
            } else {
                // Uncle is on the right
                const uncle = k.parent.parent.right;

                if (uncle.color === RED) {
                    // Case 1: Uncle is red
                    this.rotationSteps.push({
                        type: 'Case 1: Red Uncle',
                        node: k.value,
                        description: `Uncle is RED. Recoloring: parent and uncle to BLACK, grandparent to RED.`
                    });
                    uncle.color = BLACK;
                    k.parent.color = BLACK;
                    k.parent.parent.color = RED;
                    k = k.parent.parent;
                } else {
                    // Case 2: Uncle is black and k is right child
                    if (k === k.parent.right) {
                        this.rotationSteps.push({
                            type: 'Case 2: Black Uncle, Right Child',
                            node: k.value,
                            description: `Uncle is BLACK and node is right child. Left rotation at parent.`
                        });
                        k = k.parent;
                        this.leftRotate(k);
                    }
                    // Case 3: Uncle is black and k is left child
                    this.rotationSteps.push({
                        type: 'Case 3: Black Uncle, Left Child',
                        node: k.value,
                        description: `Uncle is BLACK and node is left child. Recolor and right rotation at grandparent.`
                    });
                    k.parent.color = BLACK;
                    k.parent.parent.color = RED;
                    this.rightRotate(k.parent.parent);
                }
            }

            if (k === this.root) break;
        }

        this.root.color = BLACK;
    }

    /**
     * Transplants one subtree with another
     * @param {RBNode} u - Node to be replaced
     * @param {RBNode} v - Node to replace with
     */
    transplant(u, v) {
        if (u.parent === null) {
            this.root = v;
        } else if (u === u.parent.left) {
            u.parent.left = v;
        } else {
            u.parent.right = v;
        }
        v.parent = u.parent;
    }

    /**
     * Finds the minimum node in a subtree
     * @param {RBNode} node - Root of subtree
     * @returns {RBNode} - Node with minimum value
     */
    minimum(node) {
        while (node.left !== this.NIL) {
            node = node.left;
        }
        return node;
    }

    /**
     * Deletes a value from the Red-Black tree
     * @param {number} value - Value to delete
     * @returns {boolean} - True if deleted successfully
     */
    delete(value) {
        this.rotationSteps = [];
        return this.deleteNode(this.root, value);
    }

    /**
     * Helper method to delete a node
     * @param {RBNode} node - Starting node
     * @param {number} value - Value to delete
     * @returns {boolean} - True if deleted successfully
     */
    deleteNode(node, value) {
        let z = this.NIL;
        let x, y;

        // Find the node to delete
        while (node !== this.NIL) {
            if (node.value === value) {
                z = node;
                break;
            }
            if (value < node.value) {
                node = node.left;
            } else {
                node = node.right;
            }
        }

        if (z === this.NIL) {
            return false; // Node not found
        }

        y = z;
        let yOriginalColor = y.color;

        if (z.left === this.NIL) {
            x = z.right;
            this.transplant(z, z.right);
        } else if (z.right === this.NIL) {
            x = z.left;
            this.transplant(z, z.left);
        } else {
            y = this.minimum(z.right);
            yOriginalColor = y.color;
            x = y.right;

            if (y.parent === z) {
                x.parent = y;
            } else {
                this.transplant(y, y.right);
                y.right = z.right;
                y.right.parent = y;
            }

            this.transplant(z, y);
            y.left = z.left;
            y.left.parent = y;
            y.color = z.color;
        }

        this.nodeCount--;

        if (yOriginalColor === BLACK) {
            this.deleteFixup(x);
        }

        this.logOperation('delete', `Deleted ${value}`);
        return true;
    }

    /**
     * Fixes the Red-Black tree after deletion
     * @param {RBNode} x - The node to fix from
     */
    deleteFixup(x) {
        while (x !== this.root && x.color === BLACK) {
            if (x === x.parent.left) {
                let w = x.parent.right; // Sibling

                // Case 1: Sibling is red
                if (w.color === RED) {
                    this.rotationSteps.push({
                        type: 'Delete Case 1: Red Sibling',
                        node: x.value || 'NIL',
                        description: `Sibling is RED. Recolor sibling to BLACK, parent to RED, then left rotate at parent.`
                    });
                    w.color = BLACK;
                    x.parent.color = RED;
                    this.leftRotate(x.parent);
                    w = x.parent.right;
                }

                // Case 2: Sibling's children are both black
                if (w.left.color === BLACK && w.right.color === BLACK) {
                    this.rotationSteps.push({
                        type: 'Delete Case 2: Black Sibling Children',
                        node: x.value || 'NIL',
                        description: `Sibling's children are both BLACK. Recolor sibling to RED, move up.`
                    });
                    w.color = RED;
                    x = x.parent;
                } else {
                    // Case 3: Sibling's right child is black
                    if (w.right.color === BLACK) {
                        this.rotationSteps.push({
                            type: 'Delete Case 3: Black Right Nephew',
                            node: x.value || 'NIL',
                            description: `Sibling's right child is BLACK. Recolor and right rotate at sibling.`
                        });
                        w.left.color = BLACK;
                        w.color = RED;
                        this.rightRotate(w);
                        w = x.parent.right;
                    }

                    // Case 4: Sibling's right child is red
                    this.rotationSteps.push({
                        type: 'Delete Case 4: Red Right Nephew',
                        node: x.value || 'NIL',
                        description: `Sibling's right child is RED. Recolor and left rotate at parent.`
                    });
                    w.color = x.parent.color;
                    x.parent.color = BLACK;
                    w.right.color = BLACK;
                    this.leftRotate(x.parent);
                    x = this.root;
                }
            } else {
                // Mirror cases for right child
                let w = x.parent.left;

                if (w.color === RED) {
                    w.color = BLACK;
                    x.parent.color = RED;
                    this.rightRotate(x.parent);
                    w = x.parent.left;
                }

                if (w.right.color === BLACK && w.left.color === BLACK) {
                    w.color = RED;
                    x = x.parent;
                } else {
                    if (w.left.color === BLACK) {
                        w.right.color = BLACK;
                        w.color = RED;
                        this.leftRotate(w);
                        w = x.parent.left;
                    }

                    w.color = x.parent.color;
                    x.parent.color = BLACK;
                    w.left.color = BLACK;
                    this.rightRotate(x.parent);
                    x = this.root;
                }
            }
        }

        x.color = BLACK;
    }

    /**
     * Searches for a value in the Red-Black tree
     * @param {number} value - Value to search
     * @returns {Object} - Search result with found status and path
     */
    search(value) {
        const path = [];
        let current = this.root;

        while (current !== this.NIL && current !== null) {
            path.push({ value: current.value, color: current.color });

            if (value === current.value) {
                this.logOperation('search', `Found ${value}. Path: ${path.map(n => `${n.value}(${n.color})`).join(' → ')}`);
                return { found: true, path, node: current };
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        this.logOperation('search', `Value ${value} not found`);
        return { found: false, path, node: null };
    }

    /**
     * Inorder traversal
     * @returns {Array} - Array of objects with value and color
     */
    inorderTraversal() {
        const result = [];
        this._inorderRecursive(this.root, result);
        return result;
    }

    _inorderRecursive(node, result) {
        if (node !== this.NIL) {
            this._inorderRecursive(node.left, result);
            result.push({ value: node.value, color: node.color });
            this._inorderRecursive(node.right, result);
        }
    }

    /**
     * Level order traversal
     * @returns {Array} - Array of levels, each containing node info
     */
    levelOrderTraversal() {
        if (this.root === this.NIL) return [];

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const level = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                level.push({ value: node.value, color: node.color });

                if (node.left !== this.NIL) queue.push(node.left);
                if (node.right !== this.NIL) queue.push(node.right);
            }

            result.push(level);
        }

        return result;
    }

    /**
     * Gets the tree height
     * @returns {number} - Height of the tree
     */
    getTreeHeight() {
        return this._getHeightRecursive(this.root);
    }

    _getHeightRecursive(node) {
        if (node === this.NIL) return 0;
        return 1 + Math.max(
            this._getHeightRecursive(node.left),
            this._getHeightRecursive(node.right)
        );
    }

    /**
     * Verifies Red-Black tree properties
     * @returns {Object} - Verification result
     */
    verify() {
        const violations = [];

        // Property 2: Root is black
        if (this.root !== this.NIL && this.root.color !== BLACK) {
            violations.push('Root is not BLACK');
        }

        // Check other properties recursively
        const blackHeight = this._verifyRecursive(this.root, violations);

        return {
            valid: violations.length === 0,
            violations,
            blackHeight
        };
    }

    _verifyRecursive(node, violations) {
        if (node === this.NIL) return 1;

        // Property 4: Red node cannot have red children
        if (node.color === RED) {
            if (node.left.color === RED || node.right.color === RED) {
                violations.push(`Red node ${node.value} has red child`);
            }
        }

        // Property 5: Check black height consistency
        const leftBlackHeight = this._verifyRecursive(node.left, violations);
        const rightBlackHeight = this._verifyRecursive(node.right, violations);

        if (leftBlackHeight !== rightBlackHeight) {
            violations.push(`Black height mismatch at node ${node.value}: left=${leftBlackHeight}, right=${rightBlackHeight}`);
        }

        return leftBlackHeight + (node.color === BLACK ? 1 : 0);
    }

    /**
     * Clears the tree
     */
    clear() {
        this.root = this.NIL;
        this.nodeCount = 0;
        this.rotationCount = 0;
        this.rotationSteps = [];
        this.logOperation('info', 'Tree cleared');
    }

    /**
     * Logs an operation
     * @param {string} type - Type of operation
     * @param {string} message - Operation message
     */
    logOperation(type, message) {
        this.operationLog.push({
            type,
            message,
            timestamp: new Date().toLocaleTimeString()
        });

        if (this.operationLog.length > 50) {
            this.operationLog.shift();
        }
    }

    /**
     * Gets all nodes for visualization
     * @returns {Array} - Array of all nodes with position info
     */
    getAllNodes() {
        const nodes = [];
        this._collectNodes(this.root, nodes);
        return nodes;
    }

    _collectNodes(node, nodes) {
        if (node !== this.NIL) {
            nodes.push(node);
            this._collectNodes(node.left, nodes);
            this._collectNodes(node.right, nodes);
        }
    }

    /**
     * Gets statistics about the tree
     * @returns {Object} - Statistics object
     */
    getStats() {
        const verification = this.verify();
        return {
            nodeCount: this.nodeCount,
            height: this.getTreeHeight(),
            rotationCount: this.rotationCount,
            isBalanced: verification.valid,
            blackHeight: verification.blackHeight
        };
    }

    /**
     * Complexity analysis for Red-Black Tree
     * @returns {Object} - Complexity information
     */
    static getComplexity() {
        return {
            insert: 'O(log n)',
            delete: 'O(log n)',
            search: 'O(log n)',
            space: 'O(n)',
            description: 'Red-Black trees guarantee O(log n) operations with at most 2 rotations per insert and 3 per delete. Height is at most 2*log₂(n+1).'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { RedBlackTree, RBNode, RED, BLACK };
}
