/* loader.js - Optimized */

// 1. Start fetching the Header IMMEDIATELY. 
// We don't wait for the DOM. We start the network request right now.
const headerPromise = fetch('../components/header.html')
    .then(response => {
        if (!response.ok) throw new Error('Failed to load header');
        return response.text();
    })
    .catch(error => console.error(error));

// Helper: Generic loader for other components
async function loadComponent(elementId, htmlContent) {
    const element = document.getElementById(elementId);
    if (!element) return;
    element.innerHTML = htmlContent;
}

// Helper: Highlight active link
function setActiveServer(serverId) {
    // We don't need setTimeout anymore because we await the render
    const link = document.getElementById(serverId);
    if (link) {
        link.style.color = "var(--starry-cyan)";
        link.style.textShadow = "0 0 10px rgba(34, 211, 238, 0.6)";
    }
}

// 2. When the DOM is ready, we just plug in the data that is likely already arrived.
document.addEventListener('DOMContentLoaded', async () => {
    
    // --- HANDLE HEADER ---
    try {
        const headerHtml = await headerPromise; // Wait for the fetch we started earlier
        if (headerHtml) {
            const headerContainer = document.getElementById('main-header');
            if (headerContainer) {
                headerContainer.innerHTML = headerHtml;
                
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
    // We have to wait for DOM to read 'data-sidebar', so we fetch this now.
    const sidebarType = document.body.getAttribute('data-sidebar');
    const sidebarContainer = document.getElementById('sidebar-container');
    
    if (sidebarType && sidebarContainer) {
        let sidebarPath = '';
        if (sidebarType === '2014') sidebarPath = '../components/sidebar-2014.html';
        if (sidebarType === '2024') sidebarPath = '../components/sidebar-2024.html';

        if (sidebarPath) {
            try {
                const response = await fetch(sidebarPath);
                const html = await response.text();
                sidebarContainer.innerHTML = html;
            } catch (e) {
                console.error("Sidebar loading failed", e);
            }
        }
    }

    // --- NOTIFY OTHER SCRIPTS ---
    // Tell mobile-menu.js that everything is ready
    document.dispatchEvent(new Event('componentLoaded'));
});
