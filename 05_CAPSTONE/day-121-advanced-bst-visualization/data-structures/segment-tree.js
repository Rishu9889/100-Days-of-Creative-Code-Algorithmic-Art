/**
 * ========================================
 * Segment Tree Implementation
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * A Segment Tree is a data structure that allows answering range queries 
 * over an array effectively, while still being flexible enough to allow 
 * modifying the array.
 * 
 * Applications:
 * - Range Sum Queries
 * - Range Minimum/Maximum Queries
 * - Range GCD/LCM Queries
 * - Count of elements in a range
 * 
 * Time Complexity:
 * - Build: O(n)
 * - Query: O(log n)
 * - Update: O(log n)
 * 
 * Space Complexity: O(n)
 */

class SegmentTree {
    /**
     * Creates a Segment Tree
     * @param {number[]} arr - The input array
     * @param {string} operation - The operation type: 'sum', 'min', 'max', 'gcd'
     */
    constructor(arr = [], operation = 'sum') {
        this.n = arr.length;
        this.operation = operation;
        this.originalArray = [...arr];

        // Tree size: For a segment tree, we need at most 4*n space
        this.tree = new Array(4 * Math.max(this.n, 1)).fill(this._getIdentity());

        // Lazy propagation array for range updates
        this.lazy = new Array(4 * Math.max(this.n, 1)).fill(0);

        this.operationLog = [];
        this.querySteps = [];

        if (arr.length > 0) {
            this._build(arr, 0, 0, this.n - 1);
        }
    }

    /**
     * Gets the identity element for the operation
     * @returns {number} - Identity element
     */
    _getIdentity() {
        switch (this.operation) {
            case 'sum': return 0;
            case 'min': return Infinity;
            case 'max': return -Infinity;
            case 'gcd': return 0;
            default: return 0;
        }
    }

    /**
     * Combines two values based on the operation
     * @param {number} a - First value
     * @param {number} b - Second value
     * @returns {number} - Combined result
     */
    _combine(a, b) {
        switch (this.operation) {
            case 'sum': return a + b;
            case 'min': return Math.min(a, b);
            case 'max': return Math.max(a, b);
            case 'gcd': return this._gcd(a, b);
            default: return a + b;
        }
    }

    /**
     * Calculates GCD of two numbers
     * @param {number} a - First number
     * @param {number} b - Second number
     * @returns {number} - GCD
     */
    _gcd(a, b) {
        a = Math.abs(a);
        b = Math.abs(b);
        while (b !== 0) {
            const temp = b;
            b = a % b;
            a = temp;
        }
        return a;
    }

    /**
     * Builds the segment tree
     * @param {number[]} arr - Input array
     * @param {number} node - Current node index
     * @param {number} start - Start of range
     * @param {number} end - End of range
     */
    _build(arr, node, start, end) {
        if (start === end) {
            // Leaf node
            this.tree[node] = arr[start];
        } else {
            const mid = Math.floor((start + end) / 2);
            const leftChild = 2 * node + 1;
            const rightChild = 2 * node + 2;

            // Build left and right subtrees
            this._build(arr, leftChild, start, mid);
            this._build(arr, rightChild, mid + 1, end);

            // Internal node stores the combined result
            this.tree[node] = this._combine(this.tree[leftChild], this.tree[rightChild]);
        }
    }

    /**
     * Updates a single element
     * @param {number} index - Index to update
     * @param {number} value - New value
     * @returns {boolean} - True if updated successfully
     */
    update(index, value) {
        if (index < 0 || index >= this.n) {
            this.logOperation('error', `Invalid index: ${index}`);
            return false;
        }

        this.querySteps = [];
        this._updateRecursive(0, 0, this.n - 1, index, value);
        this.originalArray[index] = value;
        this.logOperation('update', `Updated index ${index} to value ${value}`);
        return true;
    }

    /**
     * Recursive update helper
     * @param {number} node - Current node
     * @param {number} start - Start of range
     * @param {number} end - End of range
     * @param {number} index - Index to update
     * @param {number} value - New value
     */
    _updateRecursive(node, start, end, index, value) {
        this.querySteps.push({
            type: 'visit',
            node,
            range: [start, end],
            description: `Visiting node ${node} covering range [${start}, ${end}]`
        });

        if (start === end) {
            // Leaf node
            this.tree[node] = value;
            this.querySteps.push({
                type: 'update',
                node,
                range: [start, end],
                description: `Updated leaf node ${node} to ${value}`
            });
        } else {
            const mid = Math.floor((start + end) / 2);
            const leftChild = 2 * node + 1;
            const rightChild = 2 * node + 2;

            if (index <= mid) {
                this._updateRecursive(leftChild, start, mid, index, value);
            } else {
                this._updateRecursive(rightChild, mid + 1, end, index, value);
            }

            // Recalculate parent
            this.tree[node] = this._combine(this.tree[leftChild], this.tree[rightChild]);
            this.querySteps.push({
                type: 'recalculate',
                node,
                range: [start, end],
                description: `Recalculated node ${node} = ${this.tree[node]}`
            });
        }
    }

