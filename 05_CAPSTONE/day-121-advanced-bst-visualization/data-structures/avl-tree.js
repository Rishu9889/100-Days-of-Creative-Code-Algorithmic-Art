/**
 * ========================================
 * AVL Tree Implementation
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * AVL Tree is a self-balancing Binary Search Tree where the difference
 * between heights of left and right subtrees cannot be more than one.
 * 
 * Time Complexity:
 * - Insert: O(log n)
 * - Delete: O(log n)
 * - Search: O(log n)
 * 
 * Space Complexity: O(n)
 * 
 * Rotation Types:
 * - Left Rotation (LL)
 * - Right Rotation (RR)
 * - Left-Right Rotation (LR)
 * - Right-Left Rotation (RL)
 */

class AVLNode {
    /**
     * Creates an AVL Tree node
     * @param {number} value - The value to store in the node
     */
    constructor(value) {
        this.value = value;
        this.left = null;
        this.right = null;
        this.height = 1;
        this.x = 0;  // For visualization
        this.y = 0;  // For visualization
        this.targetX = 0; // Animation target
        this.targetY = 0; // Animation target
    }
}

class AVLTree {
    constructor() {
        this.root = null;
        this.rotationSteps = [];
        this.rotationCount = 0;
        this.nodeCount = 0;
        this.operationLog = [];
    }

    /**
     * Gets the height of a node
     * @param {AVLNode} node - The node to get height from
     * @returns {number} - Height of the node
     */
    getHeight(node) {
        if (node === null) return 0;
        return node.height;
    }

    /**
     * Gets the balance factor of a node
     * Balance factor = Height(left subtree) - Height(right subtree)
     * @param {AVLNode} node - The node to calculate balance factor
     * @returns {number} - Balance factor
     */
    getBalanceFactor(node) {
        if (node === null) return 0;
        return this.getHeight(node.left) - this.getHeight(node.right);
    }

    /**
     * Updates the height of a node based on its children
     * @param {AVLNode} node - The node to update height
     */
    updateHeight(node) {
        if (node !== null) {
            node.height = 1 + Math.max(
                this.getHeight(node.left),
                this.getHeight(node.right)
            );
        }
    }

    /**
     * Performs a Right Rotation (RR)
     * Used when: Left subtree is heavy (balance factor > 1) and 
     * new node is in the left subtree of left child
     * 
     *         y                               x
     *        / \     Right Rotation          /  \
     *       x   T3   - - - - - - - >        T1   y 
     *      / \       < - - - - - - -            / \
     *     T1  T2     Left Rotation            T2  T3
     * 
     * @param {AVLNode} y - The unbalanced node
     * @returns {AVLNode} - New root after rotation
     */
    rightRotate(y) {
        this.rotationCount++;
        this.rotationSteps.push({
            type: 'Right Rotation',
            node: y.value,
            description: `Rotating right at node ${y.value}. Left child ${y.left?.value} becomes new parent.`
        });

        const x = y.left;
        const T2 = x.right;

        // Perform rotation
        x.right = y;
        y.left = T2;

        // Update heights (order matters - update y first, then x)
        this.updateHeight(y);
        this.updateHeight(x);

        this.logOperation('rotation', `Right rotation performed at node ${y.value}`);

        return x;
    }

    /**
     * Performs a Left Rotation (LL)
     * Used when: Right subtree is heavy (balance factor < -1) and
     * new node is in the right subtree of right child
     * 
     *       x                               y
     *      / \      Left Rotation          /  \
     *     T1  y    - - - - - - - >        x    T3
     *        / \   < - - - - - - -       / \
     *       T2  T3  Right Rotation      T1  T2
     * 
     * @param {AVLNode} x - The unbalanced node
     * @returns {AVLNode} - New root after rotation
     */
    leftRotate(x) {
        this.rotationCount++;
        this.rotationSteps.push({
            type: 'Left Rotation',
            node: x.value,
            description: `Rotating left at node ${x.value}. Right child ${x.right?.value} becomes new parent.`
        });

        const y = x.right;
        const T2 = y.left;

        // Perform rotation
        y.left = x;
        x.right = T2;

        // Update heights (order matters - update x first, then y)
        this.updateHeight(x);
        this.updateHeight(y);

        this.logOperation('rotation', `Left rotation performed at node ${x.value}`);

        return y;
    }

    /**
     * Inserts a value into the AVL tree
     * @param {number} value - Value to insert
     * @returns {boolean} - True if inserted successfully
     */
    insert(value) {
        this.rotationSteps = [];
        const result = this._insertRecursive(this.root, value);

        if (result.inserted) {
            this.root = result.node;
            this.nodeCount++;
            this.logOperation('insert', `Inserted value ${value}`);
        }

        return result.inserted;
    }

