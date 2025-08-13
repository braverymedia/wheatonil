/**
 * Test script to verify all JavaScript modules are working correctly
 * Run this with: node test-modules.js
 */

const fs = require('fs');
const { JSDOM } = require('jsdom');

console.log('=== Testing Wheaton JavaScript Modules ===\n');

// Create a basic HTML document
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
    <title>Test</title>
</head>
<body>
    <div id="test-container"></div>
    
    <!-- Load the debounce utility first -->
    <script>
        window.wheaton = window.wheaton || {};
        window.wheaton.utils = window.wheaton.utils || {};
        
        // Define the debounce utility
        window.wheaton.utils.debounce = function(callback, wait) {
            let timeoutId = null;
            return function(...args) {
                const context = this;
                clearTimeout(timeoutId);
                timeoutId = setTimeout(() => {
                    callback.apply(context, args);
                }, wait);
            };
        };
    </script>
</body>
</html>
`, { runScripts: 'dangerously', resources: 'usable' });

global.window = dom.window;
global.document = window.document;
global.navigator = window.navigator;

// Mock console for tests
const originalConsole = console;
const logs = [];
global.console = {
    ...originalConsole,
    log: (...args) => {
        logs.push(['log', ...args]);
        originalConsole.log(...args);
    },
    warn: (...args) => {
        logs.push(['warn', ...args]);
        originalConsole.warn(...args);
    },
    error: (...args) => {
        logs.push(['error', ...args]);
        originalConsole.error(...args);
    }
};

// Helper to load a module
const loadModule = (modulePath) => {
    const code = fs.readFileSync(modulePath, 'utf8');
    // Wrap the code in a function to avoid polluting the global scope
    const wrappedCode = `(function() {\n${code}\n})();`;
    // Use vm to execute the code in a sandbox
    const vm = require('vm');
    const context = {
        window: global.window,
        document: global.document,
        console: global.console,
        module: { exports: {} },
        exports: {},
        require: (module) => {
            if (module === 'a11y-dialog') {
                return () => ({
                    show: () => {},
                    hide: () => {}
                });
            }
            return require(module);
        }
    };
    vm.createContext(context);
    try {
        vm.runInContext(wrappedCode, context);
        return { success: true, exports: context.module.exports || context.exports };
    } catch (error) {
        return { success: false, error };
    }
};

// Helper to create a test element with attributes
const createTestElement = (tag, attributes = {}) => {
    const el = document.createElement(tag);
    Object.entries(attributes).forEach(([key, value]) => {
        el.setAttribute(key, value);
    });
    return el;
};

// Test if modules can be loaded and initialized
const testModule = (moduleName) => {
    const modulePath = `./src/assets/js/modules/${moduleName}`;
    try {
        console.log(`\nTesting ${moduleName}...`);
        
        // Load the module
        try {
            const result = loadModule(modulePath);
            if (!result.success) {
                console.error(`✗ Error loading ${moduleName}:`, result.error.message);
                if (result.error.stack) {
                    console.error(result.error.stack.split('\n').slice(0, 3).join('\n'));
                }
                return false;
            }
            
            console.log(`✓ ${moduleName} loaded successfully`);
        } catch (error) {
            console.error(`✗ Unexpected error loading ${moduleName}:`, error.message);
            if (error.stack) {
                console.error(error.stack.split('\n').slice(0, 3).join('\n'));
            }
            return false;
        }
        
        // Get the module key (convert kebab-case to camelCase)
        const moduleKey = moduleName
            .replace('.js', '')
            .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
            
        // Check if the module was properly attached to window.wheaton
        if (!window.wheaton || !window.wheaton[moduleKey]) {
            console.error(`✗ ${moduleName} not found in window.wheaton`);
            return false;
        }
        
        const moduleInstance = window.wheaton[moduleKey];
        
        // Test initialization if the module has an init function
        if (typeof moduleInstance.init === 'function') {
            try {
                // Create appropriate test elements based on module type
                let testElement;
                const container = document.getElementById('test-container');
                
                switch(moduleName) {
                    case 'carousel.js':
                        testElement = createTestElement('div', { 'data-bravery-carousel': '' });
                        const items = createTestElement('div', { 'data-bravery-carousel-items': '' });
                        const prevBtn = createTestElement('button', { 'data-bravery-carousel-prev': '' });
                        const nextBtn = createTestElement('button', { 'data-bravery-carousel-next': '' });
                        testElement.append(items, prevBtn, nextBtn);
                        break;
                        
                    case 'navigation.js':
                        testElement = createTestElement('nav');
                        const menuBtn = createTestElement('button', { 'aria-expanded': 'false', 'aria-controls': 'menu' });
                        const menu = createTestElement('div', { 'id': 'menu' });
                        testElement.append(menuBtn, menu);
                        break;
                        
                    case 'modal.js':
                        testElement = createTestElement('div', { 'data-bm-modal': '', 'data-media-type': 'image', 'data-src': 'test.jpg' });
                        break;
                        
                    case 'accordion.js':
                        testElement = createTestElement('div', { 'data-accordion': '' });
                        const trigger = createTestElement('button', { 'aria-expanded': 'false', 'aria-controls': 'panel' });
                        const panel = createTestElement('div', { 'id': 'panel', 'hidden': '' });
                        testElement.append(trigger, panel);
                        break;
                        
                    case 'marquee.js':
                        testElement = createTestElement('div', { 'data-bravery-marquee': '' });
                        const marqueeContent = createTestElement('div', { 'data-bravery-marquee-content': '' });
                        testElement.appendChild(marqueeContent);
                        break;
                        
                    case 'faculty-filter.js':
                        testElement = createTestElement('div', { 'data-faculty-filter': '' });
                        const search = createTestElement('input', { 'type': 'text', 'data-faculty-search': '' });
                        const filterContainer = createTestElement('div', { 'data-faculty-filters': '' });
                        const results = createTestElement('div', { 'data-faculty-results': '' });
                        testElement.append(search, filterContainer, results);
                        break;
                        
                    default:
                        testElement = createTestElement('div');
                }
                
                container.appendChild(testElement);
                
                // Initialize the module
                try {
                    moduleInstance.init(testElement);
                    console.log(`✓ ${moduleName} initialized successfully`);
                    
                    // Additional module-specific tests could go here
                    // For example, you could test specific functionality of each module
                    
                    // Log any console output from the module
                    if (logs.length > 0) {
                        console.log('Module console output:');
                        logs.forEach(log => {
                            const [level, ...args] = log;
                            console[level](...args);
                        });
                        // Clear logs for the next module
                        logs.length = 0;
                    }
                } catch (initError) {
                    console.error(`✗ Error during ${moduleName} initialization:`, initError);
                    throw initError;
                }
                
            } catch (error) {
                console.error(`✗ Error initializing ${moduleName}:`, error.message);
                if (error.stack) {
                    console.error(error.stack.split('\n').slice(0, 3).join('\n'));
                }
                return false;
            }
        }
        
        return true;
    } catch (error) {
        console.error(`✗ Unexpected error with ${moduleName}:`, error.message);
        return false;
    }
};

// List of modules to test
const modules = [
    'carousel.js',
    'navigation.js',
    'modal.js',
    'accordion.js',
    'marquee.js',
    'faculty-filter.js'
];

console.log('\n=== Module Loading Tests ===');
const results = modules.map(testModule);
const passed = results.filter(Boolean).length;
const total = modules.length;

console.log('\n=== Test Summary ===');
console.log(`✅ ${passed} of ${total} modules loaded successfully`);
if (passed < total) {
    console.log(`❌ ${total - passed} modules failed to load`);
    process.exit(1);
}

console.log('\n✅ All tests passed!');
