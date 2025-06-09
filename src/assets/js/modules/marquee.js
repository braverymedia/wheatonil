(function(wheaton) {
    'use strict';

    let marquees = [];

    /**
     * Initialize a marquee
     * @param {Object} marquee - The marquee to initialize
     */
    function initMarquee(marquee) {
        const items = marquee.element.querySelectorAll('picture');
        if (!items.length) return;

        const images = [...items];
        const half = Math.ceil(images.length / 2);
        const firstHalf = images.slice(0, half);
        const secondHalf = images.slice(half);

        // Create groups
        const column = marquee.element.querySelector('.bm-gallery-col');
        if (!column) return;

        const group = document.createElement('div');
        group.className = 'bm-marquee--group';

        // Create first group and its copy
        const group1 = group.cloneNode(true);
        group1.append(...firstHalf);
        const group1Copy = group1.cloneNode(true);
        
        // Create second group and its copy
        const group2 = group.cloneNode(true);
        group2.append(...secondHalf);
        const group2Copy = group2.cloneNode(true);

        // Set aria-hidden on copies for better accessibility
        group1Copy.setAttribute('aria-hidden', 'true');
        group2Copy.setAttribute('aria-hidden', 'true');

        // Create reversed column for second group
        const reversed = document.createElement('section');
        reversed.className = 'bm-gallery-col bm-marquee';
        reversed.setAttribute('data-direction', 'reverse');

        // Build the marquee structure
        column.innerHTML = '';
        column.append(group1, group1Copy);
        reversed.append(group2, group2Copy);
        marquee.element.append(reversed);
    }

    /**
     * Initialize all marquees on the page
     */
    function init() {
        const marqueeElements = document.querySelectorAll('.bm-gallery--marquee');
        
        marquees = Array.from(marqueeElements).map((element, index) => ({
            id: index + 1,
            element
        }));

        marquees.forEach(marquee => {
            initMarquee(marquee);
        });
    }

    // Public API
    wheaton.marquee = {
        init,
        marquees: () => marquees
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});