    /**
     * Range update - adds a value to all elements in range
     * @param {number} left - Left index of range
     * @param {number} right - Right index of range
     * @param {number} delta - Value to add
     * @returns {boolean} - True if updated successfully
     */
    rangeUpdate(left, right, delta) {
        if (left < 0 || right >= this.n || left > right) {
            this.logOperation('error', `Invalid range: [${left}, ${right}]`);
            return false;
        }

        this.querySteps = [];
        this._rangeUpdateRecursive(0, 0, this.n - 1, left, right, delta);

        // Update original array
        for (let i = left; i <= right; i++) {
            this.originalArray[i] += delta;
        }

        this.logOperation('update', `Range update [${left}, ${right}] += ${delta}`);
        return true;
    }

    /**
     * Recursive range update with lazy propagation
     * @param {number} node - Current node
     * @param {number} start - Start of range
     * @param {number} end - End of range
     * @param {number} left - Left query boundary
     * @param {number} right - Right query boundary
     * @param {number} delta - Value to add
     */
    _rangeUpdateRecursive(node, start, end, left, right, delta) {
        // Push down lazy values
        this._pushDown(node, start, end);

        if (start > right || end < left) {
            // Out of range
            return;
        }

        if (left <= start && end <= right) {
            // Completely within range
            if (this.operation === 'sum') {
                this.tree[node] += delta * (end - start + 1);
            } else {
                this.tree[node] += delta;
            }

            if (start !== end) {
                this.lazy[2 * node + 1] += delta;
                this.lazy[2 * node + 2] += delta;
            }

            this.querySteps.push({
                type: 'range_update',
                node,
                range: [start, end],
                description: `Updated range [${start}, ${end}] += ${delta}`
            });
            return;
        }

        const mid = Math.floor((start + end) / 2);
        const leftChild = 2 * node + 1;
        const rightChild = 2 * node + 2;

        this._rangeUpdateRecursive(leftChild, start, mid, left, right, delta);
        this._rangeUpdateRecursive(rightChild, mid + 1, end, left, right, delta);

        this.tree[node] = this._combine(this.tree[leftChild], this.tree[rightChild]);
    }

    /**
     * Pushes down lazy values to children
     * @param {number} node - Current node
     * @param {number} start - Start of range
     * @param {number} end - End of range
     */
    _pushDown(node, start, end) {
        if (this.lazy[node] !== 0) {
            if (this.operation === 'sum') {
                this.tree[node] += this.lazy[node] * (end - start + 1);
            } else {
                this.tree[node] += this.lazy[node];
            }

            if (start !== end) {
                this.lazy[2 * node + 1] += this.lazy[node];
                this.lazy[2 * node + 2] += this.lazy[node];
            }

            this.lazy[node] = 0;
        }
    }

    /**
     * Queries a range
     * @param {number} left - Left index of range
     * @param {number} right - Right index of range
     * @returns {Object} - Query result with value and steps
     */
    query(left, right) {
        if (left < 0 || right >= this.n || left > right) {
            this.logOperation('error', `Invalid range: [${left}, ${right}]`);
            return { value: this._getIdentity(), valid: false };
        }

        this.querySteps = [];
        const result = this._queryRecursive(0, 0, this.n - 1, left, right);
        this.logOperation('search', `Query [${left}, ${right}] = ${result}`);
        return { value: result, valid: true, steps: this.querySteps };
    }

    /**
     * Recursive query helper
     * @param {number} node - Current node
     * @param {number} start - Start of range
     * @param {number} end - End of range
     * @param {number} left - Left query boundary
     * @param {number} right - Right query boundary
     * @returns {number} - Query result
     */
    _queryRecursive(node, start, end, left, right) {
        // Push down lazy values
        this._pushDown(node, start, end);

        this.querySteps.push({
            type: 'visit',
            node,
            range: [start, end],
            query: [left, right],
            description: `Visiting node ${node} [${start}, ${end}] for query [${left}, ${right}]`
        });

        if (start > right || end < left) {
            // Out of range
            this.querySteps.push({
                type: 'skip',
                node,
                range: [start, end],
                description: `Range [${start}, ${end}] outside query range, returning identity`
            });
            return this._getIdentity();
        }

        if (left <= start && end <= right) {
            // Completely within range
            this.querySteps.push({
                type: 'match',
                node,
                range: [start, end],
                value: this.tree[node],
                description: `Range [${start}, ${end}] fully inside query, returning ${this.tree[node]}`
            });
            return this.tree[node];
        }

        // Partial overlap
        const mid = Math.floor((start + end) / 2);
        const leftResult = this._queryRecursive(2 * node + 1, start, mid, left, right);
        const rightResult = this._queryRecursive(2 * node + 2, mid + 1, end, left, right);

        const combined = this._combine(leftResult, rightResult);
        this.querySteps.push({
            type: 'combine',
            node,
            range: [start, end],
            value: combined,
            description: `Combined results: ${leftResult} ${this.operation} ${rightResult} = ${combined}`
        });

        return combined;
    }

