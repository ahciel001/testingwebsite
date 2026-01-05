// Search functionality for The Starry Shore

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

// Search results container (will be created dynamically)
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
    
    // Close search results when clicking outside
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
            <a href="${page.url}" style="display: block; padding: 0.75rem 1rem; color: var(--starry-text); text-decoration: none; border-bottom: 1px solid rgba(212, 175, 55, 0.1); transition: all 0.2s ease;">
                <div style="font-weight: bold; color: var(--starry-accent); margin-bottom: 0.25rem;">${page.title}</div>
                <div style="font-size: 0.85rem; color: var(--starry-text-dim);">${page.content}</div>
            </a>
        `;
    }).join('');
    
    searchResultsContainer.innerHTML = resultsHTML;
    
    // Add hover effects
    const links = searchResultsContainer.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('mouseenter', function() {
            this.style.background = 'var(--starry-hover)';
            this.style.paddingLeft = '1.25rem';
        });
        link.addEventListener('mouseleave', function() {
            this.style.background = 'transparent';
            this.style.paddingLeft = '1rem';
        });
    });
    
    searchResultsContainer.style.display = 'block';
}

// Initialize search when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}
/* background-canvas.js */
const canvas = document.getElementById('star-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let stars = [];
let mouse = { x: -1000, y: -1000 };
let isMouseDown = false;
let growingStar = null;

// Shades of Blue Palette (No gold/purple)
const bluePalette = [
    '#ffffff', // White
    '#e0f2fe', // Very light blue
    '#bae6fd', // Light blue
    '#7dd3fc', // Sky blue
    '#38bdf8', // Cyan
    '#0ea5e9', // Blue
    '#0284c7'  // Deep Blue
];

// Available shapes for the stars
const shapes = ['circle', 'sparkle', 'star5', 'star6'];

function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}

// Helper to draw complex shapes
function drawShape(ctx, shape, x, y, size, color) {
    ctx.beginPath();
    ctx.fillStyle = color;

    if (shape === 'circle') {
        ctx.arc(x, y, size, 0, Math.PI * 2);
    } 
    else if (shape === 'sparkle') {
        // 4-point Diamond/Sparkle
        ctx.moveTo(x, y - size);
        ctx.quadraticCurveTo(x, y, x + size, y);
        ctx.quadraticCurveTo(x, y, x, y + size);
        ctx.quadraticCurveTo(x, y, x - size, y);
        ctx.quadraticCurveTo(x, y, x, y - size);
    } 
    else if (shape === 'star5') {
        // 5-Point Star
        let spikes = 5;
        let outerRadius = size;
        let innerRadius = size / 2;
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;
        
        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            let cx = x + Math.cos(rot) * outerRadius;
            let cy = y + Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;

            cx = x + Math.cos(rot) * innerRadius;
            cy = y + Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
        }
        ctx.lineTo(x, y - outerRadius);
    }
    else if (shape === 'star6') {
        // 6-Point Star (Hexagram style)
        let spikes = 6;
        let outerRadius = size;
        let innerRadius = size / 2.5;
        let rot = Math.PI / 2 * 3;
        let step = Math.PI / spikes;

        ctx.moveTo(x, y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            let cx = x + Math.cos(rot) * outerRadius;
            let cy = y + Math.sin(rot) * outerRadius;
            ctx.lineTo(cx, cy);
            rot += step;

            cx = x + Math.cos(rot) * innerRadius;
            cy = y + Math.sin(rot) * innerRadius;
            ctx.lineTo(cx, cy);
            rot += step;
        }
        ctx.lineTo(x, y - outerRadius);
    }
    
    ctx.closePath();
    ctx.fill();
}

class Star {
    constructor(x, y, size, isSpawned = false, shape = 'circle') {
        this.x = x || Math.random() * width;
        this.y = y || Math.random() * height;
        this.size = size || Math.random() * 2;
        this.isSpawned = isSpawned;
        
        // Background stars are mostly circles, spawned ones vary
        this.shape = shape; 
        
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        
        this.color = bluePalette[Math.floor(Math.random() * bluePalette.length)];
        this.opacity = Math.random() * 0.5 + 0.3;
        this.pulse = Math.random() * 0.02;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Glow effect
        if (this.isSpawned || this.size > 2.5) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = this.color;
        } else {
            ctx.shadowBlur = 0;
        }

        drawShape(ctx, this.shape, this.x, this.y, this.size, this.color);
        
        ctx.restore();
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Gravity Logic (Reduced distance and force)
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let maxDistance = 120; 

        if (distance < maxDistance) {
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            let force = (maxDistance - distance) / maxDistance;
            let drift = force * 0.8; 
            
            this.x += forceDirectionX * drift;
            this.y += forceDirectionY * drift;
        }

        // Twinkle
        this.opacity += this.pulse;
        if (this.opacity > 0.8 || this.opacity < 0.2) this.pulse = -this.pulse;

        // Wrap around
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
    }
}

function init() {
    resize();
    stars = [];
    // Spawn background stars (mostly circles)
    for (let i = 0; i < 350; i++) {
        // 90% chance of circle, 10% chance of tiny sparkle
        let type = Math.random() > 0.9 ? 'sparkle' : 'circle';
        stars.push(new Star(null, null, null, false, type));
    }
}

// --- Interaction Logic ---

window.addEventListener('resize', resize);

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

window.addEventListener('mousedown', (e) => {
    isMouseDown = true;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    // Pick a random shape for this new star
    let randomShape = shapes[Math.floor(Math.random() * shapes.length)];
    
    growingStar = {
        x: mouse.x,
        y: mouse.y,
        size: 0.5,
        color: '#ffffff', // Start white hot
        shape: randomShape
    };
});

window.addEventListener('mouseup', () => {
    isMouseDown = false;
    if (growingStar) {
        let s = new Star(
            growingStar.x, 
            growingStar.y, 
            growingStar.size, 
            true, 
            growingStar.shape
        );
        
        // Give spawned stars random velocity
        s.vx = (Math.random() - 0.5) * 1.5; 
        s.vy = (Math.random() - 0.5) * 1.5;
        
        // Pick a blue shade
        s.color = bluePalette[Math.floor(Math.random() * bluePalette.length)]; 
        
        stars.push(s);
        growingStar = null;
    }
});

function animate() {
    ctx.clearRect(0, 0, width, height);

    stars.forEach(star => {
        star.update();
        star.draw();
    });

    // Draw the growing star under cursor
    if (isMouseDown && growingStar) {
        growingStar.x = mouse.x;
        growingStar.y = mouse.y;
        
        if (growingStar.size < 10) {
            growingStar.size += 0.4;
        }

        ctx.save();
        ctx.shadowBlur = 20 + growingStar.size;
        ctx.shadowColor = '#38bdf8'; // Cyan glow while charging
        drawShape(ctx, growingStar.shape, growingStar.x, growingStar.y, growingStar.size, growingStar.color);
        ctx.restore();
    }

    requestAnimationFrame(animate);
}

init();
animate();
