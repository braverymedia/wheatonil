/**
 * Legacy JavaScript for older browsers
 * This file is loaded conditionally for browsers that don't support ES modules
 */

// Check if the browser supports dynamic imports
function supportsDynamicImports() {
    try {
        new Function('import("module")');
        return true;
    } catch (e) {
        return false;
    }
}

// Load the main bundle if dynamic imports are supported
if (supportsDynamicImports()) {
    // Create a script element for the modern bundle
    var script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/js/wheaton.js';
    document.head.appendChild(script);
} else {
    // Load polyfills and the legacy bundle
    var polyfillScript = document.createElement('script');
    polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=es5,es6,es7,es2015,es2016,es2017,es2018,es2019,es2020,fetch,Array.prototype.includes,NodeList.prototype.forEach,Object.entries,Object.values,URL,URLSearchParams,Element.prototype.closest,Element.prototype.matches,Element.prototype.remove,Element.prototype.toggleAttribute,Element.prototype.after,Element.prototype.before,Element.prototype.replaceWith,Element.prototype.append,Element.prototype.prepend,Element.prototype.classList,Array.from,Promise,IntersectionObserver,IntersectionObserverEntry,ResizeObserver,MutationObserver,AbortController,AbortSignal,requestIdleCallback,customElements,ShadowDOM,WebAnimations';
    document.head.appendChild(polyfillScript);

    // Load the legacy bundle after polyfills
    polyfillScript.onload = function() {
        var legacyScript = document.createElement('script');
        legacyScript.src = '/assets/js/legacy-bundle.js';
        legacyScript.nomodule = true;
        document.head.appendChild(legacyScript);
    };
}
