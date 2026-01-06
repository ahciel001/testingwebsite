/* mobile-menu.js */

// 1. Helper function to initialize Header logic (Hamburger & Dropdowns)
function initHeaderLogic() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.header-content-wrapper');
    const navItems = document.querySelectorAll('.nav-item');

    // Check if hamburger exists AND if we haven't already added the listener
    // This prevents double-attaching if the script runs twice
    if (hamburger && navMenu && !hamburger.dataset.initialized) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Mark as initialized
        hamburger.dataset.initialized = "true";
    }

    // Mobile Dropdown Accordion Logic
    if (window.innerWidth <= 900) {
        navItems.forEach(item => {
            // Check if this specific item is already initialized
            if (item.dataset.initialized) return;

            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown');

            if (dropdown && link) {
                link.addEventListener('click', (e) => {
                    // Only prevent default if it triggers a dropdown
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = dropdown.classList.contains('open');

                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown').forEach(d => {
                        if (d !== dropdown) d.classList.remove('open');
                    });
                    document.querySelectorAll('.nav-item').forEach(i => {
                        if (i !== item) i.classList.remove('active-dropdown');
                    });

                    // Toggle current
                    if (!isOpen) {
                        dropdown.classList.add('open');
                        item.classList.add('active-dropdown');
                    } else {
                        dropdown.classList.remove('open');
                        item.classList.remove('active-dropdown');
                    }
                });
            }
            // Mark item as initialized
            item.dataset.initialized = "true";
        });
    }

    // Close main menu when clicking a regular link inside the nav
    const pageLinks = document.querySelectorAll('.dropdown-item, .nav-link:not(:has(+ .dropdown))');
    pageLinks.forEach(link => {
        if(link.dataset.clickListenerAdded) return;
        
        link.addEventListener('click', () => {
            if(hamburger) hamburger.classList.remove('active');
            if(navMenu) navMenu.classList.remove('active');
        });
        
        link.dataset.clickListenerAdded = "true";
    });
}

// 2. Helper function to initialize Sidebar Link logic
function initSidebarLinks() {
    const sidebar = document.querySelector('.sidebar');
    const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
    
    if (!sidebar) return;

    // Close sidebar when clicking a link inside it
    const sidebarLinks = sidebar.querySelectorAll('.sidebar-nav-link');
    sidebarLinks.forEach(link => {
        if(link.dataset.clickListenerAdded) return;

        link.addEventListener('click', () => {
            sidebar.classList.remove('active');
            if(sidebarToggle) sidebarToggle.innerHTML = '☰ Page Menu';
        });

        link.dataset.clickListenerAdded = "true";
    });
}


// --- LISTENER 1: Run immediately (For Index.html / Static Content) ---
document.addEventListener('DOMContentLoaded', () => {
    // Attempt to run header logic immediately for pages where header is hardcoded
    initHeaderLogic();
    
    // Sidebar Toggle Logic (Usually static on page)
    const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');

    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation(); 
            sidebar.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                sidebarToggle.innerHTML = '✕ Close Menu';
            } else {
                sidebarToggle.innerHTML = '☰ Page Menu';
            }
        });

        // Close sidebar when clicking main content
        document.addEventListener('click', (e) => {
            if (sidebar.classList.contains('active') && 
                !sidebar.contains(e.target) && 
                e.target !== sidebarToggle) {
                
                sidebar.classList.remove('active');
                sidebarToggle.innerHTML = '☰ Page Menu';
            }
        });
    }
});


// --- LISTENER 2: Run when Dynamic Content is injected (For Sub-pages) ---
document.addEventListener('componentLoaded', () => {
    initHeaderLogic();
    initSidebarLinks();
});
