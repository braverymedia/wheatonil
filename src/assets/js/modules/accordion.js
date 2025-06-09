(function(wheaton) {
    'use strict';

    /**
     * Handle accordion click events
     * @param {Event} event - The click event
     */
    function handleAccordionClick(event) {
        const target = event.target;
        if (target instanceof HTMLButtonElement) {
            const panel = target.parentNode.nextElementSibling;
            const isExpanded = target.getAttribute('aria-expanded') === 'true';

            target.setAttribute('aria-expanded', `${!isExpanded}`);

            if (isExpanded) {
                panel.setAttribute('hidden', '');
                panel.classList.remove('visible');
            } else {
                panel.removeAttribute('hidden');
                panel.classList.add('visible');
            }
        }
    }


    /**
     * Initialize all accordions on the page
     */
    function init() {
        const accordions = document.querySelectorAll('[data-accordion] [aria-expanded]');
        
        accordions.forEach(accordion => {
            // Set initial state based on existing attributes
            const isExpanded = accordion.getAttribute('aria-expanded') === 'true';
            const panel = document.getElementById(accordion.getAttribute('aria-controls'));
            
            if (panel) {
                if (!isExpanded) {
                    panel.setAttribute('hidden', '');
                } else {
                    panel.classList.add('visible');
                }
            }
            
            // Add click event
            accordion.addEventListener('click', handleAccordionClick);
        });
    }

    // Public API
    wheaton.accordion = {
        init
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});
