/* mobile-menu.js */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. Main Navigation (Hamburger) Logic ---
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.header-content-wrapper');
    const navItems = document.querySelectorAll('.nav-item');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // --- 2. Mobile Dropdown Accordion Logic ---
    if (window.innerWidth <= 900) {
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown');

            if (dropdown) {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    const isOpen = dropdown.classList.contains('open');

                    // Close all other dropdowns
                    document.querySelectorAll('.dropdown').forEach(d => {
                        d.classList.remove('open');
                    });

                    // Toggle current
                    if (!isOpen) {
                        dropdown.classList.add('open');
                        item.classList.add('active-dropdown'); // Optional: for styling active parent
                    } else {
                        item.classList.remove('active-dropdown');
                    }
                });
            }
        });
    }

    // Close main menu when clicking a link
    const pageLinks = document.querySelectorAll('.dropdown-item, .nav-link:not(:has(+ .dropdown))');
    pageLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- 3. Page Sidebar (Table of Contents) Toggle Logic ---
    const sidebarToggle = document.querySelector('.mobile-sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    // Only run if elements exist (pages with sidebar)
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent closing immediately
            sidebar.classList.toggle('active');
            
            // Update button text
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

        // Close sidebar when clicking a link inside it
        const sidebarLinks = sidebar.querySelectorAll('.sidebar-nav-link');
        sidebarLinks.forEach(link => {
            link.addEventListener('click', () => {
                sidebar.classList.remove('active');
                sidebarToggle.innerHTML = '☰ Page Menu';
            });
        });
    }
});