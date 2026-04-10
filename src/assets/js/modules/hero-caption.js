/**
 * Hero Caption Module
 * Handles photo caption toggle functionality for hero components
 */

console.log('HeroCaption: Module file loaded');

(function() {
    'use strict';

    // Initialize wheaton namespace
    window.wheaton = window.wheaton || {};

    const HeroCaption = {
        init: function() {
            console.log('HeroCaption: Initializing module');
            this.bindEvents();
        },

        bindEvents: function() {
            const captionToggle = document.querySelector('[data-caption-toggle]');
            const captionClose = document.querySelector('[data-caption-close]');
            const caption = document.getElementById('hero-caption');
            
            console.log('HeroCaption: Elements found', {
                captionToggle: !!captionToggle,
                captionClose: !!captionClose,
                caption: !!caption
            });
            
            if (captionToggle && caption) {
                // Handle click activation
                captionToggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    HeroCaption.toggleCaption(caption, captionToggle, captionClose);
                });
                
                // Handle keyboard activation (Enter/Space) - WCAG 2.2 requirement
                captionToggle.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        HeroCaption.toggleCaption(caption, captionToggle, captionClose);
                    }
                });
            }
            
            if (captionClose && caption) {
                // Handle close button click
                captionClose.addEventListener('click', (e) => {
                    e.preventDefault();
                    HeroCaption.hideCaption(caption, captionToggle);
                });
                
                // Handle close button keyboard activation (Enter/Space)
                captionClose.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        HeroCaption.hideCaption(caption, captionToggle);
                    }
                });
            }
            
            // Close caption on Escape key
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && caption && !caption.hasAttribute('hidden')) {
                    HeroCaption.hideCaption(caption, captionToggle);
                }
            });
            
            // Close caption when clicking outside the popover
            document.addEventListener('click', (e) => {
                if (caption && !caption.hasAttribute('hidden') && 
                    !caption.contains(e.target) && 
                    !captionToggle.contains(e.target)) {
                    HeroCaption.hideCaption(caption, captionToggle);
                }
            });
        },

        toggleCaption: function(caption, captionToggle, captionClose) {
            console.log('HeroCaption: Toggle clicked');
            const isHidden = caption.hasAttribute('hidden');
            if (isHidden) {
                HeroCaption.showCaption(caption, captionToggle, captionClose);
            } else {
                HeroCaption.hideCaption(caption, captionToggle);
            }
        },

        showCaption: function(caption, captionToggle, captionClose) {
            // Populate caption from image attributes before showing
            HeroCaption.populateCaption();
            // Show caption section
            caption.removeAttribute('hidden');
            captionToggle.setAttribute('aria-expanded', 'true');
            
            // Announce to screen readers
            this.announce('Photo caption displayed');
            // Focus management for accessibility
            setTimeout(() => {
                captionClose?.focus();
            }, 100);
        },

        hideCaption: function(caption, captionToggle) {
            caption.setAttribute('hidden', '');
            captionToggle.setAttribute('aria-expanded', 'false');
            // Announce to screen readers
            this.announce('Photo caption hidden');
            // Return focus to toggle button
            captionToggle.focus();
        },

        announce: function(message) {
            // Create or reuse live region for screen reader announcements (WCAG 2.2)
            let liveRegion = document.getElementById('hero-caption-live-region');
            if (!liveRegion) {
                liveRegion = document.createElement('div');
                liveRegion.id = 'hero-caption-live-region';
                liveRegion.setAttribute('aria-live', 'polite');
                liveRegion.setAttribute('aria-atomic', 'true');
                liveRegion.className = 'sr-only';
                document.body.appendChild(liveRegion);
            }
            liveRegion.textContent = message;
        },

        populateCaption: function() {
            console.log('HeroCaption: Populating caption');
            const heroImage = document.querySelector('.bm-hero-news--background img');
            const figcaption = document.querySelector('.bm-hero-news figcaption');
            const captionText = document.querySelector('.bm-hero-news--caption-text');
            
            console.log('HeroCaption: Caption elements', {
                heroImage: !!heroImage,
                figcaption: !!figcaption,
                captionText: !!captionText
            });
            
            if (!captionText) return;
            
            // Prefer figcaption text; fallback to image title; do not use alt for tooltip
            let tooltip = '';
            const creditText = figcaption?.textContent?.trim() || '';
            if (creditText) {
                tooltip = creditText;
            } else if (heroImage && heroImage.title) {
                tooltip = heroImage.title;
            }
            
            if (!tooltip) {
                tooltip = 'Photo information';
            }
            
            console.log('HeroCaption: Tooltip text', tooltip);
            captionText.innerHTML = `<p>${this.escapeHtml(tooltip)}</p>`;
        },

        escapeHtml: function(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
    };

    // Export to wheaton namespace
    window.wheaton.heroCaption = HeroCaption;
    console.log('HeroCaption: Module exported to window.wheaton.heroCaption');

})();
