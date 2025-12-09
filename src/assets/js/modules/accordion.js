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
                panel.classList.remove('is-expanded');
            } else {
                panel.removeAttribute('hidden');
                panel.classList.add('visible');
                panel.classList.add('is-expanded');
            }
        }
    }

    /**
     * Get the associated panel element for a given accordion button
     * @param {HTMLButtonElement} button
     * @returns {HTMLElement|null}
     */
    function getPanelForButton(button) {
        const panelId = button.getAttribute('aria-controls');
        if (panelId) {
            const byId = document.getElementById(panelId);
            if (byId) return byId;
        }
        // Fallback to sibling (old structure)
        return button.parentNode ? button.parentNode.nextElementSibling : null;
    }

    /**
     * Apply state for accordions based on viewport and container type.
     * - Containers marked with [data-mobilemenu] collapse only on mobile (<=1024px)
     * - Other accordions retain original behavior
     */
    function applyResponsiveState() {
        const isMobile = window.matchMedia('(max-width: 1024px)').matches;
        const buttons = document.querySelectorAll('[data-accordion] [aria-expanded]');

        buttons.forEach(button => {
            const container = button.closest('[data-accordion]');
            const isMobileMenu = container && container.hasAttribute('data-mobilemenu');
            const panel = getPanelForButton(button);
            if (!panel) return;

            // Always remove previous listener to avoid duplicates
            button.removeEventListener('click', handleAccordionClick);

            if (isMobileMenu) {
                if (isMobile) {
                    // Mobile: collapse/expand based on aria-expanded
                    const isExpanded = button.getAttribute('aria-expanded') === 'true';
                    if (!isExpanded) {
                        panel.setAttribute('hidden', '');
                        panel.classList.remove('visible');
                        panel.classList.remove('is-expanded');
                    } else {
                        panel.removeAttribute('hidden');
                        panel.classList.add('visible');
                        panel.classList.add('is-expanded');
                    }
                    // Ensure button is operable on mobile
                    button.removeAttribute('disabled');
                    button.addEventListener('click', handleAccordionClick);
                } else {
                    // Desktop: force open, no collapsing
                    button.setAttribute('aria-expanded', 'true');
                    panel.removeAttribute('hidden');
                    panel.classList.add('visible');
                    panel.classList.add('is-expanded');
                    // Make button non-interactive and non-focusable on desktop
                    button.setAttribute('disabled', '');
                    // No click handler on desktop
                }
            } else {
                // Non-mobilemenu accordions: preserve original behavior
                const isExpanded = button.getAttribute('aria-expanded') === 'true';
                if (!isExpanded) {
                    panel.setAttribute('hidden', '');
                    panel.classList.remove('visible');
                } else {
                    panel.removeAttribute('hidden');
                    panel.classList.add('visible');
                }
                button.addEventListener('click', handleAccordionClick);
            }
        });
    }


    /**
     * Initialize all accordions on the page
     */
    function init() {
        // Initial application
        applyResponsiveState();

        // Re-apply on breakpoint change
        const mq = window.matchMedia('(max-width: 1024px)');
        if (typeof mq.addEventListener === 'function') {
            mq.addEventListener('change', applyResponsiveState);
        } else if (typeof mq.addListener === 'function') {
            // Safari fallback
            mq.addListener(applyResponsiveState);
        } else {
            // Ultimate fallback
            window.addEventListener('resize', applyResponsiveState);
        }
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
