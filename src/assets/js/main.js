/**
 * Main entry point for Wheaton College JavaScript
 * Initializes all modules and handles global functionality
 */

console.log('Main: Main.js file loaded');

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
import './modules/hero-caption.js';

console.log('Main: All modules imported');

// Function to initialize modules
function initializeModules() {
    console.log('Main: DOM ready, initializing modules');
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
        'programFinder',
        'heroCaption'
    ];

    console.log('Main: Initializing modules', modules);

    modules.forEach(module => {
        console.log(`Main: Checking module ${module}`, {
            exists: !!window.wheaton[module],
            hasInit: !!(window.wheaton[module] && typeof window.wheaton[module].init === 'function')
        });
        
        if (window.wheaton[module] && typeof window.wheaton[module].init === 'function') {
            console.log(`Main: Initializing ${module}`);
            window.wheaton[module].init();
        } else {
            console.warn(`Main: Module ${module} not found or missing init function`);
        }
    });
}

// Initialize modules when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeModules);
} else {
    // DOM is already ready
    initializeModules();
}
