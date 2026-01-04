/* script.js */

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.search-btn');
    const searchInput = document.querySelector('.search-input');
    const searchSelect = document.querySelector('.search-select');

    // Simple Search Redirection Logic
    if(searchBtn) {
        searchBtn.addEventListener('click', performSearch);
    }
    
    if(searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') performSearch();
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();
        const scope = searchSelect.value;
        
        if(!query) return;

        alert(`Search Functionality: \nLooking for "${query}" in the ${scope} section.\n(Note: Connect this to a static search index like Pagefind for real results!)`);
        
        // Example implementation if you had Google Site Search:
        // window.location.href = `https://www.google.com/search?q=site:yourwebsite.com+${query}+${scope}`;
    }

    // Highlight active link in sidebar
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar a');
    
    sidebarLinks.forEach(link => {
        if(link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
});
