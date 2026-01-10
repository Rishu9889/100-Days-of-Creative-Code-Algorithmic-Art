/**
 * ========================================
 * Trie (Prefix Tree) Implementation
 * Day 121: Advanced BST Operations
 * ========================================
 * 
 * A Trie is an efficient information retrieval data structure.
 * Using Trie, search complexities can be brought to optimal limit (key length).
 * 
 * Properties:
 * - Every node of Trie consists of multiple branches
 * - Each branch represents a possible character of keys
 * - Mark the last node of every key as end of word node
 * 
 * Time Complexity:
 * - Insert: O(m) where m is the length of the key
 * - Search: O(m)
 * - Delete: O(m)
 * - Prefix Search: O(m + n) where n is number of words with prefix
 * 
 * Space Complexity: O(ALPHABET_SIZE * m * n) where n is number of keys
 */

class TrieNode {
    constructor() {
        this.children = {};      // Map of character -> TrieNode
        this.isEndOfWord = false;
        this.wordCount = 0;      // Number of times this word appears
        this.prefixCount = 0;    // Number of words with this prefix
        this.word = null;        // Store the complete word at end nodes
        this.x = 0;              // For visualization
        this.y = 0;              // For visualization
    }
}

class Trie {
    constructor() {
        this.root = new TrieNode();
        this.wordCount = 0;
        this.nodeCount = 1; // Root node
        this.operationLog = [];
    }

    /**
     * Inserts a word into the trie
     * @param {string} word - The word to insert
     * @returns {boolean} - True if inserted successfully
     */
    insert(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }

        word = word.toLowerCase().trim();
        if (word.length === 0) {
            return false;
        }

        let current = this.root;

        for (const char of word) {
            current.prefixCount++;

            if (!current.children[char]) {
                current.children[char] = new TrieNode();
                this.nodeCount++;
            }
            current = current.children[char];
        }

        current.prefixCount++;

        if (current.isEndOfWord) {
            current.wordCount++;
            this.logOperation('insert', `Word "${word}" already exists. Count: ${current.wordCount}`);
        } else {
            current.isEndOfWord = true;
            current.wordCount = 1;
            current.word = word;
            this.wordCount++;
            this.logOperation('insert', `Inserted word "${word}"`);
        }