    /**
     * Gets a visual representation of the tree structure
     * @returns {Array} - Tree structure for visualization
     */
    getTreeStructure() {
        const structure = [];
        this._collectStructure(0, 0, this.n - 1, structure, 0);
        return structure;
    }

    _collectStructure(node, start, end, structure, level) {
        if (start > end || node >= this.tree.length) return;

        structure.push({
            node,
            level,
            range: [start, end],
            value: this.tree[node],
            isLeaf: start === end
        });

        if (start < end) {
            const mid = Math.floor((start + end) / 2);
            this._collectStructure(2 * node + 1, start, mid, structure, level + 1);
            this._collectStructure(2 * node + 2, mid + 1, end, structure, level + 1);
        }
    }

    /**
     * Gets level order representation
     * @returns {Array} - Levels of the tree
     */
    levelOrder() {
        const levels = [];
        const queue = [{ node: 0, start: 0, end: this.n - 1, level: 0 }];

        while (queue.length > 0) {
            const { node, start, end, level } = queue.shift();

            if (start > end || node >= this.tree.length) continue;

            if (!levels[level]) levels[level] = [];
            levels[level].push({
                node,
                range: [start, end],
                value: this.tree[node]
            });

            if (start < end) {
                const mid = Math.floor((start + end) / 2);
                queue.push({ node: 2 * node + 1, start, end: mid, level: level + 1 });
                queue.push({ node: 2 * node + 2, start: mid + 1, end, level: level + 1 });
            }
        }

        return levels;
    }

    /**
     * Gets the height of the tree
     * @returns {number} - Tree height
     */
    getHeight() {
        if (this.n === 0) return 0;
        return Math.ceil(Math.log2(this.n)) + 1;
    }

    /**
     * Gets the original array
     * @returns {number[]} - Original array
     */
    getArray() {
        return [...this.originalArray];
    }

    /**
     * Sets the operation type and rebuilds
     * @param {string} operation - New operation type
     */
    setOperation(operation) {
        this.operation = operation;
        this.tree = new Array(4 * Math.max(this.n, 1)).fill(this._getIdentity());
        this.lazy = new Array(4 * Math.max(this.n, 1)).fill(0);

        if (this.n > 0) {
            this._build(this.originalArray, 0, 0, this.n - 1);
        }

        this.logOperation('info', `Changed operation to ${operation}`);
    }

    /**
     * Rebuilds with a new array
     * @param {number[]} arr - New input array
     */
    rebuild(arr) {
        this.n = arr.length;
        this.originalArray = [...arr];
        this.tree = new Array(4 * Math.max(this.n, 1)).fill(this._getIdentity());
        this.lazy = new Array(4 * Math.max(this.n, 1)).fill(0);

        if (arr.length > 0) {
            this._build(arr, 0, 0, this.n - 1);
        }

        this.logOperation('info', `Rebuilt tree with ${arr.length} elements`);
    }

    /**
     * Clears the tree
     */
    clear() {
        this.n = 0;
        this.originalArray = [];
        this.tree = [];
        this.lazy = [];
        this.querySteps = [];
        this.logOperation('info', 'Segment tree cleared');
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
     * Gets statistics
     * @returns {Object} - Statistics object
     */
    getStats() {
        return {
            nodeCount: this.n > 0 ? Math.pow(2, this.getHeight()) - 1 : 0,
            arraySize: this.n,
            height: this.getHeight(),
            operation: this.operation,
            isBalanced: true // Segment trees are always complete binary trees
        };
    }

    /**
     * Complexity analysis for Segment Tree
     * @returns {Object} - Complexity information
     */
    static getComplexity() {
        return {
            insert: 'O(log n)',
            delete: 'O(log n)',
            search: 'O(log n)',
            space: 'O(n)',
            description: 'Segment Tree provides O(log n) range queries and updates. Perfect for problems requiring frequent range operations on static structures.'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SegmentTree };
}
