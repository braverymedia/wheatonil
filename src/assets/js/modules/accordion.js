(function(wheaton) {
    'use strict';

    /**
     * Handle accordion click events
     * @param {Event} event - The click event
     */
    function handleAccordionClick(event) {
        const target = event.target;
        if (target instanceof HTMLButtonElement) {
            let panel;
            const panelId = target.getAttribute('aria-controls');

            // Try to find panel by ID first (new structure)
            if (panelId) {
                panel = document.getElementById(panelId);
            }

            // Fallback to sibling (old structure)
            if (!panel) {
                panel = target.parentNode.nextElementSibling;
            }

            if (!panel) {
                console.warn('No panel found for accordion button:', target);
                return;
            }

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
            const panelId = accordion.getAttribute('aria-controls');
            let panel = null;

            // Try to find panel by ID first (new structure)
            if (panelId) {
                panel = document.getElementById(panelId);
            }

            // Fallback to sibling (old structure)
            if (!panel) {
                panel = accordion.parentNode.nextElementSibling;
            }

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