    /**
     * Recursive helper for insert operation
     * @param {AVLNode} node - Current node
     * @param {number} value - Value to insert
     * @returns {Object} - Node and insertion status
     */
    _insertRecursive(node, value) {
        // Standard BST insertion
        if (node === null) {
            return { node: new AVLNode(value), inserted: true };
        }

        if (value < node.value) {
            const result = this._insertRecursive(node.left, value);
            if (!result.inserted) return { node, inserted: false };
            node.left = result.node;
        } else if (value > node.value) {
            const result = this._insertRecursive(node.right, value);
            if (!result.inserted) return { node, inserted: false };
            node.right = result.node;
        } else {
            // Duplicate values not allowed
            return { node, inserted: false };
        }

        // Update height of current node
        this.updateHeight(node);

        // Get balance factor to check if node became unbalanced
        const balance = this.getBalanceFactor(node);

        // Left Left Case (Right Rotation)
        if (balance > 1 && value < node.left.value) {
            this.rotationSteps.push({
                type: 'Case: Left-Left',
                node: node.value,
                description: `Node ${node.value} is left-heavy (balance=${balance}). New value ${value} is in left subtree of left child.`
            });
            return { node: this.rightRotate(node), inserted: true };
        }

        // Right Right Case (Left Rotation)
        if (balance < -1 && value > node.right.value) {
            this.rotationSteps.push({
                type: 'Case: Right-Right',
                node: node.value,
                description: `Node ${node.value} is right-heavy (balance=${balance}). New value ${value} is in right subtree of right child.`
            });
            return { node: this.leftRotate(node), inserted: true };
        }

        // Left Right Case (Left-Right Rotation)
        if (balance > 1 && value > node.left.value) {
            this.rotationSteps.push({
                type: 'Case: Left-Right',
                node: node.value,
                description: `Node ${node.value} is left-heavy (balance=${balance}). New value ${value} is in right subtree of left child. Performing double rotation.`
            });
            node.left = this.leftRotate(node.left);
            return { node: this.rightRotate(node), inserted: true };
        }

        // Right Left Case (Right-Left Rotation)
        if (balance < -1 && value < node.right.value) {
            this.rotationSteps.push({
                type: 'Case: Right-Left',
                node: node.value,
                description: `Node ${node.value} is right-heavy (balance=${balance}). New value ${value} is in left subtree of right child. Performing double rotation.`
            });
            node.right = this.rightRotate(node.right);
            return { node: this.leftRotate(node), inserted: true };
        }

        return { node, inserted: true };
    }

    /**
     * Finds the node with minimum value in a subtree
     * @param {AVLNode} node - Root of subtree
     * @returns {AVLNode} - Node with minimum value
     */
    getMinValueNode(node) {
        let current = node;
        while (current.left !== null) {
            current = current.left;
        }
        return current;
    }

    /**
     * Deletes a value from the AVL tree
     * @param {number} value - Value to delete
     * @returns {boolean} - True if deleted successfully
     */
    delete(value) {
        this.rotationSteps = [];
        const result = this._deleteRecursive(this.root, value);

        if (result.deleted) {
            this.root = result.node;
            this.nodeCount--;
            this.logOperation('delete', `Deleted value ${value}`);
        }

        return result.deleted;
    }

    /**
     * Recursive helper for delete operation
     * @param {AVLNode} node - Current node
     * @param {number} value - Value to delete
     * @returns {Object} - Node and deletion status
     */
    _deleteRecursive(node, value) {
        if (node === null) {
            return { node: null, deleted: false };
        }

        // Standard BST deletion
        if (value < node.value) {
            const result = this._deleteRecursive(node.left, value);
            node.left = result.node;
            if (!result.deleted) return { node, deleted: false };
        } else if (value > node.value) {
            const result = this._deleteRecursive(node.right, value);
            node.right = result.node;
            if (!result.deleted) return { node, deleted: false };
        } else {
            // Node with value found - perform deletion

            // Node with only one child or no child
            if (node.left === null || node.right === null) {
                const temp = node.left ? node.left : node.right;

                if (temp === null) {
                    // No child case
                    return { node: null, deleted: true };
                } else {
                    // One child case
                    return { node: temp, deleted: true };
                }
            }

            // Node with two children
            // Get inorder successor (smallest in right subtree)
            const successor = this.getMinValueNode(node.right);
            node.value = successor.value;

            // Delete the inorder successor
            const result = this._deleteRecursive(node.right, successor.value);
            node.right = result.node;
        }

        // Update height of current node
        this.updateHeight(node);

        // Get balance factor
        const balance = this.getBalanceFactor(node);

        // Left Left Case
        if (balance > 1 && this.getBalanceFactor(node.left) >= 0) {
            this.rotationSteps.push({
                type: 'Delete Case: Left-Left',
                node: node.value,
                description: `After deletion, node ${node.value} is left-heavy. Performing right rotation.`
            });
            return { node: this.rightRotate(node), deleted: true };
        }

        // Left Right Case
        if (balance > 1 && this.getBalanceFactor(node.left) < 0) {
            this.rotationSteps.push({
                type: 'Delete Case: Left-Right',
                node: node.value,
                description: `After deletion, node ${node.value} is left-heavy. Performing left-right rotation.`
            });
            node.left = this.leftRotate(node.left);
            return { node: this.rightRotate(node), deleted: true };
        }

        // Right Right Case
        if (balance < -1 && this.getBalanceFactor(node.right) <= 0) {
            this.rotationSteps.push({
                type: 'Delete Case: Right-Right',
                node: node.value,
                description: `After deletion, node ${node.value} is right-heavy. Performing left rotation.`
            });
            return { node: this.leftRotate(node), deleted: true };
        }

        // Right Left Case
        if (balance < -1 && this.getBalanceFactor(node.right) > 0) {
            this.rotationSteps.push({
                type: 'Delete Case: Right-Left',
                node: node.value,
                description: `After deletion, node ${node.value} is right-heavy. Performing right-left rotation.`
            });
            node.right = this.rightRotate(node.right);
            return { node: this.leftRotate(node), deleted: true };
        }

        return { node, deleted: true };
    }

