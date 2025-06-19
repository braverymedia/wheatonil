(function (wheaton) {
  "use strict";

  const marquees = [];

  /**
   * Initialize a marquee with proper structure
   * @param {HTMLElement} marqueeElement - The marquee element to initialize
   */
  function initMarquee(marqueeElement) {
    // Show the marquee if it was hidden
    marqueeElement.hidden = false;

    // Get all picture elements
    const items = marqueeElement.querySelectorAll("picture");
    const images = [...items];
    if (!images.length) return;

    // Split images into two groups
    const half = Math.ceil(images.length / 2);
    const firstHalf = images.slice(0, half);
    const secondHalf = images.slice(half);

    // Create first column
    const column = document.createElement("div");
    column.className = "bm-gallery-col";

    // Create groups for first column
    const group1 = document.createElement("div");
    group1.className = "bm-marquee--group";
    group1.append(...firstHalf);

    // Create clone of first group
    const group1Copy = group1.cloneNode(true);
    group1Copy.setAttribute("aria-hidden", "true");

    // Create second column (reversed)
    const reversed = document.createElement("div");
    reversed.className = "bm-gallery-col bm-marquee";
    reversed.setAttribute("data-direction", "reverse");

    // Create groups for second column
    const group2 = document.createElement("div");
    group2.className = "bm-marquee--group";
    group2.append(...secondHalf);

    // Create clone of second group
    const group2Copy = group2.cloneNode(true);
    group2Copy.setAttribute("aria-hidden", "true");

    // Build the structure
    column.append(group1, group1Copy);
    reversed.append(group2, group2Copy);

    // Clear and rebuild marquee content
    marqueeElement.innerHTML = "";
    marqueeElement.append(column, reversed);

    // Mark as initialized
    marqueeElement.classList.add("is-initialized");
    
    // Also add is-initialized to the columns
    const columns = marqueeElement.querySelectorAll('.bm-gallery-col');
    columns.forEach(col => col.classList.add('is-initialized'));
    
    // Get all images in the marquee
    const imagesInMarquee = marqueeElement.querySelectorAll("img");
    
    // Function to check if an element is in the viewport
    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0 &&
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) &&
        rect.right >= 0
      );
    };
    
    // Function to load an image
    const loadImage = (img) => {
      if (img.complete) {
        img.classList.add('is-loaded');
      } else {
        // Force load by setting src again if it's a data-src
        if (img.dataset.src) {
          img.src = img.dataset.src;
        }
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        
        img.addEventListener('load', () => {
          img.classList.add('is-loaded');
        });
      }
    };
    
    // Immediately load images that are in the viewport
    imagesInMarquee.forEach(img => {
      if (isInViewport(img)) {
        loadImage(img);
      }
    });
    
    // Set up IntersectionObserver for remaining images
    if ('IntersectionObserver' in window) {
      const lazyImageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const img = entry.target;
            loadImage(img);
            observer.unobserve(img);
          }
        });
      }, {
        rootMargin: '50% 0px', // Start loading when within 50% of the viewport
        threshold: 0.01
      });
      
      // Observe all images that aren't already loaded
      imagesInMarquee.forEach(img => {
        if (!img.classList.contains('is-loaded')) {
          lazyImageObserver.observe(img);
        }
      });
    } else {
      // Fallback: Load all images if IntersectionObserver is not supported
      imagesInMarquee.forEach(loadImage);
    }
  }

  /**
   * Initialize all marquees on the page
   */
  function init() {
    const marqueeElements = document.querySelectorAll(
      ".bm-gallery--marquee:not(.is-initialized)"
    );

    marqueeElements.forEach((element, index) => {
      initMarquee(element);
      marquees.push({
        id: `marquee-${index + 1}`,
        element,
      });
    });
  }

  // Export public API
  wheaton.marquee = {
    init,
    marquees: () => marquees,
  };

  // Auto-initialize
  if (document.readyState !== "loading") {
    init();
  } else {
    document.addEventListener("DOMContentLoaded", init);
  }
})(window.wheaton = window.wheaton || {});
