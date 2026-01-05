/* mobile-menu.js */

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.header-content-wrapper');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle Mobile Menu
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Handle Mobile Submenus
    // On mobile, clicking a parent link with a dropdown should toggle the dropdown, not go to link immediately (or we need an arrow)
    // Here we implement: Click once to open dropdown, Click again to go to link
    
    if (window.innerWidth <= 900) {
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown');

            if (dropdown) {
                link.addEventListener('click', (e) => {
                    // Check if dropdown is already open
                    const isOpen = dropdown.classList.contains('mobile-visible');
                    
                    if (!isOpen) {
                        e.preventDefault(); // Stop navigation
                        
                        // Close other open dropdowns (accordion style)
                        document.querySelectorAll('.dropdown').forEach(d => {
                            d.classList.remove('mobile-visible');
                        });
                        
                        dropdown.classList.add('mobile-visible');
                    }
                    // If already open, let the link work naturally
                });
            }
        });
    }

    // Close menu when clicking a link (that isn't a parent with submenu)
    document.querySelectorAll('.dropdown-item, .nav-link:not(:has(+ .dropdown))').forEach(n => {
        n.addEventListener('click', () => {
            if (!n.closest('.nav-item').querySelector('.dropdown')) {
                 hamburger.classList.remove('active');
                 navMenu.classList.remove('active');
            } else {
                 // It's a dropdown item, close menu
                 hamburger.classList.remove('active');
                 navMenu.classList.remove('active');
            }
        });
    });
});
