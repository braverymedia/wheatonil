# T4 Handlebars Page Layout System

Complete page layout system for TerminalFour with modular JavaScript, inlined critical CSS, and deferred global CSS.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                     base-layout.hbs                         │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ <!DOCTYPE html>                                       │  │
│  │ <html>                                                │  │
│  │   {{> head}}          ← Partial: head.hbs            │  │
│  │   <body>                                              │  │
│  │     {{> header}}     ← Partial: header.hbs           │  │
│  │     <main>                                            │  │
│  │       {{{publish element="Page Content"}}}           │  │
│  │     </main>                                           │  │
│  │     {{> footer}}     ← Partial: footer.hbs           │  │
│  │     {{> scripts}}    ← Partial: scripts.hbs          │  │
│  │   </body>                                             │  │
│  │ </html>                                               │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## File Structure

```
t4-layouts/
├── README.md                      # This file
├── T4-LAYOUT-SETUP-GUIDE.md      # Detailed setup instructions
│
├── base-layout.hbs                # Main page template
│
├── partials/
│   ├── head.hbs                   # <head> with critical CSS
│   ├── header.hbs                 # Site header/navigation
│   ├── footer.hbs                 # Site footer
│   └── scripts.hbs                # Modular JS loader
│
└── media-layouts/
    └── css-inline.hbs             # CSS inline layout
```

---

## Key Features

### ✅ Modular JavaScript
- **Lazy loading** - Only loads modules when needed
- **No duplicates** - Tracks loaded modules
- **Auto-initialization** - Detects `data-module` attributes
- **Promise-based** - Proper async handling
- **Debug logging** - Console feedback for development

### ✅ Optimized CSS Loading
- **Critical CSS inlined** - No render-blocking requests
- **Global CSS deferred** - Loads asynchronously
- **Preload hints** - Browser optimization
- **No FOUC** - Flash of unstyled content prevented

### ✅ Performance Optimized
- **Preconnect to CDN** - Faster image loading
- **DNS prefetch** - Reduced latency
- **Async scripts** - Non-blocking JavaScript
- **Lazy images** - Deferred image loading

### ✅ SEO & Social Ready
- **Meta tags** - Title, description, canonical
- **Open Graph** - Social sharing optimization
- **Twitter Cards** - Twitter-specific meta
- **Structured data** - Ready for schema.org

### ✅ Accessibility First
- **Skip links** - Keyboard navigation
- **ARIA attributes** - Screen reader support
- **Semantic HTML** - Proper structure
- **Focus management** - Visible indicators

---

## Quick Start

### 1. Upload to T4

**Page Layout:**
- Create in Template Manager → Page Layouts
- Name: `Base Layout - Handlebars`
- Processor: Handlebars content
- Content: `base-layout.hbs`

**Partials:**
Create in Template Manager → Partials:
- `head` → `partials/head.hbs`
- `header` → `partials/header.hbs`
- `footer` → `partials/footer.hbs`
- `scripts` → `partials/scripts.hbs`

**Media Layout:**
- Create in Template Manager → Media Layouts
- Name: `css/inline`
- Content: `media-layouts/css-inline.hbs`

### 2. Upload Assets

**Media Library structure:**
```
Media Library/
├── css/
│   ├── critical.css      # Inlined critical CSS
│   └── wheaton.css       # Main stylesheet
├── js/
│   └── modules/
│       ├── navigation.min.js
│       ├── carousel.min.js
│       ├── accordion.min.js
│       ├── modal.min.js
│       ├── marquee.min.js
│       ├── gallery-staggered.min.js
│       ├── faculty-filter.min.js
│       └── program-finder.min.js
└── images/
    ├── wheaton-logo.svg
    ├── wheaton-logo-white.svg
    ├── favicon.ico
    └── apple-touch-icon.png
```

### 3. Create Content Type

**Standard Page content type:**
- Page Title (Text, Required)
- Meta Description (Text)
- Social Image (Media)
- Page Content (HTML, Required)
- Additional Head Code (HTML)
- Analytics Code (HTML)
- Additional Scripts (HTML)

### 4. Test

Create test page → Assign layout → Preview

---

## How It Works

### Critical CSS Flow

```
1. Browser requests page
2. HTML loads with inlined critical CSS
3. Page renders immediately (no FOUC)
4. Global CSS preloads in background
5. Global CSS applies when loaded
```

**In head.hbs:**
```handlebars
<!-- Critical CSS (inlined) -->
<style>
  {{{media id="css/critical.css" layout="css/inline"}}}
</style>

<!-- Global CSS (deferred) -->
<link rel="preload" href="{{{media id="css/wheaton.css"}}}" 
      as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### Module Loading Flow

```
1. Page loads
2. Module loader scans for [data-module] attributes
3. Groups elements by module name
4. Loads required modules (async)
5. Initializes modules when loaded
6. Tracks loaded modules (no duplicates)
```

**Usage in components:**
```handlebars
<div data-module="carousel" data-bravery-carousel>
  <!-- Carousel automatically loads and initializes -->
