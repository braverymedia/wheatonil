(function(wheaton) {
    'use strict';

    // DOM Elements
    let showOverlay, showSearch, hideOverlay, overlay;

    /**
     * Handle hover on desktop
     * @param {Event} event - The hover event
     */
    function handleHoverIn(event) {
        if (window.innerWidth >= 1024) {
            const header = event.currentTarget;
            const button = header.querySelector('.nav-menu--toggle');
            const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
            
            if (panel) {
                panel.classList.add('visible');
                header.classList.add('is-expanded');
                button.setAttribute('aria-expanded', 'true');
            }
        }
    }

    /**
     * Handle hover out on desktop
     * @param {Event} event - The hover out event
     */
    function handleHoverOut(event) {
        if (window.innerWidth >= 1024) {
            const header = event.currentTarget;
            const button = header.querySelector('.nav-menu--toggle');
            const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
            
            if (panel) {
                panel.classList.remove('visible');
                header.classList.remove('is-expanded');
                button.setAttribute('aria-expanded', 'false');
            }
        }
    }

    /**
     * Handle mobile touch interactions
     * @param {Event} event - The click event
     */
    function handleMobileClick(event) {
        event.stopPropagation();
        const target = event.target;

        // Handle button clicks (toggle panel)
        if (target.classList.contains('nav-menu--toggle')) {
            event.preventDefault();
            const header = target.closest('.nav-menu--header');
            const panel = document.getElementById(target.getAttribute('aria-controls'));
            const isExpanded = target.getAttribute('aria-expanded') === 'true';

            target.setAttribute('aria-expanded', `${!isExpanded}`);

            if (isExpanded) {
                header?.classList.remove('is-expanded');
                panel?.classList.remove('visible');
            } else {
                header?.classList.add('is-expanded');
                panel?.classList.add('visible');
            }
        } 
        // Handle link clicks inside header
        else if (target.closest('.nav-menu--header')) {
            const header = target.closest('.nav-menu--header');
            const link = header.querySelector('.nav-menu--link');
            const button = header.querySelector('.nav-menu--toggle');
            const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;

            // On mobile, if clicking the link and panel is closed, prevent default and open panel
            if (window.innerWidth < 1024 && target === link && panel && button.getAttribute('aria-expanded') === 'false') {
                event.preventDefault();
                button.setAttribute('aria-expanded', 'true');
                header.classList.add('is-expanded');
                panel.classList.add('visible');
            }
        }
    }

    /**
     * Main function to handle both hover and click events
     * @param {Event} event - The event to handle
     */
    function mobileSectionNav(event) {
        if (window.innerWidth >= 1024) {
            // On desktop, handle hover events
            if (event.type === 'mouseenter') {
                handleHoverIn(event);
            } else if (event.type === 'mouseleave') {
                handleHoverOut(event);
            }
        } else {
            // On mobile, handle click events
            handleMobileClick(event);
        }
    }

    /**
     * Open the overlay
     */
    function openOverlay() {
        if (showOverlay && showOverlay.getAttribute('aria-expanded') === 'false') {
            // Set expanded state
            showOverlay.setAttribute('aria-expanded', 'true');
            
            // Reset animations by temporarily removing the visible state
            if (overlay) {
                overlay.dataset.state = 'opening';
                
                // Force reflow to ensure the state is applied before adding visible state
                void overlay.offsetHeight;
                
                // Set the visible state to trigger animations
                overlay.dataset.state = 'visible';
            }
        }
    }

    /**
     * Close the overlay
     */
    function closeOverlay() {
        if (showOverlay) {
            showOverlay.setAttribute('aria-expanded', 'false');
        }
        if (overlay) {
            overlay.dataset.state = 'hidden';
        }
    }

    /**
     * Open the search overlay
     */
    function openSearch() {
        openOverlay();
        const searchInput = document.getElementById('site-search');
        if (searchInput) {
            searchInput.focus({ focusVisible: true });
        }
    }

    /**
     * Initialize navigation
     */
    function init() {
        // Cache DOM elements
        showOverlay = document.querySelector('.menu-more');
        showSearch = document.querySelector('button.search');
        hideOverlay = document.querySelector('.close-menu');
        overlay = document.querySelector("[data-feature='nav']");

        // Add event listeners for navigation headers
        const navHeaders = document.querySelectorAll('.nav-menu--header');
        navHeaders.forEach(header => {
            header.addEventListener('mouseenter', mobileSectionNav);
            header.addEventListener('mouseleave', mobileSectionNav);
            header.addEventListener('click', mobileSectionNav);
        });

        // Add event listeners for overlay
        if (showOverlay) showOverlay.addEventListener('click', openOverlay);
        if (showSearch) showSearch.addEventListener('click', openSearch);
        if (hideOverlay) hideOverlay.addEventListener('click', closeOverlay);
    }

    // Public API
    wheaton.navigation = {
        init,
        openOverlay,
        closeOverlay,
        openSearch
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});
