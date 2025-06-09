# JavaScript Module Implementation Guide for TerminalFour

This guide explains how to implement and manage the modular JavaScript architecture in the Wheaton College website within the TerminalFour CMS environment.

## Table of Contents
1. [Module Overview](#module-overview)
2. [Implementation Options](#implementation-options)
3. [Module Reference](#module-reference)
4. [TerminalFour Integration](#terminalfour-integration)
5. [Performance Considerations](#performance-considerations)
6. [Troubleshooting](#troubleshooting)

## Module Overview

We've organized our JavaScript into focused modules, each responsible for specific functionality. This approach improves maintainability and performance.

### Available Modules

1. **Carousel** - Handles image/content carousels
2. **Navigation** - Manages site navigation and mobile menu
3. **Modal** - Controls modal dialogs and lightboxes
4. **Accordion** - Implements collapsible content sections
5. **Marquee** - Manages scrolling/ticker content
6. **Faculty Filter** - Handles filtering of faculty listings

## Implementation Options

### Option 1: Single Bundle (Recommended for Most Cases)

1. **Upload the bundled file** to TerminalFour's Media Library:
   - Path: `/js/wheaton.bundle.js`
   - Enable "Cache Control" with appropriate TTL

2. **Add to your base template** (e.g., `_layout.njk`):
   ```handlebars
   <!DOCTYPE html>
   <html>
   <head>
       <!-- Other head elements -->
       <script src="{{media url='js/wheaton.bundle.js'}}?v={{now 'yyyyMMdd'}}" defer></script>
   </head>
   <body>
       {{! Template content }}
   </body>
   </html>
   ```

### Option 2: Dynamic Module Loading

For more control over performance, you can implement dynamic loading:

1. **Upload these files** to your Media Library:
   - `/js/core.bundle.js` (essential modules)
   - `/js/module-loader.js` (dynamic loader)
   - Individual module files in `/js/modules/`

2. **Base template** (`_layout.njk`):
   ```handlebars
   <!DOCTYPE html>
   <html>
   <head>
       <!-- Other head elements -->
       <script src="{{media url='js/core.bundle.js'}}?v={{now 'yyyyMMdd'}}" defer></script>
       <script src="{{media url='js/module-loader.js'}}?v={{now 'yyyyMMdd'}}" defer></script>
   </head>
   <body>
       {{! Template content }}
   </body>
   </html>
   ```

3. **module-loader.js**:
   ```javascript
   // Map of module names to their paths
   const modules = {
       'carousel': '/js/modules/carousel.js',
       'navigation': '/js/modules/navigation.js',
       'modal': '/js/modules/modal.js',
       'accordion': '/js/modules/accordion.js',
       'marquee': '/js/modules/marquee.js',
       'faculty-filter': '/js/modules/faculty-filter.js'
   };

   // Initialize modules when DOM is ready
   document.addEventListener('DOMContentLoaded', () => {
       document.querySelectorAll('[data-module]').forEach(el => {
           const moduleNames = el.getAttribute('data-module').split(' ');
           
           moduleNames.forEach(moduleName => {
               if (modules[moduleName]) {
                   // Create script element
                   const script = document.createElement('script');
                   script.src = `{{media url='${modules[moduleName]}'}}?v={{now 'yyyyMMdd'}}`;
                   script.onload = () => {
                       // Initialize the module if it has an init function
                       if (window.wheaton && window.wheaton[moduleName] && 
                           typeof window.wheaton[moduleName].init === 'function') {
                           window.wheaton[moduleName].init(el);
                       }
                   };
                   document.head.appendChild(script);
               }
           });
       });
   });
   ```

## Module Reference

### 1. Carousel Module
**Selector:** `[data-bravery-carousel]`  
**Dependencies:** None  
**Usage:**
```html
<div data-module="carousel" data-bravery-carousel>
    <div data-bravery-carousel-items>
        <!-- Carousel items here -->
    </div>
    <button data-bravery-carousel-prev>Previous</button>
    <button data-bravery-carousel-next>Next</button>
</div>
```

### 2. Navigation Module
**Selector:** `[data-bravery-nav]`  
**Dependencies:** None  
**Usage:**
```html
<nav data-module="navigation" data-bravery-nav>
    <!-- Navigation structure -->
</nav>
```

### 3. Modal Module
**Selector:** `[data-bm-modal]`  
**Dependencies:** a11y-dialog (included in bundle)  
**Usage:**
```html
<button data-module="modal" data-bm-modal data-media-type="image" data-src="image.jpg">
    Open Modal
</button>
```

### 4. Accordion Module
**Selector:** `[data-accordion]`  
**Dependencies:** None  
**Usage:**
```html
<div data-module="accordion" data-accordion>
    <button aria-expanded="false" aria-controls="panel1">Section 1</button>
    <div id="panel1" hidden>Content 1</div>
    
    <button aria-expanded="false" aria-controls="panel2">Section 2</button>
    <div id="panel2" hidden>Content 2</div>
</div>
```

### 5. Marquee Module
**Selector:** `[data-bravery-marquee]`  
**Dependencies:** None  
**Usage:**
```html
<div data-module="marquee" data-bravery-marquee>
    <div data-bravery-marquee-content>
        <!-- Marquee content here -->
    </div>
</div>
```

### 6. Faculty Filter Module
**Selector:** `[data-faculty-filter]`  
**Dependencies:** None  
**Usage:**
```html
<div data-module="faculty-filter" data-faculty-filter>
    <input type="text" data-faculty-search placeholder="Search...">
    <div data-faculty-filters>
        <!-- Filter controls will be added here -->
    </div>
    <div data-faculty-results>
        <!-- Faculty listings will be filtered here -->
    </div>
</div>
```

## TerminalFour Integration

### 1. Media Library Setup
1. Create a `js` directory in your Media Library
2. Upload all JavaScript files with the following structure:
   ```
   /js/
   ├── wheaton.bundle.js
   ├── modules/
   │   ├── carousel.js
   │   ├── navigation.js
   │   ├── modal.js
   │   ├── accordion.js
   │   ├── marquee.js
   │   └── faculty-filter.js
   └── module-loader.js
   ```

### 2. Template Implementation

#### Base Template (_layout.njk)
```handlebars
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} | Wheaton College</title>
    
    <!-- CSS -->
    <link rel="stylesheet" href="{{media url='css/main.css'}}">
    
    <!-- JavaScript -->
    <script src="{{media url='js/wheaton.bundle.js'}}?v={{now 'yyyyMMdd'}}" defer></script>
    
    {{! Optionally, for dynamic loading: }}
    {{! <script src="{{media url='js/module-loader.js'}}?v={{now 'yyyyMMdd'}}" defer></script> }}
</head>
<body>
    {{! Content }}
    {{> header }}
    
    <main>
        {% block content %}{% endblock %}
    </main>
    
    {{> footer }}
</body>
</html>
```

### 3. Component Templates

#### Example: Carousel Component (carousel.njk)
```handlebars
{% set carouselId = 'carousel-' + now('X') %}

<div data-module="carousel" data-bravery-carousel id="{{carouselId}}">
    <div class="carousel__items" data-bravery-carousel-items>
        {% for slide in slides %}
            <div class="carousel__item">
                <img src="{{media url=slide.image}}" alt="{{slide.alt}}">
                {% if slide.caption %}
                    <div class="carousel__caption">{{slide.caption}}</div>
                {% endif %}
            </div>
        {% endfor %}
    </div>
    
    <button class="carousel__nav carousel__nav--prev" 
            data-bravery-carousel-prev 
            aria-controls="{{carouselId}}">
        <span class="sr-only">Previous</span>
    </button>
    
    <button class="carousel__nav carousel__nav--next" 
            data-bravery-carousel-next 
            aria-controls="{{carouselId}}">
        <span class="sr-only">Next</span>
    </button>
</div>
```

## Performance Considerations

### 1. Caching
- Set appropriate cache headers for JavaScript files in TerminalFour
- Use versioned filenames or query parameters to force cache invalidation

### 2. Loading Strategy
- Use `defer` for non-critical scripts
- Consider `async` for independent third-party scripts
- Load critical CSS in the head

### 3. Module Initialization
- Modules should be self-initializing when their selectors are present
- Use passive event listeners for scroll/touch events
- Debounce or throttle expensive operations

## Troubleshooting

### Common Issues

#### Module Not Initializing
1. Check browser console for errors
2. Verify the module is properly loaded (Network tab)
3. Ensure the DOM elements have the correct data attributes

#### JavaScript Errors
1. Check for conflicts with other scripts
2. Verify all dependencies are loaded
3. Look for syntax errors in the browser console

#### Performance Problems
1. Use the browser's Performance tab to identify bottlenecks
2. Consider code splitting for large bundles
3. Implement lazy loading for below-the-fold content

### Debugging Tips
1. Add `console.log` statements in module initialization
2. Check the `window.wheaton` namespace in the console
3. Use `document.querySelectorAll('[data-module]')` to verify module elements are present

## Best Practices

1. **Keep modules focused** - Each module should do one thing well
2. **Use data attributes** for configuration and initialization
3. **Namespace events** - Use `wheaton.moduleName.event` pattern
4. **Document requirements** - Note any dependencies or requirements
5. **Test across browsers** - Ensure compatibility with supported browsers

## Version History

- **1.0.0** (2025-06-09)
  - Initial implementation of modular JavaScript architecture
  - Includes Carousel, Navigation, Modal, Accordion, Marquee, and Faculty Filter modules

## Support

For issues or questions, please contact the Web Development team.
