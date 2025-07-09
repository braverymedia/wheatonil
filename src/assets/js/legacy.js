/**
 * Legacy JavaScript for older browsers
 * This file is loaded conditionally for browsers that don't support ES modules
 */

// Check if the browser supports dynamic imports
function supportsDynamicImports() {
    try {
        // eslint-disable-next-line no-new-func
        new Function('import("module")');
        return true;
    } catch (error) {
        // Ignore the error and return false
        return false;
    }
}

// Load the main bundle if dynamic imports are supported
if (supportsDynamicImports()) {
    // Create a script element for the modern bundle
    const script = document.createElement('script');
    script.type = 'module';
    script.src = '/assets/js/main.js';
    document.head.appendChild(script);
} else {
    // For legacy browsers, we'll load polyfills
    const polyfillScript = document.createElement('script');
    polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=es5,es6,es2015,es2016,es2017,es2018,es2019,es2020,fetch,Array.prototype.includes,NodeList.prototype.forEach,Object.entries,Object.values,URL,URLSearchParams,Element.prototype.closest,Element.prototype.matches,Element.prototype.remove,Element.prototype.toggleAttribute,Element.prototype.after,Element.prototype.before,Element.prototype.replaceWith,Element.prototype.append,Element.prototype.prepend,Element.prototype.classList,Array.from,Promise,IntersectionObserver,IntersectionObserverEntry,ResizeObserver,MutationObserver,AbortController,AbortSignal,requestIdleCallback,customElements,ShadowDOM,WebAnimations';
    document.head.appendChild(polyfillScript);

    // After polyfills, we could load a legacy bundle if needed
    polyfillScript.onload = () => {
        // For now, just log a warning
        // In a production environment, you might want to load a legacy bundle here
        // eslint-disable-next-line no-console
        console.warn('Legacy browser detected. Some features may not be available.');
    };
}
