/* loader.js - Path Fixer Version */

// 1. DETERMINE ROOT PATH
// If the HTML file defined window.rootPath, use it. Otherwise default to "./"
const basePath = window.rootPath || './';

// 2. HELPER: FIX PATHS IN INJECTED HTML
// This function adds "../../" to links so they work from deep folders
function fixRelativePaths(html) {
    if (!html) return '';
    // If we are already at root, we don't need to change anything
    if (basePath === './') return html;

    // Search for href="..." or src="..."
    return html.replace(/(href|src)=["']([^"']+)["']/g, (match, attr, path) => {
        // Ignore links that are external (http), anchors (#), email (mailto), or absolute (/)
        if (path.startsWith('http') || path.startsWith('#') || path.startsWith('mailto') || path.startsWith('/')) {
            return match;
        }
        // Otherwise, prepend the basePath (e.g., href="../../index.html")
        return `${attr}="${basePath}${path}"`;
    });
}

// 3. Start fetching the Header IMMEDIATELY
const headerPromise = fetch(basePath + 'components/header.html')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load header');
        return response.text();
    })
    .catch(error => console.error(error));

// Helper: Highlight active link
function setActiveServer(serverId) {
    const link = document.getElementById(serverId);
    if (link) {
        link.style.color = "var(--starry-cyan)";
        link.style.textShadow = "0 0 10px rgba(34, 211, 238, 0.6)";
    }
}

// 4. Main Logic when DOM is ready
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- HANDLE HEADER ---
    try {
        const rawHeaderHtml = await headerPromise; 
        if (rawHeaderHtml) {
            const headerContainer = document.getElementById('main-header');
            if (headerContainer) {
                // FIX PATHS BEFORE INJECTING
                headerContainer.innerHTML = fixRelativePaths(rawHeaderHtml);
                
                // Set Active Color
                const sidebarType = document.body.getAttribute('data-sidebar');
                if(sidebarType === '2014') setActiveServer('nav-2014');
                if(sidebarType === '2024') setActiveServer('nav-2024');
            }
        }
    } catch (e) {
        console.error("Header injection failed", e);
    }

    // --- HANDLE SIDEBAR ---
    const sidebarType = document.body.getAttribute('data-sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    
    if (sidebarType && sidebarContainer) {
        let sidebarPath = '';
        
        // Use basePath to find the component file
        if (sidebarType === '2014') sidebarPath = basePath + 'components/sidebar-2014.html';
        if (sidebarType === '2024') sidebarPath = basePath + 'components/sidebar-2024.html';

        if (sidebarPath) {
            try {
                const response = await fetch(sidebarPath);
                const rawSidebarHtml = await response.text();
                // FIX PATHS BEFORE INJECTING
                sidebarContainer.innerHTML = fixRelativePaths(rawSidebarHtml);
            } catch (e) {
                console.error("Sidebar loading failed", e);
            }
        }
    }

    // --- NOTIFY OTHER SCRIPTS ---
    document.dispatchEvent(new Event('componentLoaded'));
});