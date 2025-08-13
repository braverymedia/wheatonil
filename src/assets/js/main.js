/**
 * Main entry point for Wheaton College JavaScript
 * Initializes all modules and handles global functionality
 */

// Initialize wheaton namespace
window.wheaton = window.wheaton || {};

// Load utility functions first
import './utils/debounce.js';

// Load modules
import './modules/carousel.js';
import './modules/navigation.js';
import './modules/modal.js';
import './modules/accordion.js';
import './modules/marquee.js';
import './modules/faculty-filter.js';
import './modules/gallery-staggered.js';
import './modules/program-finder.js';

// Initialize modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Add has-js class to body
    document.body.classList.add('has-js');

    // Initialize modules
    const modules = [
        'navigation',
        'carousel',
        'modal',
        'accordion',
        'galleryStaggered',
        'marquee',
        'facultyFilter',
        'programFinder'
    ];

    modules.forEach(module => {
        if (window.wheaton[module] && typeof window.wheaton[module].init === 'function') {
            window.wheaton[module].init();
        }
    });
});
