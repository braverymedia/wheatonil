// Navigation Module
class Navigation {
    constructor() {
        this.isMobile = window.innerWidth < 1024;
        this.currentPanel = null;
        this.initialized = false;
        // Reusable bound handlers so add/removeEventListener use the same reference
        this.boundHoverIn = this.handleHoverIn.bind(this);
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
        this.menuLinks = this.overlay ? this.overlay.querySelector('.bm--menu-links') : null;
        // Sync initial ARIA/body state with dataset
        if (this.overlay) {
            const visible = this.overlay.dataset.state === 'visible';
            this.overlay.setAttribute('aria-hidden', visible ? 'false' : 'true');
            if (visible) {
                this.overlay.removeAttribute('inert');
            } else {
                this.overlay.setAttribute('inert', '');
            }
            document.body.classList.toggle('menu-open', visible);
            // If we load directly on desktop with overlay visible, prepare panels
            if (visible && !this.isMobile) {
                this.prepareDesktopPanels();
            }
        }
        
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
        
        // Handle hover on desktop (overlay-only, not footer)
        this.bindDesktopHover();

        // React to breakpoint changes and clear mobile state when entering desktop
        const mq = window.matchMedia('(min-width: 1024px)');
        const onChange = (e) => {
            this.isMobile = !e.matches; // desktop when matches === true
            if (e.matches) {
                // Entered desktop
                this.bindDesktopHover();
                // Prepare desktop view: ensure a single panel is shown
                this.prepareDesktopPanels();
                this.lockMenuHeightToTallest();
            } else {
                // Entered mobile
                this.unbindDesktopHover();
                // Remove any desktop inline overrides and collapse all
                this.clearDesktopPanelStyles();
                this.closeAllPanels();
                this.unlockMenuHeight();
            }
        };
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', onChange);
        } else if (typeof mq.addListener === 'function') {
            // Safari fallback
            mq.addListener(onChange);
        } else {
            window.addEventListener('resize', () => onChange({ matches: window.innerWidth >= 1024 }));
        }

