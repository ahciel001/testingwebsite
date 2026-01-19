/* search.js - With Auto-Scroll (Text Fragments) */

// 1. DETERMINE ROOT PATH
const searchBasePath = window.rootPath || '';

// 2. MASTER LIST
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

pageIndex['2014'] = pageIndex['all'].filter(p => p.category === '2014');
pageIndex['2024'] = pageIndex['all'].filter(p => p.category === '2024');

let searchResultsContainer = null;
let isIndexing = false;
let hasIndexed = false;

// 3. INITIALIZATION
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    
    if (!searchInput || !searchFilter) return;

    const newInput = searchInput.cloneNode(true);
    searchInput.parentNode.replaceChild(newInput, searchInput);
    
    const newFilter = searchFilter.cloneNode(true);
    searchFilter.parentNode.replaceChild(newFilter, searchFilter);

    createResultsContainer();
    
    const activeInput = document.getElementById('searchInput');
    const activeFilter = document.getElementById('searchFilter');

    activeInput.addEventListener('input', handleInput);
    activeInput.addEventListener('focus', handleInput); 
    activeFilter.addEventListener('change', performSearch);
    
    document.addEventListener('click', (e) => {
        if (searchResultsContainer && !document.querySelector('.search-container').contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
    
    console.log("Search Initialized.");
}

// 4. CREATE UI
function createResultsContainer() {
    const existing = document.getElementById('searchResults');
    if (existing) existing.remove();

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

// 5. HANDLE INPUT
function handleInput(e) {
    const query = e.target.value.toLowerCase().trim();

    if (!hasIndexed && !isIndexing) {
        indexPageContent();
    }

    if (query.length < 2) {
        if(searchResultsContainer) searchResultsContainer.style.display = 'none';
        return;
    }
    
    performSearch();
}

// 6. INDEXING LOGIC (Clean Code)
async function indexPageContent() {
    isIndexing = true;
    console.log(`Starting Indexing...`);

    const uniquePages = pageIndex['all'];
    
    const fetchPromises = uniquePages.map(async (page) => {
        if (page.searchContent) return;

        try {
            const response = await fetch(searchBasePath + page.url);
            if (!response.ok) throw new Error(`Status ${response.status}`);
            
            const htmlText = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(htmlText, 'text/html');
            
            let contentNode = doc.querySelector('main') || doc.querySelector('.content-with-sidebar') || doc.body;

            // Remove Script/Style/Nav junk
            const junk = contentNode.querySelectorAll('script, style, noscript, template, header, nav, footer, .sidebar, .mobile-sidebar-toggle');
            junk.forEach(el => el.remove());

            page.searchContent = contentNode.textContent.replace(/\s+/g, ' ').toLowerCase();
            
        } catch (err) {
            console.warn(`Could not index ${page.url}:`, err);
            page.searchContent = "";
        }
    });

    await Promise.all(fetchPromises);
    hasIndexed = true;
    isIndexing = false;
    performSearch(); 
}

// 7. PERFORM SEARCH
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    
    if(!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const filter = searchFilter ? searchFilter.value : 'all';
    
    if (query.length < 2) return;

    if (isIndexing) {
        searchResultsContainer.style.display = 'block';
        searchResultsContainer.innerHTML = `<div style="padding:1rem; text-align:center; color:#94a3b8;">Scanning stars (Indexing)...</div>`;
        return;
    }
    
    const pages = pageIndex[filter] || pageIndex['all'];
    
    const results = pages.filter(page => {
        if (page.title.toLowerCase().includes(query)) return true;
        if (page.searchContent && page.searchContent.includes(query)) return true;
        return false;
    });
    
    displaySearchResults(results, query);
}

// 8. DISPLAY RESULTS (UPDATED WITH TEXT FRAGMENTS)
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div style="padding: 1rem; color: var(--starry-text-dim); text-align: center;">
                No results found.
            </div>
        `;
        searchResultsContainer.style.display = 'block';
        return;
    }

    const resultsHTML = results.slice(0, 8).map(page => {
        let snippet = "Page matches title.";
        let fragment = ""; // This is the magic part

        if (page.searchContent && page.searchContent.includes(query)) {
            const index = page.searchContent.indexOf(query);
            
            // Get a snippet of ~60 chars
            const start = Math.max(0, index - 30);
            const end = Math.min(page.searchContent.length, index + query.length + 30);
            
            // Extract the text for visual snippet
            let text = page.searchContent.substring(start, end);

            // --- GENERATE SCROLL LINK ---
            // We use the same snippet text for the scroll anchor
            // "encodeURIComponent" makes sure spaces and special chars work in the URL
            fragment = `#:~:text=${encodeURIComponent(text.trim())}`;
            // -----------------------------

            // Visual Highlight for Dropdown
            const regex = new RegExp(`(${query})`, 'gi');
            text = text.replace(regex, '<span style="color: var(--starry-gold); font-weight:bold;">$1</span>');
            snippet = "..." + text + "...";
        }

        return `
            <a href="${searchBasePath + page.url}${fragment}" style="display: block; padding: 0.8rem 1rem; text-decoration: none; border-bottom: 1px solid rgba(255,255,255,0.05); transition: background 0.2s;">
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
    
    const links = searchResultsContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', () => { link.style.background = 'rgba(34, 211, 238, 0.1)'; });
        link.addEventListener('mouseleave', () => { link.style.background = 'transparent'; });
    });
}

document.addEventListener('componentLoaded', initSearch);

if (document.readyState === 'complete') {
    initSearch();
}