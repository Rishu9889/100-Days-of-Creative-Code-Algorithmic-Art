/**
 * ========================================
 * Main Application Controller
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * Controls the UI and coordinates all data structures and visualizations.
 */

class App {
    constructor() {
        // Initialize data structures
        this.avlTree = new AVLTree();
        this.rbTree = new RedBlackTree();
        this.trie = new Trie();
        this.segmentTree = null;

        // Initialize visualizers
        this.visualizer = null;
        this.asciiRenderer = new ASCIIRenderer();

        // Current state
        this.currentTab = 'avl';
        this.animationSpeed = 500;

        // DOM elements
        this.elements = {};

        // Initialize when DOM is ready
        this.init();
    }

    /**
     * Initializes the application
     */
    init() {
        // Cache DOM elements
        this.cacheElements();

        // Initialize canvas visualizer
        this.visualizer = new TreeVisualizer('treeCanvas');

        // Set up event listeners
        this.setupEventListeners();

        // Initial render
        this.render();

        // Handle window resize
        window.addEventListener('resize', () => {
            this.visualizer.resize();
            this.render();
        });

        // Log initialization
        this.log('info', 'Application initialized. Select a data structure and start exploring!');
    }

    /**
     * Caches DOM elements for performance
     */
    cacheElements() {
        this.elements = {
            tabButtons: document.querySelectorAll('.tab-btn'),
            valueInput: document.getElementById('valueInput'),
            insertBtn: document.getElementById('insertBtn'),
            deleteBtn: document.getElementById('deleteBtn'),
            searchBtn: document.getElementById('searchBtn'),
            clearBtn: document.getElementById('clearBtn'),
            randomBtn: document.getElementById('randomBtn'),
            speedSlider: document.getElementById('speedSlider'),
            speedValue: document.getElementById('speedValue'),
            asciiOutput: document.getElementById('asciiOutput'),
            operationsLog: document.getElementById('operationsLog'),
            rotationSteps: document.getElementById('rotationSteps'),
            testResults: document.getElementById('testResults'),
            runTestsBtn: document.getElementById('runTestsBtn'),
            nodeCount: document.getElementById('nodeCount'),
            treeHeight: document.getElementById('treeHeight'),
            rotationCount: document.getElementById('rotationCount'),
            balanceStatus: document.getElementById('balanceStatus'),
            insertComplexity: document.getElementById('insertComplexity'),
            deleteComplexity: document.getElementById('deleteComplexity'),
            searchComplexity: document.getElementById('searchComplexity'),
            spaceComplexity: document.getElementById('spaceComplexity')
        };
    }

