// Navigation Module
class Navigation {
    constructor() {
        this.isMobile = window.innerWidth < 1024;
        this.currentPanel = null;
        this.initialized = false;
        this.init();
    }

    /**
     * Initialize navigation
     */
    init() {
        if (this.initialized) return;
        
        this.overlay = document.querySelector("[data-feature='nav']");
        this.showOverlay = document.querySelector('.menu-more');
        this.showSearch = document.querySelector('button.search');
        this.hideOverlay = document.querySelector('.close-menu');
        
        this.setupEventListeners();
        this.initialized = true;
        
        // Expose public methods
        window.wheaton = window.wheaton || {};
        window.wheaton.navigation = {
            openOverlay: this.openOverlay.bind(this),
            closeOverlay: this.closeOverlay.bind(this),
            openSearch: this.openSearch.bind(this)
        };
    }
    
    /**
     * Set up event listeners
     */
    setupEventListeners() {
        // Overlay controls
        if (this.showOverlay) {
            this.showOverlay.addEventListener('click', this.openOverlay.bind(this));
        }
        if (this.hideOverlay) {
            this.hideOverlay.addEventListener('click', this.closeOverlay.bind(this));
        }
        if (this.showSearch) {
            this.showSearch.addEventListener('click', this.openSearch.bind(this));
        }
        
        // Navigation headers
        document.addEventListener('click', this.handleDocumentClick.bind(this));
        
        // Handle hover on desktop
        if (!this.isMobile) {
            document.querySelectorAll('.nav-menu--header').forEach(header => {
                header.addEventListener('mouseenter', this.handleHoverIn.bind(this));
            });
        }
    }
    
    /**
     * Check if the device is a touch device
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Handle document click events
     */
    handleDocumentClick(event) {
        console.log('Document click detected');
        const target = event.target;
        const header = target.closest('.nav-menu--header');
        
        if (!header) {
            console.log('Click outside header, ignoring');
            return;
        }
        
        console.log('Header clicked:', header);
        const isToggle = target.classList.contains('nav-menu--toggle');
        const headerLink = header.querySelector('a');
        const isHeaderLink = target === headerLink || headerLink.contains(target);
        
        // Handle mobile interactions or touch devices at any size
        if (this.isMobile || this.isTouchDevice()) {
            console.log('Mobile/touch interaction detected');
            const isExpanded = header.classList.contains('is-expanded');
            
            // If clicking the header link directly and panel is open, let it follow the link
            if (isHeaderLink && isExpanded) {
                console.log('Header link clicked with open panel - allowing navigation');
                return; // Allow default link behavior
            }
            
            // For all other cases, toggle the panel
            console.log('Toggling panel for header:', header);
            event.preventDefault();
            event.stopPropagation();
            this.togglePanel(header);
            return;
        }
        
        // Desktop non-touch: always allow link clicks and don't prevent default
        if (isHeaderLink) {
            console.log('Desktop non-touch: allowing link navigation');
            return;
        }
        
        // Handle toggle button clicks on desktop
        if (isToggle) {
            event.preventDefault();
            event.stopPropagation();
            this.togglePanel(header);
        }
    }
    
    /**
     * Toggle a panel's visibility
     */
    togglePanel(header) {
        console.log('togglePanel called for header:', header);
        const button = header.querySelector('.nav-menu--toggle');
        if (!button) {
            console.error('No toggle button found in header');
            return;
        }
        
        const panelId = button.getAttribute('aria-controls');
        console.log('Panel ID from button:', panelId);
        const panel = panelId ? document.getElementById(panelId) : null;
        
        if (!panel) {
            console.error('No panel found with ID:', panelId);
            return;
        }
        
        console.log('Panel found:', panel);
        const isExpanded = header.classList.contains('is-expanded');
        console.log('Current expanded state:', isExpanded);
        
        if (isExpanded) {
            // Close this panel
            console.log('Closing panel');
            header.classList.remove('is-expanded');
            panel.classList.remove('is-expanded');
            button.setAttribute('aria-expanded', 'false');
            this.currentPanel = null;
        } else {
            // Close other panels and open this one
            console.log('Opening panel');
            this.closeAllPanels();
            header.classList.add('is-expanded');
            panel.classList.add('is-expanded');
            button.setAttribute('aria-expanded', 'true');
            this.currentPanel = panel;
        }
        
        console.log('Header classes after toggle:', header.className);
        console.log('Panel classes after toggle:', panel.className);
    }
    
    /**
     * Handle hover in on desktop
     */
    handleHoverIn(event) {
        const header = event.currentTarget;
        const button = header.querySelector('.nav-menu--toggle');
        const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
        
        if (!panel) return;
        
        // Close other panels
        this.closeAllPanels();
        
        // Open this panel - use same classes as mobile for consistency
        header.classList.add('is-expanded');
        panel.classList.add('is-expanded');
        button.setAttribute('aria-expanded', 'true');
        this.currentPanel = panel;
    }
    
    /**
     * Close all panels
     */
    closeAllPanels() {
        document.querySelectorAll('.nav-menu--header').forEach(header => {
            if (header.classList.contains('is-expanded')) {
                const button = header.querySelector('.nav-menu--toggle');
                const panel = button ? document.getElementById(button.getAttribute('aria-controls')) : null;
                
                if (button) {
                    header.classList.remove('is-expanded');
                    if (panel) panel.classList.remove('is-expanded');
                    button.setAttribute('aria-expanded', 'false');
                }
            }
        });
        
        this.currentPanel = null;
    }
    
    /**
     * Open the overlay
     */
    openOverlay(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (this.overlay) {
            this.overlay.dataset.state = 'visible';
            
            // On mobile, close all panels initially
            if (this.isMobile) {
                this.closeAllPanels();
            }
        }
    }
    
    /**
     * Close the overlay
     */
    closeOverlay(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        if (this.overlay) {
            this.overlay.dataset.state = 'hidden';
            this.closeAllPanels();
        }
    }
    
    /**
     * Open search overlay
     */
    openSearch(event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        this.openOverlay();
        
        // Focus search input after overlay animation completes
        setTimeout(() => {
            const searchInput = document.getElementById('query');
            if (searchInput) {
                searchInput.focus({ preventScroll: true });
            }
        }, 400); // Match the overlay transition duration
    }
    
    /**
     * Clean up event listeners
     */
    destroy() {
        // Remove all event listeners
        if (this.showOverlay) {
            this.showOverlay.removeEventListener('click', this.openOverlay);
        }
        if (this.hideOverlay) {
            this.hideOverlay.removeEventListener('click', this.closeOverlay);
        }
        if (this.showSearch) {
            this.showSearch.removeEventListener('click', this.openSearch);
        }
        
        document.removeEventListener('click', this.handleDocumentClick);
        
        if (!this.isMobile) {
            document.querySelectorAll('.nav-menu--header').forEach(header => {
                header.removeEventListener('mouseenter', this.handleHoverIn);
            });
        }
        
        this.initialized = false;
    }
}

// Initialize
let navigation;

function initNavigation() {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        navigation = new Navigation();
    } else {
        document.addEventListener('DOMContentLoaded', () => {
            navigation = new Navigation();
        });
    }
}

// Start initialization
initNavigation();

// For backward compatibility
const wheaton = window.wheaton || {};
