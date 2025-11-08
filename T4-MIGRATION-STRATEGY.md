# TerminalFour Migration Strategy
## From Legacy T4 Tags to Handlebars + Modular Architecture

**T4 Version:** 8.4.1.2 ✅  
**Environments:** Staging + Production ✅  
**Goal:** Migrate from traditional T4 tags → Handlebars + Modular JS + Simplified CSS

---

## Migration Overview

### What We're Changing

**FROM:**
- Traditional T4 tags (`<t4 type="content" name="..." />`)
- Monolithic JavaScript bundles
- Complex CSS with legacy selectors
- PHP-style conditional logic

**TO:**
- Handlebars expressions (`{{publish element="..."}}`)
- Modular JavaScript (lazy-loaded by component)
- Simplified CSS (Lightning CSS pipeline)
- Native Handlebars conditionals and loops

---

## Phase 1: Preparation (Week 1)

### 1.1 Audit Existing T4 Content
- [ ] Document all existing content types using legacy T4 tags
- [ ] Identify which content types are actively used
- [ ] Map legacy field names to new Handlebars-friendly names
- [ ] Export sample content for testing

### 1.2 Set Up Staging Environment
- [ ] Create test section in staging for new Handlebars components
- [ ] Set up version control for Handlebars partials (outside T4)
- [ ] Configure deployment workflow (local → staging → production)
- [ ] Test Direct Edit inline editing capability

### 1.3 Create Media Layouts
Build these first (needed by all components):

**Priority 1:**
```
media-layouts/
├── image-responsive-portrait.hbs    (2:3 ratio)
├── image-responsive-landscape.hbs   (16:9 ratio)
├── image-responsive-square.hbs      (1:1 ratio)
└── svg-inline.hbs                   (inline SVG)
```

**Media Layout Template Example:**
```handlebars
{{!-- image-responsive-portrait.hbs --}}
{{#scale element="Image" max-width="1200" max-height="1800"}}
  <source
    type="image/webp"
    srcset="
      https://pxl-wheatonedu.terminalfour.net/fit-in/320x480/filters:quality(80)/filters:format(webp){{path}} 320w,
      https://pxl-wheatonedu.terminalfour.net/fit-in/640x960/filters:quality(80)/filters:format(webp){{path}} 640w,
      https://pxl-wheatonedu.terminalfour.net/fit-in/1200x1800/filters:quality(80)/filters:format(webp){{path}} 1200w"
    sizes="(max-width: 767px) 100vw, 50vw">
  <source
    type="image/jpeg"
    srcset="
      https://pxl-wheatonedu.terminalfour.net/fit-in/320x480/filters:quality(80){{path}} 320w,
      https://pxl-wheatonedu.terminalfour.net/fit-in/640x960/filters:quality(80){{path}} 640w,
      https://pxl-wheatonedu.terminalfour.net/fit-in/1200x1800/filters:quality(80){{path}} 1200w"
    sizes="(max-width: 767px) 100vw, 50vw">
  <img
    src="https://pxl-wheatonedu.terminalfour.net/fit-in/640x960/filters:quality(80){{path}}"
    alt="{{publish element="Alt Text"}}"
    width="{{width}}"
    height="{{height}}"
    loading="lazy"
    decoding="async" />
{{/scale}}
```

---

## Phase 2: Foundation Components (Week 2)

### 2.1 Create Icon Partials System

**Create these icon partials:**
```
partials/icons/
├── left-arrow.hbs
├── right-arrow.hbs
├── close.hbs
├── search.hbs
└── chevron-down.hbs
```

**Example - left-arrow.hbs:**
```handlebars
<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <title>Left Arrow</title>
  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

### 2.2 Build Tier 1 Components

**Priority order:**

1. **General Content** (simplest, test Handlebars setup)
2. **Section Header** (used on most pages)
3. **Text/Image** (most common content block)
4. **CTA Callout** (high visibility)
5. **Page Header** (template-level component)

### 2.3 Legacy T4 Tag → Handlebars Conversion Examples

**Legacy T4 Tag:**
```php
<t4 type="content" name="Title" output="normal" modifiers="striptags,htmlentities" />
```

**Handlebars Equivalent:**
```handlebars
{{publish element="Title" inline-edit="true"}}
```

**Legacy T4 Tag (HTML):**
```php
<t4 type="content" name="Content" output="normal" modifiers="medialibrary,nav_sections" />
```

**Handlebars Equivalent:**
```handlebars
{{{publish element="Content" inline-edit="true"}}}
```

**Legacy T4 Tag (Conditional):**
```php
<t4 type="content" name="Subhead" output="selective-output" process-format="true" 
    format="<span class=&quot;subhead&quot;><t4 type=&quot;content&quot; name=&quot;Subhead&quot; output=&quot;normal&quot; /></span>" />
