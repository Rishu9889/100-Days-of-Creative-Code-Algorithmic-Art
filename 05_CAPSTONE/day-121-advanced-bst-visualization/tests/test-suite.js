/**
 * ========================================
 * Test Suite for Advanced BST Operations
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * Comprehensive unit tests and performance benchmarks
 * for all data structures implemented.
 */

class TestSuite {
    constructor() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.totalTime = 0;
    }

    /**
     * Runs all tests
     * @returns {Object} - Test results
     */
    runAllTests() {
        this.results = [];
        this.passed = 0;
        this.failed = 0;
        this.totalTime = 0;

        const startTime = performance.now();

        // AVL Tree Tests
        this.runAVLTests();

        // Red-Black Tree Tests
        this.runRBTreeTests();

        // Trie Tests
        this.runTrieTests();

        // Segment Tree Tests
        this.runSegmentTreeTests();

        // Performance Benchmarks
        this.runBenchmarks();

        this.totalTime = performance.now() - startTime;

        return {
            results: this.results,
            passed: this.passed,
            failed: this.failed,
            total: this.passed + this.failed,
            totalTime: this.totalTime.toFixed(2)
        };
    }

    /**
     * Adds a test result
     * @param {string} category - Test category
     * @param {string} name - Test name
     * @param {boolean} passed - Whether the test passed
     * @param {string} message - Optional message
     */
    addResult(category, name, passed, message = '') {
        if (passed) {
            this.passed++;
        } else {
            this.failed++;
        }

        this.results.push({
            category,
            name,
            passed,
            message
        });
    }

    /**
     * Asserts a condition
     * @param {boolean} condition - Condition to check
     * @param {string} category - Test category
     * @param {string} name - Test name
     * @param {string} message - Failure message
     */
    assert(condition, category, name, message = '') {
        this.addResult(category, name, condition, condition ? '' : message);
    }

    /**
     * AVL Tree Tests
     */
    runAVLTests() {
        const category = 'AVL Tree';

        // Test 1: Basic insertion
        try {
            const avl = new AVLTree();
            avl.insert(10);
            avl.insert(20);
            avl.insert(5);
            this.assert(
                avl.nodeCount === 3,
                category,
                'Basic Insertion',
                `Expected 3 nodes, got ${avl.nodeCount}`
            );
        } catch (e) {
            this.addResult(category, 'Basic Insertion', false, e.message);
        }

        // Test 2: Left Rotation (Right-Right case)
        try {
            const avl = new AVLTree();
            avl.insert(10);
            avl.insert(20);
            avl.insert(30); // Should trigger left rotation
            this.assert(
                avl.root.value === 20 && avl.isBalanced(),
                category,
                'Left Rotation (RR case)',
                `Root should be 20, got ${avl.root.value}`
            );
        } catch (e) {
            this.addResult(category, 'Left Rotation (RR case)', false, e.message);
        }

        // Test 3: Right Rotation (Left-Left case)
        try {
            const avl = new AVLTree();
            avl.insert(30);
            avl.insert(20);
            avl.insert(10); // Should trigger right rotation
            this.assert(
                avl.root.value === 20 && avl.isBalanced(),
                category,
                'Right Rotation (LL case)',
                `Root should be 20, got ${avl.root.value}`
            );
        } catch (e) {
            this.addResult(category, 'Right Rotation (LL case)', false, e.message);
        }

        // Test 4: Left-Right Rotation
        try {
            const avl = new AVLTree();
            avl.insert(30);
            avl.insert(10);
            avl.insert(20); // Should trigger LR rotation
            this.assert(
                avl.root.value === 20 && avl.isBalanced(),
                category,
                'Left-Right Rotation (LR case)',
                `Root should be 20, got ${avl.root.value}`
            );
        } catch (e) {
            this.addResult(category, 'Left-Right Rotation (LR case)', false, e.message);
        }

        // Test 5: Right-Left Rotation
        try {
            const avl = new AVLTree();
            avl.insert(10);
            avl.insert(30);
            avl.insert(20); // Should trigger RL rotation
            this.assert(
                avl.root.value === 20 && avl.isBalanced(),
                category,
                'Right-Left Rotation (RL case)',
                `Root should be 20, got ${avl.root.value}`
            );
        } catch (e) {
            this.addResult(category, 'Right-Left Rotation (RL case)', false, e.message);
        }

        // Test 6: Search
        try {
            const avl = new AVLTree();
            [50, 25, 75, 10, 30].forEach(v => avl.insert(v));
            const found = avl.search(30);
            const notFound = avl.search(100);
            this.assert(
                found.found && !notFound.found,
                category,
                'Search Operation',
                `Search failed: found=${found.found}, notFound=${notFound.found}`
            );
        } catch (e) {
            this.addResult(category, 'Search Operation', false, e.message);
        }

        // Test 7: Deletion
        try {
            const avl = new AVLTree();
            [50, 25, 75, 10, 30].forEach(v => avl.insert(v));
            avl.delete(25);
            this.assert(
                avl.nodeCount === 4 && avl.isBalanced() && !avl.search(25).found,
                category,
                'Deletion Operation',
                'Deletion failed'
            );
        } catch (e) {
            this.addResult(category, 'Deletion Operation', false, e.message);
        }

        // Test 8: Inorder Traversal
        try {
            const avl = new AVLTree();
            [5, 3, 7, 1, 9].forEach(v => avl.insert(v));
            const inorder = avl.inorderTraversal();
            const expected = [1, 3, 5, 7, 9];
            this.assert(
                JSON.stringify(inorder) === JSON.stringify(expected),
                category,
                'Inorder Traversal',
                `Expected ${expected}, got ${inorder}`
            );
        } catch (e) {
            this.addResult(category, 'Inorder Traversal', false, e.message);
        }

        // Test 9: Balance maintained after multiple operations
        try {
            const avl = new AVLTree();
            for (let i = 1; i <= 20; i++) {
                avl.insert(i);
            }
            this.assert(
                avl.isBalanced() && avl.getTreeHeight() <= 6,
                category,
                'Balance After Sequential Insert',
                `Tree not balanced or height too large: ${avl.getTreeHeight()}`
            );
        } catch (e) {
            this.addResult(category, 'Balance After Sequential Insert', false, e.message);
        }

        // Test 10: Duplicate handling
        try {
            const avl = new AVLTree();
            avl.insert(10);
            const result = avl.insert(10);
            this.assert(
                !result && avl.nodeCount === 1,
                category,
                'Duplicate Handling',
                'Duplicates should be rejected'
            );
        } catch (e) {
            this.addResult(category, 'Duplicate Handling', false, e.message);
        }
    }

    /**
     * Red-Black Tree Tests
     */
    runRBTreeTests() {
        const category = 'Red-Black Tree';

        // Test 1: Basic insertion
        try {
            const rb = new RedBlackTree();
            rb.insert(10);
            rb.insert(20);
            rb.insert(5);
            this.assert(
                rb.nodeCount === 3,
                category,
                'Basic Insertion',
                `Expected 3 nodes, got ${rb.nodeCount}`
            );
        } catch (e) {
            this.addResult(category, 'Basic Insertion', false, e.message);
        }

        // Test 2: Root is always black
        try {
            const rb = new RedBlackTree();
            rb.insert(10);
            rb.insert(20);
            rb.insert(5);
            this.assert(
                rb.root.color === 'BLACK',
                category,
                'Root is Black',
                `Root color: ${rb.root.color}`
            );
        } catch (e) {
            this.addResult(category, 'Root is Black', false, e.message);
        }

        // Test 3: Red node has black children
        try {
            const rb = new RedBlackTree();
            [10, 20, 30, 15, 25].forEach(v => rb.insert(v));
            const verification = rb.verify();
            this.assert(
                verification.valid,
                category,
                'Red Nodes Have Black Children',
                verification.violations.join(', ')
            );
        } catch (e) {
            this.addResult(category, 'Red Nodes Have Black Children', false, e.message);
        }

        // Test 4: Black height consistency
        try {
            const rb = new RedBlackTree();
            for (let i = 1; i <= 15; i++) {
                rb.insert(i);
            }
            const verification = rb.verify();
            this.assert(
                verification.valid,
                category,
                'Black Height Consistency',
                verification.violations.join(', ')
            );
        } catch (e) {
            this.addResult(category, 'Black Height Consistency', false, e.message);
        }

        // Test 5: Search operation
        try {
            const rb = new RedBlackTree();
            [50, 25, 75, 10, 30].forEach(v => rb.insert(v));
            const found = rb.search(30);
            const notFound = rb.search(100);
            this.assert(
                found.found && !notFound.found,
                category,
                'Search Operation',
                `Search failed`
            );
        } catch (e) {
            this.addResult(category, 'Search Operation', false, e.message);
        }

        // Test 6: Deletion
        try {
            const rb = new RedBlackTree();
            [50, 25, 75, 10, 30].forEach(v => rb.insert(v));
            rb.delete(25);
            const verification = rb.verify();
            this.assert(
                rb.nodeCount === 4 && verification.valid,
                category,
                'Deletion with Rebalancing',
                verification.violations.join(', ')
            );
        } catch (e) {
            this.addResult(category, 'Deletion with Rebalancing', false, e.message);
        }

        // Test 7: Properties maintained after many operations
        try {
            const rb = new RedBlackTree();
            for (let i = 1; i <= 100; i++) {
                rb.insert(i);
            }
            for (let i = 1; i <= 50; i += 2) {
                rb.delete(i);
            }
            const verification = rb.verify();
            this.assert(
                verification.valid,
                category,
                'Properties After Many Operations',
                verification.violations.join(', ')
            );
        } catch (e) {
            this.addResult(category, 'Properties After Many Operations', false, e.message);
        }
    }

    /**
     * Trie Tests
     */
    runTrieTests() {
        const category = 'Trie';

        // Test 1: Basic insertion
        try {
            const trie = new Trie();
            trie.insert('hello');
            trie.insert('world');
            this.assert(
                trie.wordCount === 2,
                category,
                'Basic Insertion',
                `Expected 2 words, got ${trie.wordCount}`
            );
        } catch (e) {
            this.addResult(category, 'Basic Insertion', false, e.message);
        }

        // Test 2: Search exact match
        try {
            const trie = new Trie();
            trie.insert('hello');
            trie.insert('help');
            const result = trie.search('hello');
            this.assert(
                result.found && result.exactMatch,
                category,
                'Search Exact Match',
                `Search result: ${JSON.stringify(result)}`
            );
        } catch (e) {
            this.addResult(category, 'Search Exact Match', false, e.message);
        }

        // Test 3: Prefix check
        try {
            const trie = new Trie();
            trie.insert('hello');
            trie.insert('help');
            this.assert(
                trie.startsWith('hel') && !trie.startsWith('hx'),
                category,
                'Prefix Check',
                'Prefix check failed'
            );
        } catch (e) {
            this.addResult(category, 'Prefix Check', false, e.message);
        }

        // Test 4: Get words with prefix
        try {
            const trie = new Trie();
            ['hello', 'help', 'helper', 'heap', 'world'].forEach(w => trie.insert(w));
            const words = trie.getWordsWithPrefix('hel');
            this.assert(
                words.length === 3 && words.includes('hello') && words.includes('help') && words.includes('helper'),
                category,
                'Get Words With Prefix',
                `Expected 3 words, got: ${words}`
            );
        } catch (e) {
            this.addResult(category, 'Get Words With Prefix', false, e.message);
        }

        // Test 5: Delete word
        try {
            const trie = new Trie();
            trie.insert('hello');
            trie.insert('help');
            trie.delete('hello');
            this.assert(
                trie.wordCount === 1 && !trie.search('hello').exactMatch && trie.search('help').exactMatch,
                category,
                'Delete Word',
                'Delete operation failed'
            );
        } catch (e) {
            this.addResult(category, 'Delete Word', false, e.message);
        }

        // Test 6: Autocomplete
        try {
            const trie = new Trie();
            ['apple', 'application', 'apply', 'banana'].forEach(w => trie.insert(w));
            const suggestions = trie.autocomplete('app', 2);
            this.assert(
                suggestions.length === 2 && suggestions.every(s => s.startsWith('app')),
                category,
                'Autocomplete',
                `Got suggestions: ${suggestions}`
            );
        } catch (e) {
            this.addResult(category, 'Autocomplete', false, e.message);
        }

        // Test 7: Case insensitivity
        try {
            const trie = new Trie();
            trie.insert('Hello');
            this.assert(
                trie.search('hello').exactMatch && trie.search('HELLO').exactMatch,
                category,
                'Case Insensitivity',
                'Case sensitivity issue'
            );
        } catch (e) {
            this.addResult(category, 'Case Insensitivity', false, e.message);
        }

        // Test 8: Longest common prefix
        try {
            const trie = new Trie();
            ['flower', 'flow', 'flight'].forEach(w => trie.insert(w));
            const lcp = trie.longestCommonPrefix();
            this.assert(
                lcp === 'fl',
                category,
                'Longest Common Prefix',
                `Expected 'fl', got '${lcp}'`
            );
        } catch (e) {
            this.addResult(category, 'Longest Common Prefix', false, e.message);
        }
    }

    /**
     * Segment Tree Tests
     */
    runSegmentTreeTests() {
        const category = 'Segment Tree';

        // Test 1: Sum query
        try {
            const arr = [1, 3, 5, 7, 9, 11];
            const st = new SegmentTree(arr, 'sum');
            const result = st.query(1, 3);
            this.assert(
                result.value === 15, // 3 + 5 + 7
                category,
                'Sum Query',
                `Expected 15, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Sum Query', false, e.message);
        }

        // Test 2: Min query
        try {
            const arr = [5, 2, 8, 1, 9, 3];
            const st = new SegmentTree(arr, 'min');
            const result = st.query(0, 5);
            this.assert(
                result.value === 1,
                category,
                'Min Query',
                `Expected 1, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Min Query', false, e.message);
        }

        // Test 3: Max query
        try {
            const arr = [5, 2, 8, 1, 9, 3];
            const st = new SegmentTree(arr, 'max');
            const result = st.query(2, 4);
            this.assert(
                result.value === 9,
                category,
                'Max Query',
                `Expected 9, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Max Query', false, e.message);
        }

        // Test 4: Point update
        try {
            const arr = [1, 2, 3, 4, 5];
            const st = new SegmentTree(arr, 'sum');
            st.update(2, 10);
            const result = st.query(0, 4);
            this.assert(
                result.value === 22, // 1 + 2 + 10 + 4 + 5
                category,
                'Point Update',
                `Expected 22, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Point Update', false, e.message);
        }

        // Test 5: GCD query
        try {
            const arr = [12, 18, 24, 6];
            const st = new SegmentTree(arr, 'gcd');
            const result = st.query(0, 3);
            this.assert(
                result.value === 6,
                category,
                'GCD Query',
                `Expected 6, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'GCD Query', false, e.message);
        }

        // Test 6: Single element query
        try {
            const arr = [1, 2, 3, 4, 5];
            const st = new SegmentTree(arr, 'sum');
            const result = st.query(2, 2);
            this.assert(
                result.value === 3,
                category,
                'Single Element Query',
                `Expected 3, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Single Element Query', false, e.message);
        }

        // Test 7: Full range query
        try {
            const arr = [1, 2, 3, 4, 5];
            const st = new SegmentTree(arr, 'sum');
            const result = st.query(0, 4);
            this.assert(
                result.value === 15,
                category,
                'Full Range Query',
                `Expected 15, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Full Range Query', false, e.message);
        }

        // Test 8: Multiple updates
        try {
            const arr = [1, 1, 1, 1, 1];
            const st = new SegmentTree(arr, 'sum');
            st.update(0, 5);
            st.update(4, 5);
            const result = st.query(0, 4);
            this.assert(
                result.value === 13, // 5 + 1 + 1 + 1 + 5
                category,
                'Multiple Updates',
                `Expected 13, got ${result.value}`
            );
        } catch (e) {
            this.addResult(category, 'Multiple Updates', false, e.message);
        }
    }

    /**
     * Performance Benchmarks
     */
    runBenchmarks() {
        const category = 'Performance';
        const n = 1000;

        // AVL Tree benchmark
        try {
            const avl = new AVLTree();
            const start = performance.now();
            for (let i = 0; i < n; i++) {
                avl.insert(Math.floor(Math.random() * 10000));
            }
            const time = performance.now() - start;
            this.addResult(
                category,
                `AVL: ${n} insertions`,
                time < 1000,
                `Time: ${time.toFixed(2)}ms`
            );
        } catch (e) {
            this.addResult(category, `AVL: ${n} insertions`, false, e.message);
        }

        // Red-Black Tree benchmark
        try {
            const rb = new RedBlackTree();
            const start = performance.now();
            for (let i = 0; i < n; i++) {
                rb.insert(Math.floor(Math.random() * 10000));
            }
            const time = performance.now() - start;
            this.addResult(
                category,
                `RBTree: ${n} insertions`,
                time < 1000,
                `Time: ${time.toFixed(2)}ms`
            );
        } catch (e) {
            this.addResult(category, `RBTree: ${n} insertions`, false, e.message);
        }

        // Trie benchmark
        try {
            const trie = new Trie();
            const words = ['hello', 'world', 'test', 'tree', 'trie', 'algorithm'];
            const start = performance.now();
            for (let i = 0; i < n; i++) {
                trie.insert(words[i % words.length] + i);
            }
            const time = performance.now() - start;
            this.addResult(
                category,
                `Trie: ${n} insertions`,
                time < 1000,
                `Time: ${time.toFixed(2)}ms`
            );
        } catch (e) {
            this.addResult(category, `Trie: ${n} insertions`, false, e.message);
        }

        // Segment Tree benchmark
        try {
            const arr = Array.from({ length: n }, () => Math.floor(Math.random() * 100));
            const start = performance.now();
            const st = new SegmentTree(arr, 'sum');
            for (let i = 0; i < n; i++) {
                const l = Math.floor(Math.random() * n);
                const r = l + Math.floor(Math.random() * (n - l));
                st.query(l, r);
            }
            const time = performance.now() - start;
            this.addResult(
                category,
                `SegTree: ${n} queries`,
                time < 1000,
                `Time: ${time.toFixed(2)}ms`
            );
        } catch (e) {
            this.addResult(category, `SegTree: ${n} queries`, false, e.message);
        }
    }

    /**
     * Gets HTML representation of results
     * @returns {string} - HTML string
     */
    getHTMLResults() {
        let html = '';

        this.results.forEach(result => {
            const icon = result.passed ? '✅' : '❌';
            const className = result.passed ? 'pass' : 'fail';
            html += `<div class="test-result ${className}">
                <span class="test-icon">${icon}</span>
                <span class="test-name">[${result.category}] ${result.name}</span>
                ${result.message ? `<span class="test-message">${result.message}</span>` : ''}
            </div>`;
        });

        const summaryClass = this.failed === 0 ? 'all-pass' : 'has-fails';
        html += `<div class="test-summary ${summaryClass}">
            <span>Total: ${this.passed + this.failed}</span>
            <span>Passed: ${this.passed}</span>
            <span>Failed: ${this.failed}</span>
            <span>Time: ${this.totalTime}ms</span>
        </div>`;

        return html;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TestSuite };
}