</div>
```

**Multiple modules:**
```handlebars
<div data-module="carousel modal">
  <!-- Both carousel and modal load -->
</div>
```

### Module API

**Check loaded modules:**
```javascript
window.wheatonModuleLoader.loaded
// Set { 'carousel', 'accordion' }
```

**Manually load module:**
```javascript
window.wheatonModuleLoader.load('modal')
  .then(() => console.log('Modal loaded'))
```

**Initialize module:**
```javascript
const element = document.querySelector('[data-module="carousel"]');
window.wheatonModuleLoader.init(element, 'carousel');
```

---

## Customization

### Add New Module

1. **Build module** (in your local dev environment)
2. **Upload to** `/js/modules/` in media library
3. **Register in** `scripts.hbs`:

```javascript
const MODULES = {
  // ... existing modules
  'my-new-module': '{{{media id="js/modules/my-new-module.min.js"}}}',
};
```

4. **Use in templates:**
```handlebars
<div data-module="my-new-module">
  <!-- Module content -->
</div>
```

### Customize Header

Edit `partials/header.hbs`:
- Update logo
- Modify navigation structure
- Add/remove utility links
- Customize mobile menu

### Customize Footer

Edit `partials/footer.hbs`:
- Update footer columns
- Modify contact information
- Add/remove social links
- Update legal links

### Add Analytics

In content type, add to "Analytics Code" field:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

---

## Performance Benchmarks

### Target Metrics (Lighthouse)

- **Performance:** 90+
- **Accessibility:** 100
- **Best Practices:** 95+
- **SEO:** 100

### Core Web Vitals

- **LCP (Largest Contentful Paint):** < 2.5s
- **FID (First Input Delay):** < 100ms
- **CLS (Cumulative Layout Shift):** < 0.1

### Optimization Features

✅ Critical CSS inlined (eliminates render-blocking CSS)  
✅ Global CSS deferred (non-blocking)  
✅ JavaScript lazy-loaded (only what's needed)  
✅ Images lazy-loaded (below fold)  
✅ CDN preconnect (faster image loading)  
✅ Async scripts (non-blocking)  
✅ Proper caching headers (set in T4)

---

## Browser Support

- **Chrome/Edge:** Latest 2 versions
- **Firefox:** Latest 2 versions
- **Safari:** Latest 2 versions
- **iOS Safari:** iOS 14+
- **Chrome Mobile:** Latest

### Graceful Degradation

- CSS: Modern features with fallbacks
- JavaScript: Progressive enhancement
- Images: `<picture>` with fallback `<img>`
- Fonts: System font stack fallback

---

## Accessibility Features

### WCAG 2.2 Level AA Compliance

✅ **Perceivable**
- Alt text for images
- Proper color contrast
- Responsive text sizing

✅ **Operable**
- Keyboard navigation
- Skip to main content
- Focus indicators
- No keyboard traps

✅ **Understandable**
- Semantic HTML
- Clear navigation
- Consistent layout
- Error prevention

✅ **Robust**
- Valid HTML
- ARIA attributes
- Screen reader tested
- Cross-browser compatible

---

## Troubleshooting

### Critical CSS not inlining?
Check media layout `css/inline` exists and `critical.css` is uploaded.

### Global CSS not loading?
Verify `wheaton.css` path in media library matches `head.hbs`.

### Modules not loading?
Check browser console for 404s. Verify module paths in `scripts.hbs`.

### Module loads but doesn't work?
Ensure proper `data-module` attribute and required HTML structure.

### Icons not showing?
Create icon partials in T4 (e.g., `icons/search`).

---

## Next Steps

1. ✅ **Set up layout** - Follow T4-LAYOUT-SETUP-GUIDE.md
2. 📋 **Create components** - Build Tier 1 components
3. 📋 **Build content types** - Map to component needs
4. 📋 **Test in staging** - Verify everything works
5. 📋 **Deploy to production** - Incremental rollout

---

## Resources

- **Setup Guide:** [T4-LAYOUT-SETUP-GUIDE.md](./T4-LAYOUT-SETUP-GUIDE.md)
- **Integration Plan:** [TERMINALFOUR-HANDLEBARS-INTEGRATION-PLAN.md](../TERMINALFOUR-HANDLEBARS-INTEGRATION-PLAN.md)
- **Migration Strategy:** [T4-MIGRATION-STRATEGY.md](../T4-MIGRATION-STRATEGY.md)
- **Conversion Cheat Sheet:** [T4-TAG-TO-HANDLEBARS-CHEATSHEET.md](../T4-TAG-TO-HANDLEBARS-CHEATSHEET.md)
- **Component Inventory:** [T4-COMPONENT-INVENTORY.md](../T4-COMPONENT-INVENTORY.md)

---

## Version

**Version:** 1.0.0  
**T4 Version:** 8.4.1.2+  
**Last Updated:** 2025-01-13
