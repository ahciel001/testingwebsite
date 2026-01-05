/* search.js */

// 1. MASTER LIST (URLs relative to the website root)
const pageIndex = {
    'all': [
        { title: 'Home', url: 'index.html', category: 'General' },
        
        // 2014 Server
        { title: 'About the Server (2014)', url: '2014-5e-server/about-the-2014-server.html', category: '2014' },
        { title: 'Character Creation (2014)', url: '2014-5e-server/character-creation-steps.html', category: '2014' },
        { title: 'How to Play (2014)', url: '2014-5e-server/how-to-play.html', category: '2014' },
        { title: 'Loot and Items (2014)', url: '2014-5e-server/loot-and-items.html', category: '2014' },
        { title: 'Misc Rules (2014)', url: '2014-5e-server/misc-rules.html', category: '2014' },
        { title: 'DM Guide (2014)', url: '2014-5e-server/dm-guide.html', category: '2014' },
        { title: 'DM Tools (2014)', url: '2014-5e-server/dm-tools.html', category: '2014' },
        { title: 'Shopping Guide (2014)', url: '2014-5e-server/2014-server-systems/shopping-guide.html', category: '2014' },
        { title: 'Crafting (2014)', url: '2014-5e-server/2014-server-systems/crafting.html', category: '2014' },
        { title: 'Item Patch Notes (2014)', url: '2014-5e-server/2014-server-systems/item-patch-notes.html', category: '2014' },
        { title: 'Downtime Points (2014)', url: '2014-5e-server/2014-server-systems/downtime-points-guide.html', category: '2014' },
        { title: 'Prestige Rules (2014)', url: '2014-5e-server/2014-server-systems/prestige-rules.html', category: '2014' },
        { title: 'Website Launch (2014)', url: '2014-5e-server/events/website-launch-celebration.html', category: '2014' },
        
        // 2024 Server
        { title: 'About the Server (2024)', url: '2024-5.5e-server/about-the-2024-server.html', category: '2024' },
        { title: 'Character Creation (2024)', url: '2024-5.5e-server/character-creation-steps.html', category: '2024' },
        { title: 'Creation Log Maker (2024)', url: '2024-5.5e-server/creation-log-maker.html', category: '2024' },
        { title: 'Crafting (2024)', url: '2024-5.5e-server/2024-server-systems/crafting.html', category: '2024' },
        { title: 'Website Launch (2024)', url: '2024-5.5e-server/events/website-launch-celebration.html', category: '2024' },
    ]
};

// Helper: Filter lists for specific dropdown selection
pageIndex['2014'] = pageIndex['all'].filter(p => p.category === '2014');
pageIndex['2024'] = pageIndex['all'].filter(p => p.category === '2024');

let searchResultsContainer = null;
let isIndexing = false;
let hasIndexed = false;

// 2. INITIALIZATION
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    
    if (!searchInput || !searchFilter) return;

    // Build the results dropdown
    createResultsContainer();
    
    // Event Listeners
    searchInput.addEventListener('input', handleInput);
    searchInput.addEventListener('focus', handleInput); // Show previous results on click
    searchFilter.addEventListener('change', performSearch);
    
    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!document.querySelector('.search-container').contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
}

