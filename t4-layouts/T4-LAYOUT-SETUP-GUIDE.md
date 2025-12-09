# T4 Page Layout Setup Guide

Complete guide for implementing the Handlebars page layout system in TerminalFour.

---

## File Structure Overview

```
t4-layouts/
├── base-layout.hbs           # Main page template
├── partials/
│   ├── head.hbs              # <head> section with critical CSS
│   ├── header.hbs            # Site header/navigation
│   ├── footer.hbs            # Site footer
│   └── scripts.hbs           # Modular JS loader
└── media-layouts/
    └── css-inline.hbs        # CSS inline layout
```

---

## Step 1: Upload Files to TerminalFour

### 1.1 Create Page Layout in T4

1. Navigate to **Template Manager** → **Page Layouts**
2. Click **Add New Page Layout**
3. Name: `Base Layout - Handlebars`
4. Processor: **Handlebars content**
5. Paste contents of `base-layout.hbs`

### 1.2 Create Partials

Navigate to **Template Manager** → **Partials**

Create these partials:

| Partial Name | File | Description |
|--------------|------|-------------|
| `head` | `partials/head.hbs` | Head section with meta, critical CSS |
| `header` | `partials/header.hbs` | Site header/navigation |
| `footer` | `partials/footer.hbs` | Site footer |
| `scripts` | `partials/scripts.hbs` | Modular JavaScript loader |

**For each partial:**
1. Click **Add New Partial**
2. Name: (use name from table above)
3. Processor: **Handlebars content**
4. Paste contents from corresponding file

### 1.3 Create Media Layout for CSS

Navigate to **Template Manager** → **Media Layouts**

1. Click **Add New Media Layout**
2. Name: `css/inline`
3. Processor: **Handlebars content**
4. Paste contents of `media-layouts/css-inline.hbs`

---

## Step 2: Upload Assets to Media Library

### 2.1 CSS Files

Upload to Media Library at `/css/`:
- `critical.css` - Inlined critical CSS (from your build)
- `wheaton.css` - Main stylesheet (from your build)

**Build these files locally:**
```bash
npm run build
# Outputs to _site/assets/css/
```

**Upload to T4:**
1. Navigate to **Media Library**
2. Create folder: `css`
3. Upload:
   - `critical.css` (from `_site/assets/css/critical.css`)
   - `wheaton.css` (from `_site/assets/css/wheaton.css`)

### 2.2 JavaScript Modules

Upload to Media Library at `/js/modules/`:

Create folder structure:
```
Media Library/
└── js/
    └── modules/
        ├── navigation.min.js
        ├── carousel.min.js
        ├── accordion.min.js
        ├── modal.min.js
        ├── marquee.min.js
        ├── gallery-staggered.min.js
        ├── faculty-filter.min.js
        └── program-finder.min.js
```

**Build modules locally:**
```bash
npm run build
# Outputs to _site/assets/js/modules/
```

**Upload each module to T4 Media Library**

### 2.3 Images & Icons

Upload to Media Library:
- `/images/wheaton-logo.svg`
- `/images/wheaton-logo-white.svg`
- `/favicon.ico`
- `/apple-touch-icon.png`

---

## Step 3: Create Icon Partials

Navigate to **Template Manager** → **Partials**

Create partials in `icons/` namespace:

### Example: icons/search

