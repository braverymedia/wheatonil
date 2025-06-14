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

    // Lazy load all images
    marqueeElement.querySelectorAll("img").forEach((img) => {
      if (img.complete) {
        img.classList.add("is-loaded");
      } else {
        img.addEventListener("load", () => {
          img.classList.add("is-loaded");
        });
      }
    });
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