    /**
     * Searches for a value in the AVL tree
     * @param {number} value - Value to search
     * @returns {Object} - Search result with found status and path
     */
    search(value) {
        const path = [];
        let current = this.root;

        while (current !== null) {
            path.push(current.value);

            if (value === current.value) {
                this.logOperation('search', `Found value ${value}. Path: ${path.join(' → ')}`);
                return { found: true, path, node: current };
            } else if (value < current.value) {
                current = current.left;
            } else {
                current = current.right;
            }
        }

        this.logOperation('search', `Value ${value} not found. Path searched: ${path.join(' → ')}`);
        return { found: false, path, node: null };
    }

    /**
     * Performs inorder traversal
     * @returns {number[]} - Array of values in sorted order
     */
    inorderTraversal() {
        const result = [];
        this._inorderRecursive(this.root, result);
        return result;
    }

    _inorderRecursive(node, result) {
        if (node !== null) {
            this._inorderRecursive(node.left, result);
            result.push(node.value);
            this._inorderRecursive(node.right, result);
        }
    }

    /**
     * Performs preorder traversal
     * @returns {number[]} - Array of values in preorder
     */
    preorderTraversal() {
        const result = [];
        this._preorderRecursive(this.root, result);
        return result;
    }

    _preorderRecursive(node, result) {
        if (node !== null) {
            result.push(node.value);
            this._preorderRecursive(node.left, result);
            this._preorderRecursive(node.right, result);
        }
    }

    /**
     * Performs postorder traversal
     * @returns {number[]} - Array of values in postorder
     */
    postorderTraversal() {
        const result = [];
        this._postorderRecursive(this.root, result);
        return result;
    }

    _postorderRecursive(node, result) {
        if (node !== null) {
            this._postorderRecursive(node.left, result);
            this._postorderRecursive(node.right, result);
            result.push(node.value);
        }
    }

    /**
     * Performs level order traversal
     * @returns {number[][]} - Array of arrays for each level
     */
    levelOrderTraversal() {
        if (this.root === null) return [];

        const result = [];
        const queue = [this.root];

        while (queue.length > 0) {
            const levelSize = queue.length;
            const level = [];

            for (let i = 0; i < levelSize; i++) {
                const node = queue.shift();
                level.push(node.value);

                if (node.left) queue.push(node.left);
                if (node.right) queue.push(node.right);
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
        return this.getHeight(this.root);
    }

    /**
     * Checks if the tree is balanced
     * @returns {boolean} - True if balanced
     */
    isBalanced() {
        return this._isBalancedRecursive(this.root);
    }

    _isBalancedRecursive(node) {
        if (node === null) return true;

        const balance = Math.abs(this.getBalanceFactor(node));
        if (balance > 1) return false;

        return this._isBalancedRecursive(node.left) &&
            this._isBalancedRecursive(node.right);
    }

    /**
     * Clears the tree
     */
    clear() {
        this.root = null;
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

        // Keep only last 50 operations
        if (this.operationLog.length > 50) {
            this.operationLog.shift();
        }
    }

    /**
     * Gets all nodes for visualization
     * @returns {AVLNode[]} - Array of all nodes
     */
    getAllNodes() {
        const nodes = [];
        this._collectNodes(this.root, nodes);
        return nodes;
    }

    _collectNodes(node, nodes) {
        if (node !== null) {
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
        return {
            nodeCount: this.nodeCount,
            height: this.getTreeHeight(),
            rotationCount: this.rotationCount,
            isBalanced: this.isBalanced()
        };
    }

    /**
     * Complexity analysis for AVL Tree
     * @returns {Object} - Complexity information
     */
    static getComplexity() {
        return {
            insert: 'O(log n)',
            delete: 'O(log n)',
            search: 'O(log n)',
            space: 'O(n)',
            description: 'AVL trees maintain strict balance, ensuring O(log n) operations. The height is always bounded by 1.44 * log₂(n+2) - 0.328.'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AVLTree, AVLNode };
}
