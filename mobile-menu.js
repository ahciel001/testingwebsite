/* mobile-menu.js */

// Helper function to initialize Header logic (Hamburger & Dropdowns)
function initHeaderLogic() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.header-content-wrapper');
    const navItems = document.querySelectorAll('.nav-item');

    // 1. Main Navigation (Hamburger)
    // We check if hamburger exists AND if we haven't already added the listener
    if (hamburger && navMenu && !hamburger.dataset.initialized) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Mark as initialized so we don't add the listener again
        hamburger.dataset.initialized = "true";
    }

    // 2. Mobile Dropdown Accordion Logic
    if (window.innerWidth <= 900) {
        navItems.forEach(item => {
            // Check if this specific item is already initialized
            if (item.dataset.initialized) return;

            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown');

            if (dropdown && link) {
                link.addEventListener('click', (e) => {
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

    // Close main menu when clicking a link inside the nav
    const pageLinks = document.querySelectorAll('.dropdown-item, .nav-link:not(:has(+ .dropdown))');
    pageLinks.forEach(link => {
        // Prevent adding multiple listeners to the same link
        if(link.dataset.clickListenerAdded) return;
        
        link.addEventListener('click', () => {
            if(hamburger) hamburger.classList.remove('active');
            if(navMenu) navMenu.classList.remove('active');
        });
        
        link.dataset.clickListenerAdded = "true";
    });
}

// Helper function to initialize Sidebar Link logic
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


// --- LISTENER 1: Run immediately for Static Elements ---
// The Sidebar Toggle Button exists in the HTML immediately, so we don't wait for the loader.
document.addEventListener('DOMContentLoaded', () => {
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


// --- LISTENER 2: Run when Dynamic Content is injected ---
// This listens for the event dispatched by loader.js
document.addEventListener('componentLoaded', () => {
    initHeaderLogic();
    initSidebarLinks();
});
