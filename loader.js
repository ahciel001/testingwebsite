// loader.js
async function loadComponent(elementId, filePath) {
    const element = document.getElementById(elementId);
    if (!element) return;

    try {
        const response = await fetch(filePath);
        if (!response.ok) throw new Error(`Failed to load ${filePath}`);
        const html = await response.text();
        element.innerHTML = html;
        
        // Dispatch an event to let other scripts know content is loaded
        // This is important for mobile-menu.js to know the buttons exist now
        document.dispatchEvent(new Event('componentLoaded'));
    } catch (error) {
        console.error(error);
    }
}

// Function to highlight the active server in the Top Nav
function setActiveServer(serverId) {
    // Wait slightly to ensure header is loaded
    setTimeout(() => {
        const link = document.getElementById(serverId);
        if (link) {
            link.style.color = "var(--starry-cyan)";
            link.style.textShadow = "0 0 10px rgba(34, 211, 238, 0.6)";
        }
    }, 100); 
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Determine which sidebar to load based on a data-attribute on the body
    const sidebarType = document.body.getAttribute('data-sidebar');
    
    // Load Header
    loadComponent('main-header', '../components/header.html').then(() => {
        // After header loads, set the active color
        if(sidebarType === '2014') setActiveServer('nav-2014');
        if(sidebarType === '2024') setActiveServer('nav-2024');
    });

    // Load Sidebar
    if (sidebarType === '2014') {
        loadComponent('sidebar-container', '../components/sidebar-2014.html');
    } else if (sidebarType === '2024') {
        loadComponent('sidebar-container', '../components/sidebar-2024.html');
    }
});