// 3. CREATE UI
function createResultsContainer() {
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'searchResults';
    searchResultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background: rgba(2, 2, 10, 0.98);
        backdrop-filter: blur(15px);
        border: 1px solid var(--starry-cyan);
        border-radius: 8px;
        min-width: 320px;
        max-width: 400px;
        max-height: 400px;
        overflow-y: auto;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.8);
        display: none;
        z-index: 2000;
        color: #fff;
    `;
    
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(searchResultsContainer);
    }
}

// 4. HANDLE INPUT & TRIGGER INDEXING
function handleInput(e) {
    const query = e.target.value.toLowerCase().trim();

    // Start fetching content relative to where we are
    if (!hasIndexed && !isIndexing) {
        indexPageContent();
    }

    if (query.length < 2) {
        searchResultsContainer.style.display = 'none';
        return;
    }
    
    performSearch();
}

// 5. INDEXING LOGIC (The "Search Inside Content" Magic)
async function indexPageContent() {
    isIndexing = true;
    
    // Determine depth to fix relative paths (Are we in root or a subfolder?)
    // If the Logo link is "../index.html", we are in a subfolder.
    const logoLink = document.querySelector('.logo-text');
    const isSubfolder = logoLink && logoLink.getAttribute('href').startsWith('../');
    const prefix = isSubfolder ? '../' : '';

    console.log("Starting Search Indexing...");

    const uniquePages = pageIndex['all'];
    
    const fetchPromises = uniquePages.map(async (page) => {
        // Skip if already has content
        if (page.searchContent) return;

        try {
            // Fetch the HTML file
            const response = await fetch(prefix + page.url);
            if (!response.ok) throw new Error('Failed to load');
            
            const htmlText = await response.text();
            
            // Parse HTML string into a DOM object
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            // Extract text ONLY from <main> or .content-with-sidebar to avoid header/footer noise
            const mainContent = doc.querySelector('main') || doc.querySelector('.content-with-sidebar') || doc.body;
            
            // Clean up text (remove multiple spaces/newlines)
            page.searchContent = mainContent.innerText.replace(/\s+/g, ' ').toLowerCase();
            
        } catch (err) {
            console.warn(`Could not index ${page.url}`, err);
            page.searchContent = ""; // Empty string on fail
        }
    });

    await Promise.all(fetchPromises);
    hasIndexed = true;
    isIndexing = false;
    console.log("Indexing Complete.");
    
    // Re-run search now that data is loaded
    performSearch(); 
}

// 6. PERFORM SEARCH
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    const query = searchInput.value.toLowerCase().trim();
    const filter = searchFilter.value;
    
    if (query.length < 2) return;

    // Show "Loading..." if still indexing
    if (isIndexing) {
        searchResultsContainer.style.display = 'block';
        searchResultsContainer.innerHTML = `<div style="padding:1rem; text-align:center; color:#94a3b8;">Scanning stars (Indexing)...</div>`;
        return;
    }
    
    const pages = pageIndex[filter] || pageIndex['all'];
    
    // Search Algorithm
    const results = pages.filter(page => {
        // 1. Check Title
        if (page.title.toLowerCase().includes(query)) return true;
        // 2. Check Content (if loaded)
        if (page.searchContent && page.searchContent.includes(query)) return true;
        return false;
    });
    
    displaySearchResults(results, query);
}

// 7. DISPLAY RESULTS WITH SNIPPETS
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div style="padding: 1rem; color: var(--starry-text-dim); text-align: center;">
                No results found in this sector.
            </div>
        `;
        searchResultsContainer.style.display = 'block';
        return;
    }
    
    // Determine path prefix for links
    const logoLink = document.querySelector('.logo-text');
    const isSubfolder = logoLink && logoLink.getAttribute('href').startsWith('../');
    const prefix = isSubfolder ? '../' : '';

    const resultsHTML = results.slice(0, 8).map(page => {
        // Generate Snippet
        let snippet = "Page matches title.";
        
        if (page.searchContent && page.searchContent.includes(query)) {
            const index = page.searchContent.indexOf(query);
            const start = Math.max(0, index - 30);
            const end = Math.min(page.searchContent.length, index + query.length + 30);
            
            let text = page.searchContent.substring(start, end);
            // Highlight match
            const regex = new RegExp(`(${query})`, 'gi');
            text = text.replace(regex, '<span style="color: var(--starry-gold); font-weight:bold;">$1</span>');
            
            snippet = "..." + text + "...";
        }

        return `
            <a href="${prefix + page.url}" style="display: block; padding: 0.8rem 1rem; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;">
                <div style="font-weight: bold; color: var(--starry-cyan); font-size: 0.95rem; margin-bottom: 4px;">
                    ${page.title}
                </div>
                <div style="font-size: 0.8rem; color: var(--starry-text-dim); line-height: 1.3;">
                    ${snippet}
                </div>
            </a>
        `;
    }).join('');
    
    searchResultsContainer.innerHTML = resultsHTML;
    searchResultsContainer.style.display = 'block';
    
    // Add hover effects via JS (easier than CSS for dynamic elements sometimes)
    const links = searchResultsContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            link.style.background = 'rgba(34, 211, 238, 0.1)';
        });
        link.addEventListener('mouseleave', () => {
            link.style.background = 'transparent';
        });
    });
}

// Run Init
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
