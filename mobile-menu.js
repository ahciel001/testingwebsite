/* mobile-menu.js */

document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.header-content-wrapper');
    const navItems = document.querySelectorAll('.nav-item');

    // Toggle Main Menu (Burger)
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Handle Mobile Accordion Logic
    if (window.innerWidth <= 900) {
        navItems.forEach(item => {
            const link = item.querySelector('.nav-link');
            const dropdown = item.querySelector('.dropdown');

            // Only apply logic if the item actually has a dropdown
            if (dropdown) {
                link.addEventListener('click', (e) => {
                    e.preventDefault(); // Stop the link from loading the page
                    e.stopPropagation(); // Stop bubbling
                    
                    const isOpen = dropdown.classList.contains('open');

                    // Close all other dropdowns first (Accordion style)
                    document.querySelectorAll('.dropdown').forEach(d => {
                        d.classList.remove('open');
                    });

                    // If it wasn't open, open it now
                    if (!isOpen) {
                        dropdown.classList.add('open');
                    }
                });
            }
        });
    }

    // Close menu when clicking an actual page link (Dropdown Items)
    const pageLinks = document.querySelectorAll('.dropdown-item, .nav-link:not(:has(+ .dropdown))');
    pageLinks.forEach(link => {
        link.addEventListener('click', () => {
            // Close the whole mobile menu
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
});
