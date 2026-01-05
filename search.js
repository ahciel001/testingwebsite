/* search.js */

// Page index for search
const pageIndex = {
    'all': [
        { title: 'Home', url: 'index.html', content: 'Welcome to The Starry Shore' },
        // 2014 Server pages
        { title: 'About the Server (2014)', url: '2014-5e-server/about-the-server.html', content: '2014 5e server information', category: '2014' },
        { title: 'Character Creation Steps (2014)', url: '2014-5e-server/character-creation-steps.html', content: '2014 character creation', category: '2014' },
        { title: 'How to Play (2014)', url: '2014-5e-server/how-to-play.html', content: '2014 how to play guide', category: '2014' },
        { title: 'Loot and Items (2014)', url: '2014-5e-server/loot-and-items.html', content: '2014 loot and items', category: '2014' },
        { title: 'Misc Rules (2014)', url: '2014-5e-server/misc-rules.html', content: '2014 miscellaneous rules', category: '2014' },
        { title: 'DM Guide (2014)', url: '2014-5e-server/dm-guide.html', content: '2014 DM guide', category: '2014' },
        { title: 'DM Tools (2014)', url: '2014-5e-server/dm-tools.html', content: '2014 DM tools', category: '2014' },
        { title: 'Shopping Guide (2014)', url: '2014-5e-server/2014-server-systems/shopping-guide.html', content: '2014 shopping guide', category: '2014' },
        { title: 'Crafting (2014)', url: '2014-5e-server/2014-server-systems/crafting.html', content: '2014 crafting system', category: '2014' },
        { title: 'Item Patch Notes (2014)', url: '2014-5e-server/2014-server-systems/item-patch-notes.html', content: '2014 item patch notes', category: '2014' },
        { title: 'Downtime Points Guide (2014)', url: '2014-5e-server/2014-server-systems/downtime-points-guide.html', content: '2014 downtime points', category: '2014' },
        { title: 'Prestige Rules (2014)', url: '2014-5e-server/2014-server-systems/prestige-rules.html', content: '2014 prestige rules', category: '2014' },
        { title: 'Website Launch Celebration (2014)', url: '2014-5e-server/events/website-launch-celebration.html', content: '2014 website launch event', category: '2014' },
        // 2024 Server pages
        { title: 'About the Server (2024)', url: '2024-5.5e-server/about-the-server.html', content: '2024 5.5e server information', category: '2024' },
        { title: 'Character Creation Steps (2024)', url: '2024-5.5e-server/character-creation-steps.html', content: '2024 character creation', category: '2024' },
        { title: 'Creation Log Maker (2024)', url: '2024-5.5e-server/creation-log-maker.html', content: '2024 creation log maker', category: '2024' },
        { title: 'Crafting (2024)', url: '2024-5.5e-server/2024-server-systems/crafting.html', content: '2024 crafting system', category: '2024' },
        { title: 'Website Launch Celebration (2024)', url: '2024-5.5e-server/events/website-launch-celebration.html', content: '2024 website launch event', category: '2024' },
    ],
    '2014': [
        { title: 'About the Server', url: '2014-5e-server/about-the-server.html', content: '2014 5e server information' },
        { title: 'Character Creation Steps', url: '2014-5e-server/character-creation-steps.html', content: '2014 character creation' },
        { title: 'How to Play', url: '2014-5e-server/how-to-play.html', content: '2014 how to play guide' },
        { title: 'Loot and Items', url: '2014-5e-server/loot-and-items.html', content: '2014 loot and items' },
        { title: 'Misc Rules', url: '2014-5e-server/misc-rules.html', content: '2014 miscellaneous rules' },
        { title: 'DM Guide', url: '2014-5e-server/dm-guide.html', content: '2014 DM guide' },
        { title: 'DM Tools', url: '2014-5e-server/dm-tools.html', content: '2014 DM tools' },
        { title: 'Shopping Guide', url: '2014-5e-server/2014-server-systems/shopping-guide.html', content: '2014 shopping guide' },
        { title: 'Crafting', url: '2014-5e-server/2014-server-systems/crafting.html', content: '2014 crafting system' },
        { title: 'Item Patch Notes', url: '2014-5e-server/2014-server-systems/item-patch-notes.html', content: '2014 item patch notes' },
        { title: 'Downtime Points Guide', url: '2014-5e-server/2014-server-systems/downtime-points-guide.html', content: '2014 downtime points' },
        { title: 'Prestige Rules', url: '2014-5e-server/2014-server-systems/prestige-rules.html', content: '2014 prestige rules' },
        { title: 'Website Launch Celebration', url: '2014-5e-server/events/website-launch-celebration.html', content: '2014 website launch event' },
    ],
    '2024': [
        { title: 'About the Server', url: '2024-5.5e-server/about-the-server.html', content: '2024 5.5e server information' },
        { title: 'Character Creation Steps', url: '2024-5.5e-server/character-creation-steps.html', content: '2024 character creation' },
        { title: 'Creation Log Maker', url: '2024-5.5e-server/creation-log-maker.html', content: '2024 creation log maker' },
        { title: 'Crafting', url: '2024-5.5e-server/2024-server-systems/crafting.html', content: '2024 crafting system' },
        { title: 'Website Launch Celebration', url: '2024-5.5e-server/events/website-launch-celebration.html', content: '2024 website launch event' },
    ]
};

