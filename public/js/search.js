// Smart Site Search Engine
class SiteSearch {
    constructor() {
        this.index = [];
        this.searchInput = null;
        this.resultsContainer = null;
        this.isIndexed = false;
        this.debounceTimeout = null;
    }

    async init() {
        this.searchInput = document.querySelector('.search-input');
        this.resultsContainer = document.querySelector('.search-results');
        const clearBtn = document.querySelector('.search-clear');

        if (!this.searchInput || !this.resultsContainer) return;

        // Index all pages
        await this.indexPages();

        // Event listeners
        this.searchInput.addEventListener('input', (e) => {
            clearTimeout(this.debounceTimeout);
            this.debounceTimeout = setTimeout(() => {
                this.handleSearch(e.target.value);
            }, 150);
        });

        clearBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.clearResults();
            this.searchInput.focus();
        });

        // Close on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.navbar-search')) {
                this.clearResults();
            }
        });

        // Keyboard navigation
        this.searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.clearResults();
                this.searchInput.blur();
            }
        });
    }

    async indexPages() {
        const pages = [
            { url: 'index.html', title: 'Home' },
            { url: 'cnn.html', title: 'Anomaly Detection Project' },
            { url: 'particle.html', title: 'ParticleBox Project' },
            { url: 'quantum.html', title: 'Quantum Blockchain Project' },
            { url: 'ios.html', title: 'RepBook iOS Project' }
        ];

        for (const page of pages) {
            try {
                const response = await fetch(page.url);
                const html = await response.text();
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');

                // Extract text from main content areas, excluding nav/footer
                const contentSelectors = [
                    '.showcase__section',
                    '.hero2__section',
                    '.project-card',
                    'section',
                    'main'
                ];

                let content = '';
                contentSelectors.forEach(selector => {
                    const elements = doc.querySelectorAll(selector);
                    elements.forEach(el => {
                        // Skip navigation and footer
                        if (!el.closest('nav') && !el.closest('footer') && !el.closest('.navbar')) {
                            content += ' ' + el.textContent;
                        }
                    });
                });

                // Clean up whitespace
                content = content.replace(/\s+/g, ' ').trim();

                this.index.push({
                    url: page.url,
                    title: page.title,
                    content: content.toLowerCase()
                });
            } catch (error) {
                console.error(`Failed to index ${page.url}:`, error);
            }
        }

        this.isIndexed = true;
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.clearResults();
            return;
        }

        const results = this.search(query);
        this.displayResults(results, query);
    }

    search(query) {
        const searchTerm = query.toLowerCase().trim();
        const results = [];

        this.index.forEach(page => {
            const index = page.content.indexOf(searchTerm);
            if (index !== -1) {
                // Extract snippet around match
                const snippetStart = Math.max(0, index - 50);
                const snippetEnd = Math.min(page.content.length, index + searchTerm.length + 50);
                let snippet = page.content.substring(snippetStart, snippetEnd);

                // Add ellipsis
                if (snippetStart > 0) snippet = '...' + snippet;
                if (snippetEnd < page.content.length) snippet = snippet + '...';

                // Calculate relevance (exact match vs partial)
                const relevance = page.content.split(searchTerm).length - 1;

                results.push({
                    url: page.url,
                    title: page.title,
                    snippet: snippet,
                    matchIndex: index,
                    relevance: relevance
                });
            }
        });

        // Sort by relevance
        results.sort((a, b) => b.relevance - a.relevance || a.matchIndex - b.matchIndex);

        // Return top 5
        return results.slice(0, 5);
    }

    // Security: Escape HTML to prevent XSS
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Security: Escape regex special characters to prevent ReDoS
    escapeRegex(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    highlightMatch(text, query) {
        const searchTerm = this.escapeRegex(query.trim());
        if (!searchTerm) return this.escapeHtml(text);

        const regex = new RegExp(`(${searchTerm})`, 'gi');
        const escapedText = this.escapeHtml(text);
        return escapedText.replace(regex, '<mark>$1</mark>');
    }

    displayResults(results, query) {
        this.resultsContainer.innerHTML = '';
        this.resultsContainer.classList.add('active');

        // Security: Sanitize query for display
        const safeQuery = this.escapeHtml(query.trim().substring(0, 100)); // Limit length

        // Add site results
        results.forEach(result => {
            const item = document.createElement('a');
            item.className = 'search-result-item';
            item.href = result.url;

            const title = document.createElement('div');
            title.className = 'search-result-title';
            title.textContent = result.title;

            const snippet = document.createElement('div');
            snippet.className = 'search-result-snippet';
            snippet.innerHTML = this.highlightMatch(result.snippet, query);

            item.appendChild(title);
            item.appendChild(snippet);
            this.resultsContainer.appendChild(item);
        });

        // Always add "Search Internet" option
        const internetSearch = document.createElement('a');
        internetSearch.className = 'search-result-item search-internet';
        internetSearch.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
        internetSearch.target = '_blank';
        internetSearch.rel = 'noopener noreferrer';

        const text = document.createElement('div');
        text.className = 'search-result-title';
        // Use textContent instead of innerHTML for user input
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        text.appendChild(searchIcon);
        text.appendChild(document.createTextNode(` Search Internet for "${safeQuery}"`));

        internetSearch.appendChild(text);
        this.resultsContainer.appendChild(internetSearch);

        // Show "no results" if needed
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'search-no-results';
            noResults.textContent = 'No results found on this site';
            this.resultsContainer.insertBefore(noResults, internetSearch);
        }
    }

    clearResults() {
        this.resultsContainer.innerHTML = '';
        this.resultsContainer.classList.remove('active');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    const search = new SiteSearch();
    search.init();
});