    /**
     * Sets up event listeners
     */
    setupEventListeners() {
        // Tab switching
        this.elements.tabButtons.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });

        // Action buttons
        this.elements.insertBtn.addEventListener('click', () => this.handleInsert());
        this.elements.deleteBtn.addEventListener('click', () => this.handleDelete());
        this.elements.searchBtn.addEventListener('click', () => this.handleSearch());
        this.elements.clearBtn.addEventListener('click', () => this.handleClear());
        this.elements.randomBtn.addEventListener('click', () => this.handleRandom());

        // Speed slider
        this.elements.speedSlider.addEventListener('input', (e) => {
            this.animationSpeed = parseInt(e.target.value);
            this.elements.speedValue.textContent = `${this.animationSpeed}ms`;
        });

        // Test button
        this.elements.runTestsBtn.addEventListener('click', () => this.runTests());

        // Enter key for input
        this.elements.valueInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleInsert();
            }
        });
    }

    /**
     * Switches between tabs
     * @param {string} tab - Tab identifier
     */
    switchTab(tab) {
        this.currentTab = tab;

        // Update active tab styling
        this.elements.tabButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });

        // Update input placeholder
        switch (tab) {
            case 'avl':
            case 'rbtree':
                this.elements.valueInput.placeholder = 'Enter number...';
                break;
            case 'trie':
                this.elements.valueInput.placeholder = 'Enter word...';
                break;
            case 'segment':
                this.elements.valueInput.placeholder = 'Enter array (comma-separated)...';
                break;
        }

        // Update complexity display
        this.updateComplexity();

        // Render current structure
        this.render();
    }

    /**
     * Handles insert operation
     */
    handleInsert() {
        const value = this.elements.valueInput.value.trim();
        if (!value) {
            this.log('error', 'Please enter a value');
            return;
        }

        switch (this.currentTab) {
            case 'avl':
                this.insertAVL(value);
                break;
            case 'rbtree':
                this.insertRBTree(value);
                break;
            case 'trie':
                this.insertTrie(value);
                break;
            case 'segment':
                this.buildSegmentTree(value);
                break;
        }

        this.elements.valueInput.value = '';
        this.render();
    }

    /**
     * Inserts into AVL tree
     */
    insertAVL(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            this.log('error', 'Please enter a valid number');
            return;
        }

        const success = this.avlTree.insert(num);
        if (success) {
            this.log('insert', `Inserted ${num} into AVL Tree`);
            this.showRotationSteps(this.avlTree.rotationSteps);
        } else {
            this.log('error', `Value ${num} already exists`);
        }
    }

    /**
     * Inserts into Red-Black tree
     */
    insertRBTree(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            this.log('error', 'Please enter a valid number');
            return;
        }

        const success = this.rbTree.insert(num);
        if (success) {
            this.log('insert', `Inserted ${num} into Red-Black Tree`);
            this.showRotationSteps(this.rbTree.rotationSteps);
        } else {
            this.log('error', `Value ${num} already exists`);
        }
    }

    /**
     * Inserts into Trie
     */
    insertTrie(value) {
        const success = this.trie.insert(value);
        if (success) {
            this.log('insert', `Inserted "${value}" into Trie`);
        } else {
            this.log('error', 'Invalid word');
        }
    }

    /**
     * Builds Segment Tree from array
     */
    buildSegmentTree(value) {
        try {
            const arr = value.split(',').map(v => {
                const num = parseInt(v.trim());
                if (isNaN(num)) throw new Error('Invalid number');
                return num;
            });

            this.segmentTree = new SegmentTree(arr, 'sum');
            this.log('insert', `Built Segment Tree with array: [${arr.join(', ')}]`);
        } catch (e) {
            this.log('error', 'Please enter comma-separated numbers');
        }
    }

    /**
     * Handles delete operation
     */
    handleDelete() {
        const value = this.elements.valueInput.value.trim();
        if (!value) {
            this.log('error', 'Please enter a value to delete');
            return;
        }

        switch (this.currentTab) {
            case 'avl':
                this.deleteAVL(value);
                break;
            case 'rbtree':
                this.deleteRBTree(value);
                break;
            case 'trie':
                this.deleteTrie(value);
                break;
            case 'segment':
                this.updateSegmentTree(value);
                break;
        }

        this.elements.valueInput.value = '';
        this.render();
    }

    /**
     * Deletes from AVL tree
     */
    deleteAVL(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            this.log('error', 'Please enter a valid number');
            return;
        }

        const success = this.avlTree.delete(num);
        if (success) {
            this.log('delete', `Deleted ${num} from AVL Tree`);
            this.showRotationSteps(this.avlTree.rotationSteps);
        } else {
            this.log('error', `Value ${num} not found`);
        }
    }

    /**
     * Deletes from Red-Black tree
     */
    deleteRBTree(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            this.log('error', 'Please enter a valid number');
            return;
        }

        const success = this.rbTree.delete(num);
        if (success) {
            this.log('delete', `Deleted ${num} from Red-Black Tree`);
            this.showRotationSteps(this.rbTree.rotationSteps);
        } else {
            this.log('error', `Value ${num} not found`);
        }
    }

    /**
     * Deletes from Trie
     */
    deleteTrie(value) {
        const success = this.trie.delete(value);
        if (success) {
            this.log('delete', `Deleted "${value}" from Trie`);
        } else {
            this.log('error', `Word "${value}" not found`);
        }
    }

    /**
     * Updates Segment Tree (point update)
     */
    updateSegmentTree(value) {
        if (!this.segmentTree) {
            this.log('error', 'Build a segment tree first');
            return;
        }

        const parts = value.split(',');
        if (parts.length !== 2) {
            this.log('error', 'Format: index,value');
            return;
        }

        const index = parseInt(parts[0].trim());
        const newValue = parseInt(parts[1].trim());

        if (isNaN(index) || isNaN(newValue)) {
            this.log('error', 'Please enter valid numbers');
            return;
        }

        const success = this.segmentTree.update(index, newValue);
        if (success) {
            this.log('update', `Updated index ${index} to ${newValue}`);
        } else {
            this.log('error', 'Update failed');
        }
    }

    /**
     * Handles search operation
     */
    handleSearch() {
        const value = this.elements.valueInput.value.trim();
        if (!value) {
            this.log('error', 'Please enter a value to search');
            return;
        }

        switch (this.currentTab) {
            case 'avl':
                this.searchAVL(value);
                break;
            case 'rbtree':
                this.searchRBTree(value);
                break;
            case 'trie':
                this.searchTrie(value);
                break;
            case 'segment':
                this.querySegmentTree(value);
                break;
        }

        this.render();
    }

    /**
     * Searches AVL tree
     */
    searchAVL(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            this.log('error', 'Please enter a valid number');
            return;
        }

        const result = this.avlTree.search(num);
        if (result.found) {
            this.log('search', `Found ${num}! Path: ${result.path.join(' → ')}`);
            this.visualizer.setSearchPath(result.path);
        } else {
            this.log('search', `Value ${num} not found. Path searched: ${result.path.join(' → ')}`);
            this.visualizer.setSearchPath(result.path);
        }
    }

    /**
     * Searches Red-Black tree
     */
    searchRBTree(value) {
        const num = parseInt(value);
        if (isNaN(num)) {
            this.log('error', 'Please enter a valid number');
            return;
        }

        const result = this.rbTree.search(num);
        if (result.found) {
            this.log('search', `Found ${num}! Path: ${result.path.map(n => `${n.value}(${n.color})`).join(' → ')}`);
        } else {
            this.log('search', `Value ${num} not found`);
        }
    }

    /**
     * Searches Trie
     */
    searchTrie(value) {
        const result = this.trie.search(value);
        if (result.exactMatch) {
            this.log('search', `Found exact match: "${value}"`);
        } else if (result.found) {
            this.log('search', `"${value}" is a prefix but not a complete word`);
            const suggestions = this.trie.autocomplete(value, 5);
            if (suggestions.length > 0) {
                this.log('info', `Suggestions: ${suggestions.join(', ')}`);
            }
        } else {
            this.log('search', `"${value}" not found`);
        }
    }

    /**
     * Queries Segment Tree
     */
    querySegmentTree(value) {
        if (!this.segmentTree) {
            this.log('error', 'Build a segment tree first');
            return;
        }

        const parts = value.split(',');
        if (parts.length !== 2) {
            this.log('error', 'Format: left,right (range query)');
            return;
        }

        const left = parseInt(parts[0].trim());
        const right = parseInt(parts[1].trim());

        if (isNaN(left) || isNaN(right)) {
            this.log('error', 'Please enter valid numbers');
            return;
        }

        const result = this.segmentTree.query(left, right);
        if (result.valid) {
            this.log('search', `Query [${left}, ${right}] = ${result.value}`);
            this.showQuerySteps(this.segmentTree.querySteps);
        } else {
            this.log('error', 'Invalid range');
        }
    }

    /**
     * Handles clear operation
     */
    handleClear() {
        switch (this.currentTab) {
            case 'avl':
                this.avlTree.clear();
                break;
            case 'rbtree':
                this.rbTree.clear();
                break;
            case 'trie':
                this.trie.clear();
                break;
            case 'segment':
                this.segmentTree = null;
                break;
        }

        this.log('info', 'Cleared!');
        this.visualizer.clearHighlights();
        this.render();
    }

    /**
     * Handles random insertion
     */
    handleRandom() {
        switch (this.currentTab) {
            case 'avl':
                this.randomAVL();
                break;
            case 'rbtree':
                this.randomRBTree();
                break;
            case 'trie':
                this.randomTrie();
                break;
            case 'segment':
                this.randomSegmentTree();
                break;
        }

        this.render();
    }

    /**
     * Random AVL insertions
     */
    randomAVL() {
        const count = 5;
        for (let i = 0; i < count; i++) {
            const num = Math.floor(Math.random() * 100);
            this.avlTree.insert(num);
        }
        this.log('insert', `Inserted ${count} random values`);
        this.showRotationSteps(this.avlTree.rotationSteps);
    }

    /**
     * Random RB Tree insertions
     */
    randomRBTree() {
        const count = 5;
        for (let i = 0; i < count; i++) {
            const num = Math.floor(Math.random() * 100);
            this.rbTree.insert(num);
        }
        this.log('insert', `Inserted ${count} random values`);
        this.showRotationSteps(this.rbTree.rotationSteps);
    }

    /**
     * Random Trie insertions
     */
    randomTrie() {
        const words = ['algorithm', 'data', 'structure', 'tree', 'binary', 'search',
            'avl', 'red', 'black', 'trie', 'segment', 'balance'];
        const count = 3;
        for (let i = 0; i < count; i++) {
            const word = words[Math.floor(Math.random() * words.length)];
            this.trie.insert(word);
        }
        this.log('insert', `Inserted ${count} random words`);
    }

    /**
     * Random Segment Tree
     */
    randomSegmentTree() {
        const size = 8;
        const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 50));
        this.segmentTree = new SegmentTree(arr, 'sum');
        this.log('insert', `Built Segment Tree with random array: [${arr.join(', ')}]`);
    }

    /**
     * Renders the current visualization
     */
    render() {
        // Render canvas visualization
        switch (this.currentTab) {
            case 'avl':
                this.visualizer.renderAVL(this.avlTree);
                this.elements.asciiOutput.textContent = this.asciiRenderer.renderAVL(this.avlTree);
                break;
            case 'rbtree':
                this.visualizer.renderRBTree(this.rbTree);
                this.elements.asciiOutput.textContent = this.asciiRenderer.renderRBTree(this.rbTree);
                break;
            case 'trie':
                this.visualizer.renderTrie(this.trie);
                this.elements.asciiOutput.textContent = this.asciiRenderer.renderTrie(this.trie);
                break;
            case 'segment':
                if (this.segmentTree) {
                    this.visualizer.renderSegmentTree(this.segmentTree);
                    this.elements.asciiOutput.textContent = this.asciiRenderer.renderSegmentTree(this.segmentTree);
                } else {
                    this.visualizer.clear();
                    this.visualizer.drawEmptyMessage('Enter comma-separated numbers to build tree');
                    this.elements.asciiOutput.textContent = this.asciiRenderer.renderEmpty('Segment Tree');
                }
                break;
        }

        // Update statistics
        this.updateStats();
    }

    /**
     * Updates the statistics panel
     */
    updateStats() {
        let stats;

        switch (this.currentTab) {
            case 'avl':
                stats = this.avlTree.getStats();
                this.elements.nodeCount.textContent = stats.nodeCount;
                this.elements.treeHeight.textContent = stats.height;
                this.elements.rotationCount.textContent = stats.rotationCount;
                this.elements.balanceStatus.textContent = stats.isBalanced ? '✅ Balanced' : '⚠️ Unbalanced';
                break;
            case 'rbtree':
                stats = this.rbTree.getStats();
                this.elements.nodeCount.textContent = stats.nodeCount;
                this.elements.treeHeight.textContent = stats.height;
                this.elements.rotationCount.textContent = stats.rotationCount;
                this.elements.balanceStatus.textContent = stats.isBalanced ? '✅ Valid' : '⚠️ Invalid';
                break;
            case 'trie':
                stats = this.trie.getStats();
                this.elements.nodeCount.textContent = stats.nodeCount;
                this.elements.treeHeight.textContent = stats.height;
                this.elements.rotationCount.textContent = stats.wordCount;
                this.elements.balanceStatus.textContent = '✅ Valid';
                break;
            case 'segment':
                if (this.segmentTree) {
                    stats = this.segmentTree.getStats();
                    this.elements.nodeCount.textContent = stats.arraySize;
                    this.elements.treeHeight.textContent = stats.height;
                    this.elements.rotationCount.textContent = stats.operation;
                    this.elements.balanceStatus.textContent = '✅ Complete';
                } else {
                    this.elements.nodeCount.textContent = '0';
                    this.elements.treeHeight.textContent = '0';
                    this.elements.rotationCount.textContent = '-';
                    this.elements.balanceStatus.textContent = '-';
                }
                break;
        }
    }

    /**
     * Updates complexity display
     */
    updateComplexity() {
        let complexity;

        switch (this.currentTab) {
            case 'avl':
                complexity = AVLTree.getComplexity();
                break;
            case 'rbtree':
                complexity = RedBlackTree.getComplexity();
                break;
            case 'trie':
                complexity = Trie.getComplexity();
                break;
            case 'segment':
                complexity = SegmentTree.getComplexity();
                break;
        }

        this.elements.insertComplexity.textContent = complexity.insert;
        this.elements.deleteComplexity.textContent = complexity.delete;
        this.elements.searchComplexity.textContent = complexity.search;
        this.elements.spaceComplexity.textContent = complexity.space;
    }

    /**
     * Shows rotation steps in the UI
     * @param {Array} steps - Rotation steps
     */
    showRotationSteps(steps) {
        if (!steps || steps.length === 0) {
            this.elements.rotationSteps.innerHTML = '<p class="placeholder-text">No rotations needed for this operation.</p>';
            return;
        }

        let html = '';
        steps.forEach((step, index) => {
            html += `
                <div class="rotation-step">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <div class="step-title">${step.type}</div>
                        <div class="step-description">${step.description}</div>
                    </div>
                </div>
            `;
        });

        this.elements.rotationSteps.innerHTML = html;
    }

    /**
     * Shows query steps in the UI
     * @param {Array} steps - Query steps
     */
    showQuerySteps(steps) {
        if (!steps || steps.length === 0) {
            this.elements.rotationSteps.innerHTML = '<p class="placeholder-text">No query steps to show.</p>';
            return;
        }

        let html = '';
        steps.forEach((step, index) => {
            html += `
                <div class="rotation-step">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-content">
                        <div class="step-title">${step.type}</div>
                        <div class="step-description">${step.description}</div>
                    </div>
                </div>
            `;
        });

        this.elements.rotationSteps.innerHTML = html;
    }

    /**
     * Logs an operation to the UI
     * @param {string} type - Log type
     * @param {string} message - Log message
     */
    log(type, message) {
        const time = new Date().toLocaleTimeString();
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = `
            <span class="log-time">${time}</span>
            <span>${message}</span>
        `;

        this.elements.operationsLog.insertBefore(entry, this.elements.operationsLog.firstChild);

        // Keep only last 20 entries
        while (this.elements.operationsLog.children.length > 20) {
            this.elements.operationsLog.removeChild(this.elements.operationsLog.lastChild);
        }
    }

    /**
     * Runs the test suite
     */
    runTests() {
        const testSuite = new TestSuite();
        const results = testSuite.runAllTests();
        this.elements.testResults.innerHTML = testSuite.getHTMLResults();
        this.log('info', `Tests completed: ${results.passed}/${results.total} passed in ${results.totalTime}ms`);
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new App();
});