let searchResultsContainer = null;

function initSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    
    if (!searchInput || !searchFilter) return;
    
    // Create search results container
    searchResultsContainer = document.createElement('div');
    searchResultsContainer.id = 'searchResults';
    searchResultsContainer.style.cssText = `
        position: absolute;
        top: 100%;
        right: 0;
        margin-top: 0.5rem;
        background: rgba(10, 10, 26, 0.95);
        backdrop-filter: blur(10px);
        border: 1px solid var(--starry-border);
        border-radius: 4px;
        min-width: 300px;
        max-width: 500px;
        max-height: 400px;
        overflow-y: auto;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        display: none;
        z-index: 1001;
    `;
    
    const searchContainer = document.querySelector('.search-container');
    if (searchContainer) {
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(searchResultsContainer);
    }
    
    searchInput.addEventListener('input', performSearch);
    searchFilter.addEventListener('change', performSearch);
    
    document.addEventListener('click', (e) => {
        if (!searchContainer.contains(e.target)) {
            searchResultsContainer.style.display = 'none';
        }
    });
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchFilter = document.getElementById('searchFilter');
    
    if (!searchInput || !searchFilter || !searchResultsContainer) return;
    
    const query = searchInput.value.toLowerCase().trim();
    const filter = searchFilter.value;
    
    if (query.length < 2) {
        searchResultsContainer.style.display = 'none';
        return;
    }
    
    const pages = pageIndex[filter] || pageIndex['all'];
    const results = pages.filter(page => {
        return page.title.toLowerCase().includes(query) ||
               page.content.toLowerCase().includes(query) ||
               (page.url && page.url.toLowerCase().includes(query));
    });
    
    displaySearchResults(results);
}

function displaySearchResults(results) {
    if (!searchResultsContainer) return;
    
    if (results.length === 0) {
        searchResultsContainer.innerHTML = `
            <div style="padding: 1rem; color: var(--starry-text-dim); text-align: center;">
                No results found
            </div>
        `;
        searchResultsContainer.style.display = 'block';
        return;
    }
    
    const resultsHTML = results.slice(0, 10).map(page => {
        return `
            <a href="${page.url}" style="display: block; padding: 0.75rem 1rem; color: var(--starry-text); text-decoration: none; border-bottom: 1px solid rgba(56, 189, 248, 0.2); transition: all 0.2s ease;">
                <div style="font-weight: bold; color: var(--starry-cyan); margin-bottom: 0.25rem;">${page.title}</div>
                <div style="font-size: 0.85rem; color: var(--starry-text-dim);">${page.content}</div>
            </a>
        `;
    }).join('');
    
    searchResultsContainer.innerHTML = resultsHTML;
    
    const links = searchResultsContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(34, 211, 238, 0.15)';
            this.style.paddingLeft = '1.25rem';
        });
        link.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.paddingLeft = '1rem';
        });
    });
    
    searchResultsContainer.style.display = 'block';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
