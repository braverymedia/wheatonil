(function(wheaton) {
    'use strict';

    class StaggeredGallery {
        constructor(container) {
            this.container = container;
            this.wrapper = container.closest('.staggered-gallery');
            this.items = Array.from(container.children);
            this.isAnimating = false;
            this.scrollTimeout = null;
            this.resizeTimeout = null;
            
            // Only initialize if there are items
            if (this.items.length === 0) return;

            this.init();
        }

        init() {
            this.isAnimating = false;
            
            // Set up the layout first
            this.setupLayout();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize navigation
            this.setupNavigation();
            
            // Initial button state
            this.updateButtonStates();
            
            // Center the middle item in the container without affecting viewport scroll
            requestAnimationFrame(() => {
                if (this.items.length > 0) {
                    const middleIndex = Math.floor(this.items.length / 2);
                    this.jumpToItem(middleIndex);
                }
            });
        }
        
        cloneItems() {
            if (this.items.length < 2) return;
            
            // Clone first and last items
            const firstItem = this.items[0].cloneNode(true);
            const lastItem = this.items[this.items.length - 1].cloneNode(true);
            
            firstItem.classList.add('is-clone', 'is-first-clone');
            lastItem.classList.add('is-clone', 'is-last-clone');
            
            // Add clones to DOM
            this.container.insertBefore(lastItem, this.items[0]);
            this.container.appendChild(firstItem);
            
            // Update items reference
            this.items = Array.from(this.container.children);
            
            // Recalculate layout after adding clones
            this.calculateLayout();
        }
        
        setupEventListeners() {
            // Handle scroll events
            this.container.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Add scroll event
            this.container.addEventListener('scroll', () => this.handleScroll());
            
            // Add resize event
            window.addEventListener('resize', () => this.handleResize());
            
            // Add touch events to prevent interference with scroll
            this.container.addEventListener('touchstart', (e) => this.handleTouchStart(e));
            this.container.addEventListener('touchend', (e) => this.handleTouchEnd(e));
            
            // Set up navigation controls
            this.setupNavigation();
            
            // Show/hide navigation on desktop
            this.toggleNavigation(window.innerWidth >= 1024);
            window.addEventListener('resize', () => {
                this.toggleNavigation(window.innerWidth >= 1024);
            });
        }
        
        handleScroll() {
            if (this.isAnimating) return;
            
            // Clear any pending scroll timeout
            if (this.scrollTimeout) {
                clearTimeout(this.scrollTimeout);
            }
            
            // Debounce scroll events
            this.scrollTimeout = setTimeout(() => {
                this.checkScrollPosition();
            }, 100);
        }
        
        checkScrollPosition() {
            if (this.isAnimating) return;
            
            const container = this.container;
            const { scrollLeft, scrollWidth, clientWidth } = container;
            const scrollRight = scrollWidth - clientWidth - scrollLeft;
            const threshold = 100; // pixels from edge to trigger the jump
            
            // If scrolled to the first clone (last real item)
            if (scrollLeft < threshold) {
                this.updateItems('prev');
            } 
            // If scrolled to the last clone (first real item)
            else if (scrollRight < threshold) {
                this.updateItems('next');
            }
        }
        
        updateItems(direction) {
            if (this.isUpdating) return;
            this.isUpdating = true;
            
            // Update the current index
            if (direction === 'next') {
                this.currentIndex = (this.currentIndex + 1) % this.realItems.length;
            } else {
                this.currentIndex = (this.currentIndex - 1 + this.realItems.length) % this.realItems.length;
            }
            
            // Get current scroll position
            const container = this.container;
            const scrollLeft = container.scrollLeft;
            const scrollWidth = container.scrollWidth;
            
            // Set up new items
            this.setupInfiniteItems();
            
            // Restore scroll position after DOM update
            requestAnimationFrame(() => {
                // Calculate the new scroll position to maintain visual continuity
                container.scrollLeft = direction === 'next' ? 
                    (scrollLeft - (scrollWidth - container.scrollWidth)) : 
                    scrollLeft;
                
                this.isUpdating = false;
            });
        }
        
        jumpToItem(index) {
            this.isAnimating = true;
            const container = this.container;
            const item = this.items[index];
            
            // Temporarily disable smooth scrolling
            const originalScrollBehavior = container.style.scrollBehavior;
            container.style.scrollBehavior = 'auto';
            
            // Calculate centered position
            const containerCenter = container.clientWidth / 2;
            const itemCenter = item.offsetLeft + (item.offsetWidth / 2);
            const targetScroll = itemCenter - containerCenter;
            
            // Make the jump
            container.scrollLeft = targetScroll;
            
            // Restore smooth scrolling
            requestAnimationFrame(() => {
                container.style.scrollBehavior = originalScrollBehavior || 'smooth';
                this.isAnimating = false;
            });
        }
        
        navigate(direction) {
            if (this.isAnimating || this.isUpdating) return;
            this.isAnimating = true;
            
            const container = this.container;
            const items = Array.from(container.children);
            if (items.length === 0) return;
            
            // Get the first fully visible item
            let targetIndex = -1;
            const containerRect = container.getBoundingClientRect();
            const containerCenter = containerRect.left + (containerRect.width / 2);
            
            // Find the item closest to the center
            let closestDistance = Infinity;
            items.forEach((item, index) => {
                const itemRect = item.getBoundingClientRect();
                const itemCenter = itemRect.left + (itemRect.width / 2);
                const distance = Math.abs(itemCenter - containerCenter);
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    targetIndex = index;
                }
            });
            
            if (targetIndex === -1) {
                this.isAnimating = false;
                return;
            }
            
            // Determine the next/previous index based on direction
            let nextIndex = direction === 'next' ? targetIndex + 1 : targetIndex - 1;
            
            // Handle wrapping around
            if (nextIndex >= items.length) {
                nextIndex = 0;
                // If we're at the end and going next, wrap to the first item
                if (direction === 'next') {
                    // Scroll to the first item
                    this.scrollToItem(items[0]);
                } else {
                    // Scroll to the previous item
                    this.scrollToItem(items[targetIndex - 1] || items[items.length - 1]);
                }
            } else if (nextIndex < 0) {
                // If we're at the start and going previous, wrap to the last item
                nextIndex = items.length - 1;
                this.scrollToItem(items[nextIndex]);
            } else {
                // Normal case - scroll to next/previous item
                this.scrollToItem(items[nextIndex]);
            }
            
            // Reset animation flag after scroll completes
            setTimeout(() => {
                this.isAnimating = false;
            }, 500);
        }
        
        getCurrentItemIndex() {
            const containerRect = this.container.getBoundingClientRect();
            const containerCenter = containerRect.left + (containerRect.width / 2);
            
            for (let i = 0; i < this.items.length; i++) {
                const itemRect = this.items[i].getBoundingClientRect();
                const itemCenter = itemRect.left + (itemRect.width / 2);
                
                if (Math.abs(itemCenter - containerCenter) < 10) {
                    return i;
                }
            }
            
            return 0;
        }
        
        scrollToItem(item) {
            if (!item) return;
            
            const container = this.container;
            const containerRect = container.getBoundingClientRect();
            const itemRect = item.getBoundingClientRect();
            
            // Calculate the scroll position to center the item
            const scrollLeft = container.scrollLeft;
            const itemCenter = itemRect.left - containerRect.left + scrollLeft + (itemRect.width / 2);
            const containerCenter = containerRect.width / 2;
            const targetScroll = itemCenter - containerCenter;
            
            // Smooth scroll to the target position
            container.scrollTo({
                left: targetScroll,
                behavior: 'smooth'
            });
            
            // If we're near the end or start, prepare for infinite scroll
            this.prepareInfiniteScroll(targetScroll);
        }
        
        // No-op since we're not using infinite scroll
        checkInfiniteEdges() {}
        
        setupLayout() {
            // Calculate the total width needed for centering
            const container = this.container;
            const containerWidth = container.clientWidth;
            let totalWidth = 0;
            
            // Calculate total width of all items including gaps
            Array.from(container.children).forEach(item => {
                totalWidth += item.offsetWidth + parseInt(getComputedStyle(container).gap || '0', 10);
            });
            
            // Calculate the left padding needed to center the items
            const padding = Math.max(0, (containerWidth - totalWidth) / 2);
            
            // Apply the padding to the container
            container.style.paddingLeft = `${padding}px`;
            container.style.paddingRight = `${padding}px`;
            
            return padding;
        }
        
        clearClones() {}
        
        // No-op since we're not using infinite scroll
        setupInfiniteItems() {}
        
        updateButtonStates() {
            if (!this.prevButton || !this.nextButton) return;
            
            const { scrollLeft, scrollWidth, clientWidth } = this.container;
            const isAtStart = scrollLeft <= 0;
            const isAtEnd = Math.ceil(scrollLeft) >= scrollWidth - clientWidth;
            
            // Toggle button states based on scroll position
            this.prevButton.toggleAttribute('disabled', isAtStart);
            this.nextButton.toggleAttribute('disabled', isAtEnd);
        }
        
        scrollToItem(direction) {
            if (this.isAnimating) return;
            this.isAnimating = true;
            
            const closestItem = this.getClosestItem();
            if (!closestItem) return;
            
            let targetItem;
            
            if (direction === 'next') {
                targetItem = closestItem.nextElementSibling;
            } else {
                targetItem = closestItem.previousElementSibling;
            }
            
            if (!targetItem) {
                this.isAnimating = false;
                return;
            }
            
            // Scroll to the target item
            targetItem.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
            
            // Update button states after scroll
            setTimeout(() => {
                this.updateButtonStates();
                this.isAnimating = false;
            }, 300);
        }
        
        handleResize() {
            // Debounce resize events
            if (this.resizeTimeout) {
                clearTimeout(this.resizeTimeout);
            }
            
            this.resizeTimeout = setTimeout(() => {
                if (!this.isAnimating) {
                    this.setupLayout();
                    this.updateButtonStates();
                }
            }, 100);
        }
        
        getClosestItem() {
            const children = this.container.children;
            if (!children.length) return null;

            const parentRect = this.container.getBoundingClientRect();
            const parentX = parentRect.x + (parentRect.width / 2); // Center of container

            return Array.from(children).reduce((closest, child) => {
                const rect = child.getBoundingClientRect();
                const x = rect.x + (rect.width / 2); // Center of item

                if (!closest.child) return { x, child };
                return Math.abs(x - parentX) < Math.abs(closest.x - parentX) 
                    ? { x, child } 
                    : closest;
            }, { x: 0, child: null }).child;
        }

        setupNavigation() {
            const gallery = this.container.closest('.staggered-gallery');
            if (!gallery) return;
            
            this.prevButton = gallery.querySelector('[data-bravery-carousel-prev]');
            this.nextButton = gallery.querySelector('[data-bravery-carousel-next]');
            
            if (this.prevButton) {
                this.prevButton.addEventListener('click', () => this.scrollToItem('prev'));
            }
            
            if (this.nextButton) {
                this.nextButton.addEventListener('click', () => this.scrollToItem('next'));
            }
            
            // Handle scroll events for button states and infinite scroll
            this.container.addEventListener('scroll', wheaton.utils.debounce(() => {
                this.updateButtonStates();
                this.checkInfiniteEdges();
            }, 100), { passive: true });
        }
        
        toggleNavigation(show) {
            const controls = this.container.closest('.staggered-gallery')
                .querySelector('[data-bravery-carousel-controls]');
                
            if (controls) {
                controls.hidden = !show;
            }
        }
    }

    // Initialize all staggered galleries on the page
    function init() {
        const galleries = document.querySelectorAll('.bm-gallery--staggered');
        return Array.from(galleries).map(gallery => {
            // Only initialize if not already initialized
            if (!gallery.dataset.initialized) {
                gallery.dataset.initialized = 'true';
                return new StaggeredGallery(gallery);
            }
            return null;
        }).filter(Boolean); // Remove nulls
    }

    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => init());
    } else {
        init();
    }

    // Export for Wheaton namespace
    wheaton.StaggeredGallery = StaggeredGallery;
    wheaton.initStaggeredGalleries = init;

})(window.wheaton = window.wheaton || {});