```handlebars
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

**Create these icon partials:**
- `icons/search`
- `icons/left-arrow`
- `icons/right-arrow`
- `icons/close`
- `icons/chevron-down`
- `icons/facebook`
- `icons/twitter`
- `icons/instagram`
- `icons/youtube`
- `icons/linkedin`

**Usage in templates:**
```handlebars
{{> icons/search}}
```

---

## Step 4: Create Base Content Type

Create a content type for pages using this layout.

### Content Type: Standard Page

**Fields:**
1. **Page Title** (Text, Required)
   - Used in `<title>` tag and meta

2. **Meta Description** (Text, 160 chars max)
   - SEO description

3. **Social Image** (Media)
   - Open Graph image for social sharing

4. **Page Content** (HTML, Required)
   - Main page content area

5. **Additional Head Code** (HTML)
   - Optional custom head elements

6. **Analytics Code** (HTML)
   - Optional analytics scripts

7. **Additional Scripts** (HTML)
   - Optional page-specific scripts

---

## Step 5: Test the Layout

### 5.1 Create Test Page in Staging

1. Create new content using "Standard Page" content type
2. Fill in:
   - Page Title: "Test Page"
   - Meta Description: "Testing the new Handlebars layout"
   - Page Content: `<h1>Hello World</h1><p>This is a test.</p>`

3. Assign the "Base Layout - Handlebars" page layout
4. Preview the page

### 5.2 Verify Checklist

- [ ] Page title appears in browser tab
- [ ] Meta description is in `<head>`
- [ ] Critical CSS is inlined in `<style>` tag
- [ ] Global CSS loads with `<link>` tag
- [ ] Header displays with logo
- [ ] Footer displays with all sections
- [ ] No JavaScript errors in console
- [ ] Module loader script is present

---

## Step 6: Configure Module Loading

### 6.1 Test Module Loading

Create a test page with a carousel:

**Page Content:**
```handlebars
<section class="bm--content-container is-fullwidth">
  <div data-module="carousel" data-bravery-carousel>
    <div class="bm-carousel--items" data-bravery-carousel-items>
      <div class="carousel-item">Slide 1</div>
      <div class="carousel-item">Slide 2</div>
      <div class="carousel-item">Slide 3</div>
    </div>
    <button data-bravery-carousel-prev>Previous</button>
    <button data-bravery-carousel-next>Next</button>
  </div>
</section>
```

**Expected behavior:**
1. Page loads
2. Module loader detects `data-module="carousel"`
3. Carousel module loads from media library
4. Carousel initializes automatically
5. Console shows: `✓ Module loaded: carousel`

### 6.2 Verify in Browser Console

Open browser console and check:
```javascript
// Check loaded modules
window.wheatonModuleLoader.loaded
// Should show Set with loaded module names

// Check module registry
window.wheatonModuleLoader.modules
// Should show object with all module paths

// Manually load a module (for testing)
window.wheatonModuleLoader.load('accordion')
```

---

## Step 7: Optimize Critical CSS

### 7.1 Generate Critical CSS

Your build already generates critical CSS. Ensure it includes:

**Must include in critical.css:**
- CSS reset/normalize
- Typography base styles
- Header/navigation (above fold)
- Hero components
- Layout containers (`.bm--content-container`, etc.)
- Button base styles (`.bm--cta`)
- Utility classes (`.sr-only`, `.skip-link`)

**Keep in wheaton.css:**
- Component-specific styles
- Below-fold content
- Interactive states
- Print styles
- Animations

### 7.2 Test Critical CSS

1. Load page with network throttling (Slow 3G)
2. Page should be readable immediately (no FOUC)
3. Styles should not shift when wheaton.css loads

---

## Step 8: Configure Navigation

### Option A: Static Navigation (Temporary)

The current `header.hbs` has static navigation links. This works for initial testing.

### Option B: Dynamic Navigation (Recommended)

Replace navigation section in `header.hbs` with T4 NavObj:

```handlebars
<nav id="primary-navigation" class="primary-nav" role="navigation" data-module="navigation">
  {{!-- Use T4 NavObj to generate navigation --}}
  {{!-- Implementation depends on your T4 navigation structure --}}
  <ul class="nav-menu">
    {{!-- Navigation items will be generated by T4 --}}
  </ul>