        // Recompute locked height on general resizes within desktop
        this.boundResize = this.handleWindowResize.bind(this);
        window.addEventListener('resize', this.boundResize);
    }

    /**
     * Bind desktop hover handlers within the overlay only
     */
    bindDesktopHover() {
        if (this.isMobile || !this.overlay) return;
        if (this._desktopHoverBound) return;
        this.overlay.querySelectorAll('.nav-menu--header').forEach(header => {
            header.addEventListener('mouseenter', this.boundHoverIn);
        });
        this._desktopHoverBound = true;
    }

    /**
     * Unbind desktop hover handlers
     */
    unbindDesktopHover() {
        if (!this._desktopHoverBound || !this.overlay) return;
        this.overlay.querySelectorAll('.nav-menu--header').forEach(header => {
            header.removeEventListener('mouseenter', this.boundHoverIn);
        });
        this._desktopHoverBound = false;
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
        this.showPanelForHeader(header);
    }
    
    /**
     * Close all panels
     */
    closeAllPanels() {
        const scope = this.overlay || document;
        scope.querySelectorAll('.nav-menu--header').forEach(header => {
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
        // Defensive: remove expanded class from any panels in scope
        scope.querySelectorAll('.accordion-panel').forEach(panel => {
            panel.classList.remove('is-expanded');
        });
        // On desktop, ensure all panels in overlay are hidden when "closed"
        if (!this.isMobile && this.overlay) {
            this.overlay.querySelectorAll('.accordion-panel').forEach(panel => {
                this.setPanelVisibility(panel, false);
            });
        }
        
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
            // Accessibility and page state
            this.overlay.setAttribute('aria-hidden', 'false');
            this.overlay.removeAttribute('inert');
            document.body.classList.add('menu-open');
            
            // On mobile, close all panels initially
            if (this.isMobile) {
                this.closeAllPanels();
            } else {
                // On desktop, ensure a single panel is visible
                this.prepareDesktopPanels();
                this.lockMenuHeightToTallest();
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
            // Accessibility and page state
            this.overlay.setAttribute('aria-hidden', 'true');
            this.overlay.setAttribute('inert', '');
            document.body.classList.remove('menu-open');
            this.closeAllPanels();
            // Clear any desktop inline styles so CSS controls when reopened
            this.clearDesktopPanelStyles();
            this.unlockMenuHeight();
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
            // Ensure we remove the correct bound handler
            this.unbindDesktopHover();
        }
        if (this.boundResize) {
            window.removeEventListener('resize', this.boundResize);
        }
        
        this.initialized = false;
    }

    /**
     * Desktop helper: show only the panel for a given header
     */
    showPanelForHeader(header) {
        if (!header || this.isMobile || !this.overlay) return;
        const button = header.querySelector('.nav-menu--toggle');
        const panelId = button ? button.getAttribute('aria-controls') : null;
        const panel = panelId ? document.getElementById(panelId) : null;
        if (!panel) return;
        
        // Hide all panels first and clear any lingering expanded classes
        this.overlay.querySelectorAll('.accordion-panel').forEach(p => {
            // Remove class first to defeat any !important rules
            p.classList.remove('is-expanded');
            this.setPanelVisibility(p, false);
        });
        // Reset headers
        this.overlay.querySelectorAll('.nav-menu--header').forEach(h => {
            h.classList.remove('is-expanded');
            const b = h.querySelector('.nav-menu--toggle');
            if (b) b.setAttribute('aria-expanded', 'false');
        });
        
        // Show this one
        header.classList.add('is-expanded');
        panel.classList.add('is-expanded');
        if (button) button.setAttribute('aria-expanded', 'true');
        this.setPanelVisibility(panel, true);
        this.currentPanel = panel;
        // Keep container height stable while switching panels on desktop
        if (!this.isMobile) {
            this.lockMenuHeightToTallest();
        }
    }

    /**
     * Desktop helper: set a panel's visibility via inline styles (override CSS)
     */
    setPanelVisibility(panel, visible) {
        if (!panel) return;
        panel.style.display = visible ? 'block' : 'none';
        panel.setAttribute('aria-hidden', visible ? 'false' : 'true');
    }

    /**
     * Desktop helper: when entering desktop or opening overlay, choose a default panel
     */
    prepareDesktopPanels() {
        if (!this.overlay || this.isMobile) return;
        const headers = this.overlay.querySelectorAll('.nav-menu--header');
        if (!headers.length) return;
        // If any header is already expanded, honor it; else show first
        const expanded = Array.from(headers).find(h => h.classList.contains('is-expanded')) || headers[0];
        this.showPanelForHeader(expanded);
    }

    /**
     * Remove desktop-only inline visibility so CSS controls on mobile/closed
     */
    clearDesktopPanelStyles() {
        if (!this.overlay) return;
        this.overlay.querySelectorAll('.accordion-panel').forEach(panel => {
            panel.style.removeProperty('display');
            panel.removeAttribute('aria-hidden');
        });
    }

    /**
     * Measure tallest submenu panel and lock the grid container height to it (desktop only)
     */
    lockMenuHeightToTallest() {
        if (!this.menuLinks || this.isMobile) return;
        const tallest = this.measureTallestPanel();
        if (tallest > 0) {
            this.menuLinks.style.minHeight = `${tallest}px`;
        }
        // Re-check shortly after to account for late layout (e.g., fonts/images)
        clearTimeout(this._relockTimer);
        this._relockTimer = setTimeout(() => {
            const t2 = this.measureTallestPanel();
            if (t2 > 0) this.menuLinks.style.minHeight = `${t2}px`;
        }, 300);
    }

    /**
     * Remove any locked height from the menu container
     */
    unlockMenuHeight() {
        if (!this.menuLinks) return;
        this.menuLinks.style.removeProperty('min-height');
    }

    /**
     * Compute tallest panel height, even if currently hidden by display:none
     */
    measureTallestPanel() {
        if (!this.overlay) return 0;
        let max = 0;
        this.overlay.querySelectorAll('.accordion-panel').forEach(panel => {
            const cs = window.getComputedStyle(panel);
            const wasHidden = cs.display === 'none';
            const prev = {
                display: panel.style.display,
                visibility: panel.style.visibility,
                position: panel.style.position,
                maxHeight: panel.style.maxHeight,
                opacity: panel.style.opacity,
                pointerEvents: panel.style.pointerEvents,
            };
            if (wasHidden) {
                // Make measurable without affecting layout
                panel.style.visibility = 'hidden';
                panel.style.position = 'absolute';
                panel.style.display = 'block';
                panel.style.maxHeight = 'none';
                panel.style.opacity = '0';
                panel.style.pointerEvents = 'none';
            }
            const h = panel.scrollHeight;
            if (h > max) max = h;
            if (wasHidden) {
                panel.style.display = prev.display;
                panel.style.visibility = prev.visibility;
                panel.style.position = prev.position;
                panel.style.maxHeight = prev.maxHeight;
                panel.style.opacity = prev.opacity;
                panel.style.pointerEvents = prev.pointerEvents;
            }
        });
        return max;
    }

    /**
     * Handle window resize within desktop breakpoint; keep height locked accurately
     */
    handleWindowResize() {
        if (!this.isMobile) {
            this.lockMenuHeightToTallest();
        }
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
