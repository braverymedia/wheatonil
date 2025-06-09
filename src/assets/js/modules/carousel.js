(function(wheaton) {
    'use strict';

    let carousels = [];

    /**
     * Initialize carousel resizing
     */
    function initResizing() {
        const resizeCarousels = wheaton.utils.debounce(() => {
            carousels.forEach(carousel => {
                if (carousel.items) {
                    carousel.items.style.width = '';
                    carousel.items.style.flexShrink = 1;
                    carousel.items.style.setProperty('--offset', '0 !important');
                }
            });

            carousels.forEach(carousel => {
                if (carousel.items) {
                    resizeCarousel(carousel);
                }
            });
        }, 100);

        resizeCarousels();
        window.addEventListener('resize', resizeCarousels);
    }


    /**
     * Resize a single carousel
     * @param {Object} carousel - The carousel to resize
     */
    function resizeCarousel(carousel) {
        if (!carousel.element || !carousel.items) return;

        const shouldExpand = carousel.element.getAttribute('data-bravery-carousel-breakout') === 'expand';
        const computedStyles = getComputedStyle(carousel.items);
        const gap = computedStyles.getPropertyValue('--gap') || '0px';
        const columns = computedStyles.getPropertyValue('--columns');

        if (!columns) return;

        const containerWidth = carousel.items.offsetWidth;
        const containerOffsetToRightOfScreen = Math.round(
            window.innerWidth - carousel.items.getBoundingClientRect().right
        );

        const newContainerWidth = containerWidth + containerOffsetToRightOfScreen;
        const relativeContainerWidth = shouldExpand
            ? 100
            : (containerWidth / newContainerWidth) * 100;

        carousel.items.style.setProperty(
            '--width',
            `calc((${relativeContainerWidth}% - (${gap} * ${columns} - ${gap})) / ${columns})`
        );

        carousel.items.style.setProperty(
            '--offset',
            shouldExpand ? '0' : `${containerOffsetToRightOfScreen}px`
        );

        carousel.items.style.width = `${newContainerWidth}px`;
        carousel.items.style.flexShrink = 0;
    }

    /**
     * Initialize a single carousel
     * @param {Object} carousel - The carousel to initialize
     */
    function initCarousel(carousel) {
        const items = carousel.element.querySelector('[data-bravery-carousel-items]');
        const prevButton = carousel.element.querySelector('[data-bravery-carousel-prev]');
        const nextButton = carousel.element.querySelector('[data-bravery-carousel-next]');

        // Update carousel with DOM elements
        carousel.items = items;
        carousel.prevButton = prevButton;
        carousel.nextButton = nextButton;

        if (!items) return;

        // Initialize carousel controls if they exist
        if (prevButton && nextButton) {
            setupCarouselControls(carousel);
        }
    }

    /**
     * Set up carousel navigation controls
     * @param {Object} carousel - The carousel to set up controls for
     */
    function setupCarouselControls(carousel) {
        const { items, prevButton, nextButton } = carousel;

        const getClosestItem = () => {
            const children = items.children;
            if (!children.length) return null;

            const parentRect = items.getBoundingClientRect();
            const parentX = parentRect.x;

            return Array.from(children).reduce((closest, child) => {
                const rect = child.getBoundingClientRect();
                const x = rect.x;

                if (!closest.child) return { x, child };
                return Math.abs(x - parentX) < Math.abs(closest.x - parentX) 
                    ? { x, child } 
                    : closest;
            }, { x: 0, child: null }).child;
        };

        prevButton.addEventListener('click', () => {
            const closestItem = getClosestItem();
            if (!closestItem) return;

            let prevItem = closestItem.previousElementSibling || items.lastElementChild;
            const distanceToScroll = prevItem.offsetWidth;

            items.scrollTo({
                left: items.scrollLeft - distanceToScroll,
                behavior: 's'
            });
        });

        nextButton.addEventListener('click', () => {
            const closestItem = getClosestItem();
            if (!closestItem) return;

            items.scrollTo({
                left: items.scrollLeft + closestItem.offsetWidth,
                behavior: 's'
            });
        });

        items.addEventListener('scroll', wheaton.utils.debounce(() => {
            const itemsScrollWidth = items.scrollWidth;
            const itemsOuterWidth = items.clientWidth;

            prevButton.removeAttribute('disabled');
            nextButton.removeAttribute('disabled');

            if (items.scrollLeft <= 0) {
                prevButton.setAttribute('disabled', '');
            }

            if (Math.ceil(items.scrollLeft) >= itemsScrollWidth - itemsOuterWidth) {
                nextButton.setAttribute('disabled', '');
            }
        }, 100));
    }

    /**
     * Initialize all carousels on the page
     */
    function init() {
        const carouselElements = document.querySelectorAll('[data-bravery-carousel]');
        
        carousels = Array.from(carouselElements).map((element, index) => ({
            id: index + 1,
            element
        }));

        carousels.forEach(carousel => {
            initCarousel(carousel);
            carousel.element.setAttribute('data-bravery-carousel-init', '');
        });

        if (carousels.length) {
            initResizing();
        }
    }

    // Public API
    wheaton.carousel = {
        init,
        carousels: () => carousels
    };

    // Auto-initialize
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})(window.wheaton = window.wheaton || {});