</nav>
```

**Note:** Navigation implementation depends on your T4 site structure. You may need to create a custom navigation content type or use T4's NavObj system.

---

## Step 9: Performance Optimization

### 9.1 Preload Critical Resources

Already configured in `head.hbs`:
- ✅ Preconnect to CDN
- ✅ DNS prefetch
- ✅ Preload global CSS
- ✅ Critical CSS inlined

### 9.2 Lazy Load Images

Ensure all images use:
```handlebars
<img src="..." loading="lazy" decoding="async" />
```

### 9.3 Defer Non-Critical Scripts

Module loader already:
- ✅ Loads scripts asynchronously
- ✅ Only loads modules when needed
- ✅ Prevents duplicate loads

---

## Step 10: Accessibility Verification

### 10.1 Test Checklist

- [ ] Skip to main content link works
- [ ] Keyboard navigation through header
- [ ] Mobile menu toggle has proper ARIA
- [ ] All images have alt text
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] Color contrast meets WCAG 2.2 AA
- [ ] Focus indicators visible
- [ ] Screen reader announces navigation properly

### 10.2 Test with Tools

- **axe DevTools** - Browser extension for accessibility testing
- **WAVE** - Web accessibility evaluation tool
- **Lighthouse** - Chrome DevTools audit
- **Screen reader** - NVDA (Windows) or VoiceOver (Mac)

---

## Troubleshooting

### Issue: Critical CSS not inlining

**Check:**
1. Media layout `css/inline` exists
2. `critical.css` uploaded to media library
3. Media ID path is correct: `css/critical.css`

**Fix:**
```handlebars
{{!-- Verify this in head.hbs --}}
{{{media id="css/critical.css" layout="css/inline"}}}
```

### Issue: Global CSS not loading

**Check:**
1. `wheaton.css` uploaded to media library
2. Path is correct in preload link

**Fix:**
```handlebars
{{!-- Verify this in head.hbs --}}
<link rel="preload" href="{{{media id="css/wheaton.css"}}}" as="style" onload="this.onload=null;this.rel='stylesheet'">
```

### Issue: JavaScript modules not loading

**Check:**
1. All modules uploaded to `/js/modules/` in media library
2. Module names match registry in `scripts.hbs`
3. Browser console for 404 errors

**Fix:**
Update module paths in `scripts.hbs`:
```javascript
const MODULES = {
  'carousel': '{{{media id="js/modules/carousel.min.js"}}}',
  // ... etc
};
```

### Issue: Module initializes but doesn't work

**Check:**
1. Module has proper `data-module` attribute
2. Module exposes `window.wheaton[moduleName].init` function
3. Required HTML structure is correct
4. No JavaScript errors in console

**Debug:**
```javascript
// Check if module loaded
window.wheatonModuleLoader.loaded.has('carousel')

// Check if module has init function
window.wheaton.carousel
window.wheaton.carousel.init
```

### Issue: Icons not displaying

**Check:**
1. Icon partials created in T4
2. Partial names match usage (e.g., `icons/search`)
3. SVG code is valid

**Fix:**
```handlebars
{{!-- Verify partial exists and is called correctly --}}
{{> icons/search}}
```

---

## Production Deployment Checklist

Before deploying to production:

- [ ] All partials created and tested in staging
- [ ] All media files uploaded (CSS, JS, images)
- [ ] Icon partials created
- [ ] Test page renders correctly
- [ ] Module loading works
- [ ] Critical CSS inlines properly
- [ ] Global CSS loads and applies
- [ ] Navigation works (desktop + mobile)
- [ ] Footer displays correctly
- [ ] No console errors
- [ ] Accessibility tested
- [ ] Performance tested (Lighthouse score 90+)
- [ ] Cross-browser tested
- [ ] Mobile responsive verified
- [ ] SEO meta tags present
- [ ] Social sharing meta tags work

---

## Next Steps

1. **Create component partials** - Start with Tier 1 components
2. **Build content types** - Map to component needs
3. **Migrate content** - Page by page in staging
4. **Test thoroughly** - Each component and page
5. **Deploy to production** - Incremental rollout

---

## Support Resources

- [T4 Handlebars Documentation](https://docs.terminalfour.com/documentation/developer-resources/handlebars/)
- [Integration Plan](../TERMINALFOUR-HANDLEBARS-INTEGRATION-PLAN.md)
- [Migration Strategy](../T4-MIGRATION-STRATEGY.md)
- [Component Inventory](../T4-COMPONENT-INVENTORY.md)
- [Conversion Cheat Sheet](../T4-TAG-TO-HANDLEBARS-CHEATSHEET.md)