```

**Handlebars Equivalent:**
```handlebars
{{#ifSet element="Subhead"}}
  <span class="subhead">{{publish element="Subhead"}}</span>
{{/ifSet}}
```

**Legacy T4 Tag (Link):**
```php
<a href="<t4 type="content" name="CTA" output="linkurl" modifiers="nav_sections" />">
  <t4 type="content" name="CTA" output="linktext" />
</a>
```

**Handlebars Equivalent:**
```handlebars
{{#link element="CTA"}}
  <a href="{{linkUrl}}" class="bm--cta style-primary">{{linkText}}</a>
{{/link}}
```

---

## Phase 3: JavaScript Modularization (Week 3)

### 3.1 Module Loading Strategy

**Current State:** Monolithic bundle  
**Target State:** Lazy-loaded modules per component

**Module Loader (already documented in TERMINALFOUR-JS-IMPLEMENTATION.md):**
```javascript
// Add to base template before </body>
<script>
(function() {
  const modules = {
    'accordion': 'js/modules/accordion.min.js',
    'carousel': 'js/modules/carousel.min.js',
    'modal': 'js/modules/modal.min.js',
    'marquee': 'js/modules/marquee.min.js',
    'gallery-staggered': 'js/modules/gallery-staggered.min.js',
    'faculty-filter': 'js/modules/faculty-filter.min.js',
    'program-finder': 'js/modules/program-finder.min.js'
  };
  
  // Module initialization logic here
})();
</script>
```

### 3.2 Upload Modules to T4 Media Library

**File structure:**
```
Media Library/
└── js/
    └── modules/
        ├── accordion.min.js
        ├── carousel.min.js
        ├── modal.min.js
        ├── marquee.min.js
        ├── gallery-staggered.min.js
        ├── faculty-filter.min.js
        ├── program-finder.min.js
        └── navigation.min.js
```

### 3.3 Component Data Attributes

Each component using JS must have `data-module` attribute:

```handlebars
<div data-module="carousel" data-bravery-carousel>
  <!-- carousel content -->
</div>
```

---

## Phase 4: CSS Simplification (Week 4)

### 4.1 CSS Architecture Review

**Current:** Lightning CSS pipeline (already optimized) ✅  
**Action Items:**
- [ ] Remove legacy `.button` selectors (already done per memory)
- [ ] Audit for unused CSS
- [ ] Verify no duplicate styles between critical.css and wheaton.scss
- [ ] Test CSS build in T4 context

### 4.2 Critical CSS Strategy

**Per memory:** Every page inlines `critical.css`

**Ensure critical.css includes:**
- Reset/base styles
- Navigation (above fold)
- Hero components
- Core typography
- Layout containers

**Keep in wheaton.scss:**
- Component-specific styles
- Below-fold content
- Interactive states
- Print styles

---

## Phase 5: Card & Carousel Components (Week 5)

### 5.1 Card Components with Repeaters

**Example: Carousel Cards Content Type**

**Fields:**
```
- Section Title (Text)
- Section Description (HTML)
- Carousel Header (Text)
- Cards (Repeater) ← Key feature
  └── Card Content Type:
      - Image (Media)
      - Content (HTML)
      - Link (Link)
```

**Handlebars Partial:**
```handlebars
<section class="bm--content-container bm--carousel-container is-fullwidth">
  <div class="bm--content">
    <header class="bm--section-title">
      <h2 class="is-fancy">{{publish element="Section Title"}}</h2>
      {{{publish element="Section Description"}}}
    </header>
    
    <div data-module="carousel" data-bravery-carousel="simple-heading">
      <header>
        <div class="content">
          <h3>{{publish element="Carousel Header"}}</h3>
        </div>
        <div class="bm-carousel--controls" data-bravery-carousel-controls>
          <button class="bm-carousel--control" data-bravery-carousel-prev disabled>
            {{> icons/left-arrow}}
            <span class="sr-only">Previous</span>
          </button>
          <button class="bm-carousel--control" data-bravery-carousel-next>
            {{> icons/right-arrow}}
            <span class="sr-only">Next</span>
          </button>
        </div>
      </header>
      
      <div class="bm-carousel--items" data-bravery-carousel-items>
        {{#each (repeater element="Cards")}}
          <div class="bm--card is-layout-flex has-bg--cream is-layout--stacked bm--is-card">
            <picture data-ar="1:1">
              {{{media id=(mediaId element="Image") layout="image/card-square"}}}
            </picture>
            <article class="card--content">
              {{{publish element="Content"}}}
              {{#ifSet element="Link"}}
                <div class="bm--buttons">
                  {{#link element="Link"}}
                    <a href="{{linkUrl}}" class="bm--cta style-outline has-arrow">{{linkText}}</a>
                  {{/link}}
                </div>
              {{/ifSet}}
            </article>
          </div>
        {{/each}}
      </div>
    </div>
  </div>
</section>
```

---

## Phase 6: Home Hero & Complex Components (Week 6)

### 6.1 Home Hero Migration

**Current Nunjucks:** Uses hardcoded images  
**Target:** Dynamic repeater for gallery images

**Content Type Fields:**
```
- Mobile Hero Image (Media)
- Prehead (Text, Default: "For Christ and His Kingdom")
- Headline (Text)
- CTA Text (Text, Default: "Explore Our Programs")
- Gallery Images (Repeater)
  └── Gallery Image Content Type:
      - Image (Media)
      - Alt Text (Text)
```

**Key Challenge:** Marquee gallery with ~10 images  
**Solution:** Use repeater + lazy loading

---

## Phase 7: Testing & QA (Week 7)

### 7.1 Component Testing Checklist

For each migrated component:

**Functionality:**
- [ ] Content displays correctly
- [ ] Inline editing works (Direct Edit)
- [ ] Links resolve properly
- [ ] Images load with correct srcset
- [ ] JavaScript modules initialize
- [ ] Responsive behavior works

**Accessibility:**
- [ ] WCAG 2.2 AA compliance
- [ ] Keyboard navigation
- [ ] Screen reader testing
- [ ] ARIA attributes present
- [ ] Focus management

**Performance:**
- [ ] Images lazy load
- [ ] JavaScript loads on demand
- [ ] No layout shift (CLS)
- [ ] Fast First Contentful Paint

### 7.2 Cross-Browser Testing

Test matrix:
- Safari (macOS, iOS)
- Chrome (Windows, macOS, Android)
- Firefox (Windows, macOS)
- Edge (Windows)

---

## Phase 8: Content Migration & Launch (Week 8)

### 8.1 Content Migration Strategy

**Approach:** Parallel run
1. Keep legacy T4 tag content types active
2. Create new Handlebars content types alongside
3. Migrate content page-by-page
4. Test each page in staging
5. Deploy to production incrementally

### 8.2 Rollback Plan

**If issues arise:**
1. Revert to legacy content layout
2. Content data remains intact
3. Fix issues in staging
4. Re-deploy when ready

---

## Migration Priorities by Page Type

### Tier 1: Homepage (Week 2-3)
- Home Hero
- General Content
- Carousel Cards
- CTA Callout

### Tier 2: Program Pages (Week 4-5)
- Page Header
- Text/Image
- Accordion
- Program Finder

### Tier 3: Department Pages (Week 5-6)
- Faculty listings
- Gallery Staggered
- Quote Carousel
- Stats Callout

### Tier 4: Utility Pages (Week 7)
- Forms (Slate)
- Tables
- Video Embeds
- Breadcrumbs

---

## Success Metrics

### Technical Metrics
- [ ] 100% of components use Handlebars (no legacy T4 tags)
- [ ] JavaScript modules lazy-load on demand
- [ ] CSS bundle size reduced by 20%+
- [ ] Page load time improved by 15%+
- [ ] Lighthouse score 90+ across all pages

### Editor Experience
- [ ] Inline editing works on all text fields
- [ ] Content types are intuitive
- [ ] Repeaters work smoothly
- [ ] Media uploads are straightforward
- [ ] Training materials complete

### Accessibility
- [ ] WCAG 2.2 AA compliance maintained
- [ ] No accessibility regressions
- [ ] Screen reader testing passed
- [ ] Keyboard navigation verified

---

## Risk Mitigation

### Risk 1: Content Editor Confusion
**Mitigation:**
- Create detailed training materials
- Provide side-by-side comparison docs
- Offer hands-on training sessions
- Set up support channel

### Risk 2: JavaScript Module Loading Issues
**Mitigation:**
- Test module loader thoroughly in staging
- Implement fallback for failed loads
- Monitor console errors
- Have rollback plan ready

### Risk 3: Image Performance Degradation
**Mitigation:**
- Test srcset generation in T4
- Verify CDN integration (pxl-wheatonedu.terminalfour.net)
- Monitor Core Web Vitals
- Optimize image sizes

### Risk 4: Direct Edit Inline Editing Breaks
**Mitigation:**
- Test inline-edit="true" on all components
- Document which elements support it
- Provide alternative editing workflow
- Report bugs to T4 support

---

## Next Immediate Actions

1. **This Week:**
   - [ ] Create media layouts in staging T4
   - [ ] Build icon partials
   - [ ] Convert General Content component
   - [ ] Test inline editing

2. **Next Week:**
   - [ ] Build Section Header, Text/Image, CTA Callout
   - [ ] Upload JavaScript modules to media library
   - [ ] Test module loader
   - [ ] Begin homepage migration

3. **Week 3:**
   - [ ] Build card components with repeaters
   - [ ] Build carousel components
   - [ ] Test JavaScript integration
   - [ ] QA responsive behavior

---

## Documentation Deliverables

- [x] Integration Plan (TERMINALFOUR-HANDLEBARS-INTEGRATION-PLAN.md)
- [x] Quick Reference (T4-PARTIALS-QUICK-REFERENCE.md)
- [x] Component Inventory (T4-COMPONENT-INVENTORY.md)
- [x] Migration Strategy (this document)
- [ ] Content Editor Training Guide (create next)
- [ ] T4 Tag → Handlebars Conversion Cheat Sheet (create next)
- [ ] Component Testing Checklist (create next)

---

## Questions for Stakeholders

1. Which pages/sections have highest traffic? (prioritize those)
2. Are there any upcoming content deadlines? (avoid migration during busy periods)
3. Who are the primary content editors? (for training)
4. What's the approval process for staging → production?
5. Are there any legacy content types that can be deprecated?
6. What's the expected timeline for full migration?