        return true;
    }

    /**
     * Searches for a word in the trie
     * @param {string} word - The word to search
     * @returns {Object} - Search result with found status and path
     */
    search(word) {
        if (!word || typeof word !== 'string') {
            return { found: false, path: [], exactMatch: false };
        }

        word = word.toLowerCase().trim();
        const path = [];
        let current = this.root;

        for (const char of word) {
            path.push(char);

            if (!current.children[char]) {
                this.logOperation('search', `Word "${word}" not found. Failed at: ${path.join('')}`);
                return { found: false, path, exactMatch: false };
            }
            current = current.children[char];
        }

        if (current.isEndOfWord) {
            this.logOperation('search', `Found word "${word}". Count: ${current.wordCount}`);
            return {
                found: true,
                path,
                exactMatch: true,
                wordCount: current.wordCount
            };
        }

        this.logOperation('search', `"${word}" is a prefix but not a complete word`);
        return { found: true, path, exactMatch: false };
    }

    /**
     * Checks if there is any word in the trie that starts with the given prefix
     * @param {string} prefix - The prefix to search
     * @returns {boolean} - True if any word starts with prefix
     */
    startsWith(prefix) {
        if (!prefix || typeof prefix !== 'string') {
            return false;
        }

        prefix = prefix.toLowerCase().trim();
        let current = this.root;

        for (const char of prefix) {
            if (!current.children[char]) {
                return false;
            }
            current = current.children[char];
        }

        return true;
    }

    /**
     * Gets all words with the given prefix
     * @param {string} prefix - The prefix to search for
     * @returns {string[]} - Array of words with the prefix
     */
    getWordsWithPrefix(prefix) {
        if (!prefix || typeof prefix !== 'string') {
            return [];
        }

        prefix = prefix.toLowerCase().trim();
        let current = this.root;

        // Navigate to the end of prefix
        for (const char of prefix) {
            if (!current.children[char]) {
                return [];
            }
            current = current.children[char];
        }

        // Collect all words from this node
        const words = [];
        this._collectWords(current, prefix, words);

        this.logOperation('search', `Found ${words.length} words with prefix "${prefix}"`);
        return words;
    }

    /**
     * Helper method to collect all words from a node
     * @param {TrieNode} node - Current node
     * @param {string} prefix - Current prefix
     * @param {string[]} words - Array to collect words
     */
    _collectWords(node, prefix, words) {
        if (node.isEndOfWord) {
            words.push(prefix);
        }

        for (const char in node.children) {
            this._collectWords(node.children[char], prefix + char, words);
        }
    }

    /**
     * Deletes a word from the trie
     * @param {string} word - The word to delete
     * @returns {boolean} - True if deleted successfully
     */
    delete(word) {
        if (!word || typeof word !== 'string') {
            return false;
        }

        word = word.toLowerCase().trim();

        if (!this.search(word).exactMatch) {
            this.logOperation('delete', `Word "${word}" not found for deletion`);
            return false;
        }

        this._deleteRecursive(this.root, word, 0);
        this.wordCount--;
        this.logOperation('delete', `Deleted word "${word}"`);
        return true;
    }

    /**
     * Recursive helper for delete operation
     * @param {TrieNode} node - Current node
     * @param {string} word - Word to delete
     * @param {number} index - Current character index
     * @returns {boolean} - True if this node should be deleted
     */
    _deleteRecursive(node, word, index) {
        if (index === word.length) {
            if (node.isEndOfWord) {
                node.isEndOfWord = false;
                node.wordCount = 0;
                node.word = null;
                node.prefixCount--;
            }
            return Object.keys(node.children).length === 0;
        }

        const char = word[index];
        if (!node.children[char]) {
            return false;
        }

        node.prefixCount--;

        const shouldDeleteChild = this._deleteRecursive(
            node.children[char],
            word,
            index + 1
        );

        if (shouldDeleteChild) {
            delete node.children[char];
            this.nodeCount--;
            return Object.keys(node.children).length === 0 && !node.isEndOfWord;
        }

        return false;
    }

    /**
     * Counts words with the given prefix
     * @param {string} prefix - The prefix to count
     * @returns {number} - Number of words with the prefix
     */
    countWordsWithPrefix(prefix) {
        if (!prefix || typeof prefix !== 'string') {
            return 0;
        }

        prefix = prefix.toLowerCase().trim();
        let current = this.root;

        for (const char of prefix) {
            if (!current.children[char]) {
                return 0;
            }
            current = current.children[char];
        }

        return current.prefixCount;
    }

    /**
     * Gets autocomplete suggestions for a prefix
     * @param {string} prefix - The prefix to get suggestions for
     * @param {number} limit - Maximum number of suggestions
     * @returns {string[]} - Array of suggested words
     */
    autocomplete(prefix, limit = 10) {
        const words = this.getWordsWithPrefix(prefix);
        return words.slice(0, limit);
    }

    /**
     * Finds the longest common prefix among all words
     * @returns {string} - The longest common prefix
     */
    longestCommonPrefix() {
        let prefix = '';
        let current = this.root;

        while (Object.keys(current.children).length === 1 && !current.isEndOfWord) {
            const char = Object.keys(current.children)[0];
            prefix += char;
            current = current.children[char];
        }

        return prefix;
    }

    /**
     * Gets all words in the trie
     * @returns {string[]} - Array of all words
     */
    getAllWords() {
        const words = [];
        this._collectWords(this.root, '', words);
        return words;
    }

    /**
     * Level order traversal for visualization
     * @returns {Array} - Levels of the trie
     */
    levelOrderTraversal() {
        const result = [];
        const queue = [{ node: this.root, char: 'root', depth: 0 }];

        while (queue.length > 0) {
            const { node, char, depth } = queue.shift();

            if (!result[depth]) {
                result[depth] = [];
            }

            result[depth].push({
                char,
                isEndOfWord: node.isEndOfWord,
                children: Object.keys(node.children)
            });

            for (const childChar in node.children) {
                queue.push({
                    node: node.children[childChar],
                    char: childChar,
                    depth: depth + 1
                });
            }
        }

        return result;
    }

    /**
     * Gets the height of the trie
     * @returns {number} - Height of the trie
     */
    getHeight() {
        return this._getHeightRecursive(this.root);
    }

    _getHeightRecursive(node) {
        if (!node || Object.keys(node.children).length === 0) {
            return 0;
        }

        let maxHeight = 0;
        for (const char in node.children) {
            maxHeight = Math.max(maxHeight, this._getHeightRecursive(node.children[char]));
        }

        return maxHeight + 1;
    }

    /**
     * Clears the trie
     */
    clear() {
        this.root = new TrieNode();
        this.wordCount = 0;
        this.nodeCount = 1;
        this.logOperation('info', 'Trie cleared');
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
     * Gets statistics about the trie
     * @returns {Object} - Statistics object
     */
    getStats() {
        return {
            nodeCount: this.nodeCount,
            wordCount: this.wordCount,
            height: this.getHeight(),
            isBalanced: true // Tries are always balanced in terms of structure
        };
    }

    /**
     * Gets all nodes for visualization
     * @returns {Array} - Array of node information
     */
    getAllNodes() {
        const nodes = [];
        this._collectNodesForViz(this.root, 'root', nodes, null);
        return nodes;
    }

    _collectNodesForViz(node, char, nodes, parent) {
        const nodeInfo = {
            char,
            isEndOfWord: node.isEndOfWord,
            children: Object.keys(node.children),
            parent
        };
        nodes.push(nodeInfo);

        for (const childChar in node.children) {
            this._collectNodesForViz(node.children[childChar], childChar, nodes, char);
        }
    }

    /**
     * Complexity analysis for Trie
     * @returns {Object} - Complexity information
     */
    static getComplexity() {
        return {
            insert: 'O(m)',
            delete: 'O(m)',
            search: 'O(m)',
            space: 'O(ALPHABET × m × n)',
            description: 'Trie provides O(m) operations where m is key length. Optimal for prefix-based searches and autocomplete. Trade-off: higher memory usage for sparse key sets.'
        };
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Trie, TrieNode };
}
