# JavaScript Module Implementation Guide for TerminalFour

This guide explains how to implement and manage the modular JavaScript architecture in the Wheaton College website within the TerminalFour CMS environment.

## Table of Contents

1. [Module Overview](#module-overview)
2. [Implementation Guide](#implementation-guide)
3. [Module Reference](#module-reference)
4. [TerminalFour Integration](#terminalfour-integration)
5. [Program Finder Integration](#program-finder-integration)
6. [Performance Considerations](#performance-considerations)
7. [Troubleshooting](#troubleshooting)

## Module Overview

We've organized our JavaScript into focused, independent modules, each responsible for specific functionality. This modular approach offers several benefits:

- **Better Performance**: Only load the JavaScript needed for each page
- **Easier Maintenance**: Update individual modules without affecting others
- **Improved Caching**: Changes to one module don't invalidate caches for others

### Available Modules

1. **Carousel** (`carousel.min.js`) - Handles image/content carousels
2. **Navigation** (`navigation.min.js`) - Manages site navigation and mobile menu
3. **Modal** (`modal.min.js`) - Controls modal dialogs and lightboxes
4. **Accordion** (`accordion.min.js`) - Implements collapsible content sections
5. **Marquee** (`marquee.min.js`) - Manages scrolling/ticker content
6. **Faculty Filter** (`faculty-filter.min.js`) - Handles filtering of faculty listings
7. **Gallery Staggered** (`gallery-staggered.min.js`) - Handles staggered image galleries
8. **Program Finder** (`program-finder.min.js`) - Manages program search and filtering

## Implementation Guide

### 1. Upload Required Files

Upload the following files to TerminalFour's Media Library:

```
/js/
  └── modules/
      ├── accordion.min.js
      ├── carousel.min.js
      ├── faculty-filter.min.js
      ├── gallery-staggered.min.js
      ├── marquee.min.js
      ├── modal.min.js
      ├── navigation.min.js
      └── program-finder.min.js
```

### 2. Update Base Template

In your TerminalFour base template (typically in the Template Manager), add the following code just before the closing `</body>` tag:

```html
<!-- Wheaton JavaScript Modules -->
<script>
// Module loader and initializer for Wheaton College website
(function() {
    // Map of module names to their media library paths
    const modules = {
        'accordion': 'js/modules/accordion.min.js',
        'carousel': 'js/modules/carousel.min.js',
        'faculty-filter': 'js/modules/faculty-filter.min.js',
        'gallery-staggered': 'js/modules/gallery-staggered.min.js',
        'marquee': 'js/modules/marquee.min.js',
        'modal': 'js/modules/modal.min.js',
        'navigation': 'js/modules/navigation.min.js',
        'program-finder': 'js/modules/program-finder.min.js'
    };

    // Function to initialize a module
    function initModule(el, moduleName) {
        if (window.wheaton && window.wheaton[moduleName] &&
            typeof window.wheaton[moduleName].init === 'function') {
            window.wheaton[moduleName].init(el);
        }
    }

    // Initialize modules when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        document.querySelectorAll('[data-module]').forEach(function(el) {
            const moduleNames = el.getAttribute('data-module').split(' ');
            
            moduleNames.forEach(function(moduleName) {
                if (modules[moduleName]) {
                    // For TerminalFour, we'll use Handlebars to include the script
                    // The actual script loading is handled by the template
                    initModule(el, moduleName);
                }
            });
        });
    });
})();
</script>

<!-- Include JavaScript Modules using Handlebars -->
{{! Example of including a specific module }}
{{! <script>
    {{{media id="js/modules/accordion.min.js" layout="js/raw"}}}
</script> }}

{{! Example of including multiple modules }}
{{#each siteSettings.jsModules}}
    <script>
        {{{media id=this.path layout="js/raw"}}}
    </script>
{{/each}}
```

### 3. Module Initialization

Modules are automatically initialized when they're loaded. Each module should expose an `init` method on the `window.wheaton` namespace. For example:

```javascript
// Example module structure
window.wheaton = window.wheaton || {};
window.wheaton.accordion = {
    init: function(element) {
        // Module initialization code here
    }
};
```
```

### 3. Module Initialization

Modules are automatically initialized based on data attributes. For example:

```html
<!-- Initialize a single module -->
<div data-module="accordion">
    <!-- Accordion content -->
</div>

<!-- Initialize multiple modules on one element -->
<nav data-module="navigation carousel">
    <!-- Navigation and carousel content -->
</nav>
```

### 4. Module Reference

#### Accordion (`accordion.min.js`)
- **Purpose**: Creates collapsible content sections
- **HTML Structure**:
  ```html
  <div data-module="accordion">
      <button aria-expanded="false" aria-controls="panel1">Section 1</button>
      <div id="panel1" hidden>Content 1</div>
      
      <button aria-expanded="false" aria-controls="panel2">Section 2</button>
      <div id="panel2" hidden>Content 2</div>
  </div>
  ```
- **Options**: None required

#### Carousel (`carousel.min.js`)
- **Purpose**: Handles image and content carousels
- **HTML Structure**:
  ```html
  <div data-module="carousel" data-carousel-options='{"autoplay": true, "interval": 5000}'>
      <div class="carousel-container">
          <!-- Slides go here -->
      </div>
      <button class="carousel-prev">Previous</button>
      <button class="carousel-next">Next</button>
  </div>
  ```
- **Options**: `autoplay` (boolean), `interval` (milliseconds)

#### Faculty Filter (`faculty-filter.min.js`)
- **Purpose**: Filters faculty listings based on selected criteria
- **HTML Structure**:
  ```html
  <div data-module="faculty-filter">
      <div class="filters">
          <!-- Filter controls -->
      </div>
      <div class="faculty-results">
          <!-- Faculty cards -->
      </div>
  </div>
  ```

#### Modal (`modal.min.js`)
- **Purpose**: Manages modal dialogs and lightboxes
- **HTML Structure**:
  ```html
  <button data-module="modal" data-modal-target="#myModal">Open Modal</button>
  
  <div id="myModal" class="modal" hidden>
      <div class="modal-content">
          <button class="modal-close">×</button>
          <!-- Modal content -->
      </div>
  </div>
  ```

### 5. TerminalFour Integration

#### File Uploads
1. Navigate to **Media Library** in TerminalFour
2. Create a `js` directory if it doesn't exist
3. Upload `module-loader.js` to the `js` directory
4. Create a `js/modules` subdirectory
5. Upload all `*.min.js` module files to the `js/modules` directory

#### Template Updates
1. Edit your base template (e.g., `_layout.njk`)
2. Add the module loader script before the closing `</body>` tag:
   ```handlebars
   <script src="{{media url='js/module-loader.js'}}?v={{now 'yyyyMMdd'}}" defer></script>
   ```

#### Content Type Configuration
For content types that use specific modules (e.g., Accordion, Carousel), ensure the HTML structure matches the required patterns shown in the Module Reference section above.

### 6. Performance Optimization

#### Lazy Loading
Modules are automatically lazy-loaded when their corresponding `data-module` attribute is found in the DOM.

#### Caching Strategy
- Set appropriate cache headers for all JavaScript files in TerminalFour
- Use the `?v={{now 'yyyyMMdd'}}` parameter to force cache invalidation when needed

### 7. Troubleshooting

#### Module Not Loading
1. Check browser console for 404 errors on module files
2. Verify file paths in TerminalFour Media Library match those in your templates
3. Ensure the module name in `data-module` matches exactly with the module filename (without .js)

#### JavaScript Errors
1. Check for conflicts with other JavaScript libraries
2. Ensure all required HTML structure and data attributes are present
3. Verify that jQuery (if required by the module) is loaded before the module loader

### 8. Module Development

#### Adding a New Module
1. Create a new JavaScript file in `/src/assets/js/modules/`
2. Follow the module pattern:
   ```javascript
   (() => {
       const MyModule = {
           init(element) {
               // Initialization code
           }
       };
       
       // Register the module
       window.wheaton = window.wheaton || {};
       window.wheaton.myModule = MyModule;
   })();
   ```
3. Add the module to the build process in `rollup.config.modules.mjs`
4. Test the module with `npm run dev`
5. Build for production with `npm run build`
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

## Program Finder Integration

The Program Finder component requires special consideration for TerminalFour integration due to its dynamic data requirements and Svelte-based architecture.

### Current Implementation Analysis

**Strengths:**
- Uses data attributes for program information, making it CMS-friendly
- Modular Svelte components allow for flexible deployment
- URL state management enables deep linking and bookmarking
- Responsive design works across all device sizes

**Areas for Improvement:**
- Data structure could be more Handlebars-friendly
- Template structure could leverage TerminalFour's content management features
- Performance could be optimized for large program datasets

### Understanding TerminalFour's Handlebars Limitations

**Important:** TerminalFour's Handlebars implementation is limited compared to standard Handlebars. Based on the [official documentation](https://docs.terminalfour.com/documentation/developer-resources/handlebars/handlebars-getting-started/#toc-nav-helper), TerminalFour only supports:

**Available Helpers:**
- `{{publish element="ElementName"}}` - Output content elements
- `{{selectedNames element="ListElement" separator="|"}}` - Output selected list item names
- `{{selectedValues element="ListElement" separator="|"}}` - Output selected list item values
- `{{#link element="LinkElement"}}...{{/link}}` - Link helper with block syntax
- String manipulation helpers: `abbreviate`, `capitalize`, `replace`, `slugify`, etc.

**Not Available:**
- Custom helper functions like `join`, `safeUrl`, `truncate`
- Complex logic like `{{#if}}` statements
- Array manipulation helpers
- Custom block helpers

### Recommended TerminalFour Integration

#### 1. Content Management Setup

**In TerminalFour, create a "Program" content type with these fields:**
```
- Program Name (Text, Required)
- Program URL (Link, Required)
- Credential Types (Multi-select List)
- Degree Types (Multi-select List)
- Areas of Study (Multi-select List)
- Concentrations (Text)
- Campus (Select Box)
- Delivery Mode (Select Box)
- Duration (Text)
- Credits (Number)
- Program Description (HTML)
- Featured Image (Media)
- Active (Check Box)
- Sort Order (Number)
```

#### 2. Template Implementation Options

**Option A: Use Enhanced Component with TerminalFour Helpers**
```handlebars
{{!-- In your page template --}}
{{!-- Program Data Container (Hidden) --}}
<div class="program-data-container" style="display: none;" aria-hidden="true">
    {{!-- This would need to be generated by TerminalFour's NavObj system --}}
    {{!-- Each program would be a separate content item --}}
    <div class="program-data-2023"
         data-credential-types="{{selectedNames element="Credential Types" separator="|"}}"
         data-credential-type-values="{{selectedValues element="Credential Types" separator="|"}}"
         data-degree-types="{{selectedNames element="Degree Types" separator="|"}}"
         data-areas-of-study="{{selectedNames element="Areas of Study" separator="|"}}"
         data-link="{{publish element="Program URL"}}"
         data-concentrations="{{publish element="Concentrations"}}"
         data-name="{{publish element="Program Name"}}"
         data-campus="{{publish element="Campus"}}"
         data-delivery-mode="{{publish element="Delivery Mode"}}"
         data-duration="{{publish element="Duration"}}"
         data-credits="{{publish element="Credits"}}"
         data-description="{{abbreviate (publish element="Program Description") 200}}">
    </div>
</div>

{{!-- Mount Point for Svelte Component --}}
<div id="program-finder-mountpoint"
     aria-live="polite"
     aria-relevant="additions removals">
</div>
```

**Option B: Use Existing Data File (Recommended for Current Implementation)**
```handlebars
{{!-- In your page template --}}
{% include "components/bm-program-finder-2023-data.njk" %}
<div id="program-finder-mountpoint"></div>
```

#### 3. TerminalFour NavObj Configuration

**To loop through all programs in TerminalFour:**

1. **Create a Section for Programs:**
   - Create a section called "Programs" or "Academic Programs"
   - Add all your program content to this section

2. **Configure NavObj in your template:**
   ```handlebars
   {{!-- In your page template --}}
   {{!-- Note: This would need to be implemented using TerminalFour's NavObj system --}}
   {{!-- The exact syntax depends on your TerminalFour configuration --}}
   ```

3. **Alternative: Use Content Type Query:**
   ```handlebars
   {{!-- Query specific content type --}}
   {{!-- This would need to be implemented using TerminalFour's specific NavObj syntax --}}
   ```

#### 4. Data Structure Compatibility

**The enhanced component generates the same data structure as the existing file:**

**Current Data Attributes (from bm-program-finder-2023-data.njk):**
```html
<div class="program-data-2023"
     data-credential-types="Bachelor"
     data-credential-type-values="bachelor-1"
     data-degree-types="BA"
     data-areas-of-study="Humanities"
     data-link="http://google.com"
     data-concentrations="soft, medium and hard types of concentrations"
     data-name="Anthropology">
</div>
```

**TerminalFour Handlebars Output:**
```html
<div class="program-data-2023"
     data-credential-types="{{selectedNames element="Credential Types" separator="|"}}"
     data-credential-type-values="{{selectedValues element="Credential Types" separator="|"}}"
     data-degree-types="{{selectedNames element="Degree Types" separator="|"}}"
     data-areas-of-study="{{selectedNames element="Areas of Study" separator="|"}}"
     data-link="{{publish element="Program URL"}}"
     data-concentrations="{{publish element="Concentrations"}}"
     data-name="{{publish element="Program Name"}}">
</div>
```

**Both generate the same structure that the JavaScript reads!**

#### 5. Migration Strategy

**Phase 1: Development**
- Keep using `bm-program-finder-2023-data.njk` for development
- Test the enhanced component separately

**Phase 2: Content Setup**
- Create Program content type in TerminalFour
- Add all programs to the content management system
- Configure NavObj queries using TerminalFour's specific syntax

**Phase 3: Production**
- Replace `bm-program-finder-2023-data.njk` with TerminalFour Handlebars templates
- Update page templates to use TerminalFour's NavObj system
- Test with real data

#### 6. TerminalFour Content Structure

**Recommended Content Types:**

1. **Program Content Type Fields:**
   ```
   - Program Name (Text, Required)
   - Program URL (Link, Required)
   - Credential Types (Multi-select List)
   - Degree Types (Multi-select List)
   - Areas of Study (Multi-select List)
   - Concentrations (Text)
   - Campus (Select Box)
   - Delivery Mode (Select Box)
   - Duration (Text)
   - Credits (Number)
   - Program Description (HTML)
   - Featured Image (Media)
   - Active (Check Box, Default: true)
   - Sort Order (Number)
   ```

2. **Program Finder Settings:**
   ```
   - Title (Text, Default: "Find your program")
   - Description (HTML)
   - Trigger Text (Text)
   - Show Trigger Button (Check Box)
   - Include Structured Data (Check Box)
   ```

#### 7. TerminalFour Handlebars Template Implementation

**Program Template (for individual programs):**
```handlebars
{{!-- Individual Program Template --}}
<div class="program-data-2023"
     data-credential-types="{{selectedNames element="Credential Types" separator="|"}}"
     data-credential-type-values="{{selectedValues element="Credential Types" separator="|"}}"
     data-degree-types="{{selectedNames element="Degree Types" separator="|"}}"
     data-areas-of-study="{{selectedNames element="Areas of Study" separator="|"}}"
     data-link="{{publish element="Program URL"}}"
     data-concentrations="{{publish element="Concentrations"}}"
     data-name="{{publish element="Program Name"}}"
     data-campus="{{publish element="Campus"}}"
     data-delivery-mode="{{publish element="Delivery Mode"}}"
     data-duration="{{publish element="Duration"}}"
     data-credits="{{publish element="Credits"}}"
     data-description="{{abbreviate (publish element="Program Description") 200}}">
</div>
```

**Program Finder Wrapper Template:**
```handlebars
{{!-- Program Data Container (Hidden) --}}
<div class="program-data-container" style="display: none;" aria-hidden="true">
    {{!-- This would be populated by TerminalFour's NavObj system --}}
    {{!-- Each program content item would render the program template above --}}
</div>

{{!-- Mount Point for Svelte Component --}}
<div id="program-finder-mountpoint"
     aria-live="polite"
     aria-relevant="additions removals">
</div>

{{!-- Trigger Button (Optional) --}}
{{#if (publish element="Show Trigger Button")}}
<button class="program-finder-trigger"
        data-widget="program-finder"
        aria-label="{{publish element="Trigger Text"}}"
        aria-expanded="false"
        aria-controls="program-finder-mountpoint">
    <span class="trigger-text">{{publish element="Trigger Text"}}</span>
    <svg class="trigger-icon" width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
        <path d="M8 1L15 8L8 15" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
</button>
{{/if}}
```

#### 8. TerminalFour-Specific Considerations

**Limitations:**
- No custom helper functions available
- Limited conditional logic
- No complex array manipulation
- Must use TerminalFour's specific helper syntax

**Workarounds:**
- Use `selectedNames` and `selectedValues` for list elements
- Use `abbreviate` for text truncation
- Use `publish` for all content elements
- Structure data in TerminalFour to match expected format

**Data Formatting:**
```handlebars
{{!-- For credential types --}}
{{selectedNames element="Credential Types" separator="|"}}

{{!-- For URLs --}}
{{publish element="Program URL"}}

{{!-- For truncated descriptions --}}
{{abbreviate (publish element="Program Description") 200}}

{{!-- For HTML content --}}
{{{publish element="Program Description"}}}
```

#### 9. Enhanced JavaScript Implementation

**Updated program-finder-2023.js:**
```javascript
import ProgramFinderFullScreen from "./ProgramFinderFullScreen.svelte";
import ProgramFinderOverlay from "./ProgramFinderOverlay.svelte";
import { isShowableProgram } from "./program-finder-utils";

class ProgramFinderManager {
    constructor() {
        this.programs = [];
        this.isLoaded = false;
        this.init();
    }

        async init() {
        const mountPoints = document.querySelectorAll('#program-finder-mountpoint');

        mountPoints.forEach(mountPoint => {
            const container = mountPoint.closest('body') || document.body;
            if (container.dataset.lazyLoad === 'true') {
                this.setupLazyLoading(container, mountPoint);
            } else {
                this.loadFromDataAttributes(container, mountPoint);
            }
        });
    }

        async setupLazyLoading(container, mountPoint) {
        const endpoint = container.dataset.endpoint;
        const loadingEl = container.querySelector('[data-loading]');

        try {
            const response = await fetch(endpoint);
            const programs = await response.json();

            this.programs = programs;
            this.isLoaded = true;

            // Hide loading, show component
            if (loadingEl) loadingEl.style.display = 'none';
            this.initializeComponent(mountPoint);

        } catch (error) {
            console.error('Failed to load program data:', error);
            if (loadingEl) {
                loadingEl.innerHTML = '<p>Failed to load programs. Please try again.</p>';
            }
        }
    }

        loadFromDataAttributes(container, mountPoint) {
        const dataElements = container.querySelectorAll('.program-data-2023');
        this.programs = Array.from(dataElements).map(element => ({
            name: element.dataset.name || 'Unnamed',
            credential_types: (element.dataset.credentialTypes || '').split('|').filter(Boolean),
            credential_type_values: (element.dataset.credentialTypeValues || '').split('|').filter(Boolean),
            degree_types: (element.dataset.degreeTypes || '').split('|').filter(Boolean),
            areas_of_study: (element.dataset.areasOfStudy || '').split('|').filter(Boolean),
            link: element.dataset.link || '',
            concentrations: element.dataset.concentrations || '',
            program_id: element.dataset.programId || '',
            campus: element.dataset.campus || '',
            delivery_mode: element.dataset.deliveryMode || '',
            duration: element.dataset.duration || '',
            credits: element.dataset.credits || '',
            description: element.dataset.description || '',
            featured_image: element.dataset.featuredImage || ''
        }));

        this.initializeComponent(mountPoint);
    }

        initializeComponent(mountPoint) {
        const settings = this.parseSettings(mountPoint.dataset.settings);

        new ProgramFinderFullScreen({
            target: mountPoint,
            props: {
                title: settings.title || 'Find your program',
                programs: this.programs.filter(isShowableProgram),
                settings: settings
            }
        });

        // Setup overlay trigger
        this.setupOverlayTrigger(mountPoint);
    }

    parseSettings(settingsString) {
        try {
            return JSON.parse(settingsString || '{}');
        } catch {
            return {};
        }
    }

    setupOverlayTrigger(mountPoint) {
        const trigger = mountPoint.querySelector('[data-widget="program-finder"]');
        if (trigger) {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.openOverlay(mountPoint);
            });
        }
    }

        openOverlay(mountPoint) {
        const settings = this.parseSettings(mountPoint.dataset.settings);
        const slidein_mountpoint = document.createElement("div");
        document.body.appendChild(slidein_mountpoint);

        new ProgramFinderOverlay({
            target: slidein_mountpoint,
            props: {
                title: settings.title || 'Find your program',
                programs: this.programs.filter(isShowableProgram),
                fullScreenPath: settings.fullScreenPath || "/academics/programs/",
                isOpen: true
            }
        });
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new ProgramFinderManager();
});
```

#### 10. TerminalFour Media Library Structure

**Recommended File Organization:**
```
/media-library/
├── js/
│   ├── program-finder/
│   │   ├── program-finder.bundle.js
│   │   ├── program-finder-utils.js
│   │   └── program-finder-data.json
│   └── wheaton.bundle.js
├── css/
│   └── program-finder.css
└── images/
    └── program-finder/
        ├── loading-spinner.svg
        └── icons/
```

#### 11. Content Management Integration

**TerminalFour Content Type Configuration:**

1. **Program Content Type Fields:**
   ```
   - Program Name (Text, Required)
   - Program URL (Link, Required)
   - Credential Types (Multi-select List)
   - Degree Types (Multi-select List)
   - Areas of Study (Multi-select List)
   - Concentrations (Text)
   - Campus (Select Box)
   - Delivery Mode (Select Box)
   - Duration (Text)
   - Credits (Number)
   - Program Description (HTML)
   - Featured Image (Media)
   - Active (Check Box, Default: true)
   - Sort Order (Number)
   ```

2. **Program Finder Settings:**
   ```
   - Title (Text, Default: "Find your program")
   - Description (HTML)
   - Trigger Text (Text)
   - Show Trigger Button (Check Box)
   - Include Structured Data (Check Box)
   ```

#### 12. SEO and Accessibility Enhancements

**Structured Data Integration:**
```handlebars
{{!-- Add structured data for programs --}}
{{!-- Note: This would need to be implemented using TerminalFour's specific syntax --}}
{{!-- and would require custom development or server-side processing --}}
```

**Accessibility Improvements:**
```handlebars
{{!-- Enhanced accessibility attributes --}}
<div id="program-finder-mountpoint"
     aria-live="polite"
     aria-relevant="additions removals">
</div>
```

#### 13. Implementation Steps

**Step 1: Upload Files to TerminalFour Media Library**
1. Upload `program-finder.bundle.js` to `/js/program-finder/`
2. Configure TerminalFour Handlebars templates
3. Set up content types in TerminalFour

**Step 2: Create Content Types**
1. Create "Program" content type with all required fields
2. Create "Program Finder Settings" content type
3. Set up proper field mappings and validation

**Step 3: Configure Templates**
1. Create Handlebars templates using TerminalFour's specific syntax
2. Configure NavObj queries using TerminalFour's system
3. Set up proper data binding between content and templates

**Step 4: Test and Deploy**
1. Test with sample program data
2. Verify all animations and interactions work correctly
3. Check accessibility and SEO features
4. Deploy to production

### Benefits of This Approach

1. **Better Content Management:** Leverages TerminalFour's content management capabilities
2. **Improved Performance:** Lazy loading and optimized data structures
3. **Enhanced SEO:** Structured data and semantic markup
4. **Better Accessibility:** ARIA attributes and keyboard navigation
5. **Flexible Configuration:** Settings-driven component behavior
6. **Scalable Architecture:** Modular design supports future enhancements
7. **TerminalFour Compatibility:** Uses only supported Handlebars helpers
8. **Subtle Animations:** Consistent with site design language without overflow issues
9. **Backward Compatibility:** Can use existing data file during transition
10. **Clear Migration Path:** Step-by-step process from development to production

## Vanilla JS Refactoring Recommendation

**Consideration:** The current Svelte implementation adds unnecessary complexity for this specific use case. A vanilla JS refactor would provide significant benefits.

### Why Vanilla JS Makes Sense Here:

**Current Svelte Overhead:**
- Svelte runtime: ~13KB gzipped
- Build tooling complexity
- Framework dependency for TerminalFour
- Component compilation overhead

**Vanilla JS Benefits:**
- **Smaller bundle size** - No framework runtime
- **Simpler deployment** - No build step needed
- **Better TerminalFour compatibility** - No framework dependencies
- **Easier debugging** - Standard browser dev tools
- **Faster initial load** - Less JavaScript to parse

### Proposed Vanilla JS Architecture:

```javascript
class ProgramFinder {
    constructor(mountPoint, options = {}) {
        this.mountPoint = mountPoint;
        this.programs = options.programs || [];
        this.title = options.title || 'Find your program';
        this.selectedFilters = {
            areas_of_study: [],
            credential_types: []
        };

        this.init();
    }

    init() {
        this.loadInitialState();
        this.render();
        this.bindEvents();
    }

    loadInitialState() {
        // Load from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        this.selectedFilters.areas_of_study = urlParams.getAll('pf-aos');
        this.selectedFilters.credential_types = urlParams.getAll('pf-ct');
    }

    render() {
        this.mountPoint.innerHTML = this.generateHTML();
        this.updateResults();
    }

    generateHTML() {
        return `
            <div class="program-finder">
                <h1 class="is-fancy">${this.title}</h1>
                <form class="form_bluebg">
                    ${this.generateCredentialTypeFilters()}
                    ${this.generateAreaOfStudyFilters()}
                </form>
                <div class="results-container">
                    <p class="results-count"></p>
                    <ul class="results" aria-live="polite"></ul>
                </div>
            </div>
        `;
    }

    generateCredentialTypeFilters() {
        const credentialTypes = this.getUniqueCredentialTypes();
        return `
            <fieldset class="credential_types">
                <legend>1. Select program type</legend>
                <div class="scroller">
                    ${credentialTypes.map(type => `
                        <input class="v-hidden" type="checkbox"
                               name="credential_types" value="${type}"
                               ${this.selectedFilters.credential_types.includes(type) ? 'checked' : ''}>
                        <button type="button" class="bm--cta style-primary ${this.selectedFilters.credential_types.includes(type) ? 'selected' : ''}"
                                data-filter="credential_types" data-value="${type}">
                            ${type}
                        </button>
                    `).join('')}
                </div>
            </fieldset>
        `;
    }

    generateAreaOfStudyFilters() {
        const areasOfStudy = this.getUniqueAreasOfStudy();
        return `
            <fieldset class="areas_of_study">
                <legend>2. Area of study</legend>
                <div class="checkbox-container">
                    ${areasOfStudy.map(area => `
                        <label class="checkbox">
                            <input type="checkbox" name="areas_of_study" value="${area}"
                                   ${this.selectedFilters.areas_of_study.includes(area) ? 'checked' : ''}>
                            ${area}
                        </label>
                    `).join('')}
                </div>
            </fieldset>
        `;
    }

    bindEvents() {
        // Credential type buttons
        this.mountPoint.addEventListener('click', (e) => {
            if (e.target.dataset.filter === 'credential_types') {
                this.toggleFilter('credential_types', e.target.dataset.value);
            }
        });

        // Area of study checkboxes
        this.mountPoint.addEventListener('change', (e) => {
            if (e.target.name === 'areas_of_study') {
                this.toggleFilter('areas_of_study', e.target.value);
            }
        });

        // URL popstate
        window.addEventListener('popstate', () => {
            this.loadInitialState();
            this.render();
        });
    }

    toggleFilter(filterType, value) {
        const filters = this.selectedFilters[filterType];
        const index = filters.indexOf(value);

        if (index > -1) {
            filters.splice(index, 1);
        } else {
            filters.push(value);
        }

        this.updateURL();
        this.updateResults();
    }

    updateURL() {
        const url = new URL(window.location);
        url.searchParams.delete('pf-aos');
        url.searchParams.delete('pf-ct');

        this.selectedFilters.areas_of_study.forEach(aos =>
            url.searchParams.append('pf-aos', aos));
        this.selectedFilters.credential_types.forEach(ct =>
            url.searchParams.append('pf-ct', ct));

        history.pushState(null, '', url);
    }

    updateResults() {
        const filteredPrograms = this.filterPrograms();
        const resultsContainer = this.mountPoint.querySelector('.results');
        const countElement = this.mountPoint.querySelector('.results-count');

        countElement.textContent = `Viewing ${filteredPrograms.length} program${filteredPrograms.length === 1 ? '' : 's'}`;

        resultsContainer.innerHTML = filteredPrograms.map(program => `
            <li class="result">
                <p class="program_name">
                    <a href="${program.link}">${program.name}</a>
                </p>
                <div class="details">
                    ${program.credential_types?.length ? `
                        <div class="detail credential_types">
                            <p class="detail_type">Credential Type</p>
                            <p>${program.credential_types.join(', ')}</p>
                        </div>
                    ` : ''}
                    ${program.degree_types?.length ? `
                        <div class="detail degree_types">
                            <p class="detail_type">Offered As</p>
                            <p>${program.degree_types.join(', ')}</p>
                        </div>
                    ` : ''}
                    ${program.concentrations ? `
                        <div class="detail concentrations">
                            <p class="detail_type">Concentrations</p>
                            <p>${program.concentrations}</p>
                        </div>
                    ` : ''}
                </div>
            </li>
        `).join('');
    }

    filterPrograms() {
        return this.programs.filter(program => {
            // Area of study filter
            if (this.selectedFilters.areas_of_study.length > 0) {
                const hasMatchingArea = program.areas_of_study?.some(area =>
                    this.selectedFilters.areas_of_study.includes(area));
                if (!hasMatchingArea) return false;
            }

            // Credential type filter
            if (this.selectedFilters.credential_types.length > 0) {
                const hasMatchingCredential = program.credential_types?.some(credential =>
                    this.selectedFilters.credential_types.includes(credential));
                if (!hasMatchingCredential) return false;
            }

            return true;
        }).sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
    }

    getUniqueCredentialTypes() {
        const types = new Set();
        this.programs.forEach(program => {
            if (program.credential_types) {
                program.credential_types.forEach(type => types.add(type));
            }
        });
        return Array.from(types);
    }

    getUniqueAreasOfStudy() {
        const areas = new Set();
        this.programs.forEach(program => {
            if (program.areas_of_study) {
                program.areas_of_study.forEach(area => areas.add(area));
            }
        });
        return Array.from(areas).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
    }
}

// Overlay version
class ProgramFinderOverlay {
    constructor(options = {}) {
        this.programs = options.programs || [];
        this.title = options.title || 'Find your program';
        this.fullScreenPath = options.fullScreenPath || '/academics/programs/';
        this.isOpen = options.isOpen || false;

        this.createOverlay();
        this.bindEvents();
    }

    createOverlay() {
        this.overlay = document.createElement('div');
        this.overlay.className = 'program-finder-2023-popover';
        this.overlay.innerHTML = `
            <div class="program-finder-2023-popover__overlay">
                <div class="program-finder-2023-popover__container">
                    <button class="program-finder-2023-popover__close">
                        <span class="v-hidden">Close</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 44 44">
                            <path stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.667"
                                  d="m27.5 16.5-11 11m0-11 11 11M40.334 22c0 10.125-8.209 18.333-18.334 18.333S3.667 32.125 3.667 22C3.667 11.875 11.875 3.667 22 3.667c10.126 0 18.334 8.208 18.334 18.333Z"/>
                        </svg>
                    </button>
                    <div class="program-finder-content"></div>
                </div>
            </div>
        `;

        document.body.appendChild(this.overlay);
        this.contentContainer = this.overlay.querySelector('.program-finder-content');

        // Initialize the finder
        this.finder = new ProgramFinder(this.contentContainer, {
            programs: this.programs,
            title: this.title
        });

        this.setOpen(this.isOpen);
    }

    bindEvents() {
        // Close button
        this.overlay.querySelector('.program-finder-2023-popover__close').addEventListener('click', () => {
            this.setOpen(false);
        });

        // Overlay click
        this.overlay.querySelector('.program-finder-2023-popover__overlay').addEventListener('click', (e) => {
            if (e.target === e.currentTarget) {
                this.setOpen(false);
            }
        });

        // Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.setOpen(false);
            }
        });
    }

    setOpen(open) {
        this.isOpen = open;
        this.overlay.classList.toggle('isOpen', open);
        this.overlay.setAttribute('aria-hidden', !open);
    }

    destroy() {
        if (this.overlay && this.overlay.parentNode) {
            this.overlay.parentNode.removeChild(this.overlay);
        }
    }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
    // Load programs from data attributes
    const dataElements = document.querySelectorAll('.program-data-2023');
    const programs = Array.from(dataElements).map(element => ({
        name: element.dataset.name || 'Unnamed',
        credential_types: (element.dataset.credentialTypes || '').split('|').filter(Boolean),
        credential_type_values: (element.dataset.credentialTypeValues || '').split('|').filter(Boolean),
        degree_types: (element.dataset.degreeTypes || '').split('|').filter(Boolean),
        areas_of_study: (element.dataset.areasOfStudy || '').split('|').filter(Boolean),
        link: element.dataset.link || '',
        concentrations: element.dataset.concentrations || ''
    })).filter(isShowableProgram);

    // Initialize fullscreen finder
    const mountPoint = document.getElementById('program-finder-mountpoint');
    if (mountPoint) {
        new ProgramFinder(mountPoint, {
            programs: programs,
            title: 'Find your program'
        });
    }

    // Handle overlay triggers
    let overlay = null;
    document.addEventListener('click', (e) => {
        if (e.target.dataset.widget === 'program-finder') {
            e.preventDefault();
            if (overlay) {
                overlay.setOpen(true);
            } else {
                overlay = new ProgramFinderOverlay({
                    programs: programs,
                    title: 'Find your program',
                    fullScreenPath: '/academics/programs/',
                    isOpen: true
                });
            }
        }
    });
});
```

### Migration Benefits:

1. **Reduced Complexity:** No framework abstraction layer
2. **Better Performance:** Smaller bundle, faster parsing
3. **Easier Maintenance:** Standard JavaScript, familiar patterns
4. **TerminalFour Friendly:** No build dependencies
5. **Better Debugging:** Standard browser tools work perfectly

### Migration Strategy:

1. **Phase 1:** Create vanilla JS version alongside Svelte
2. **Phase 2:** Test thoroughly with same data
3. **Phase 3:** Replace Svelte components with vanilla JS
4. **Phase 4:** Remove Svelte dependencies

This approach would significantly simplify the TerminalFour integration while maintaining all current functionality.

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
