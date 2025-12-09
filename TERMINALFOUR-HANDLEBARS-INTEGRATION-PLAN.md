# TerminalFour Handlebars Integration Plan

## Overview

This document outlines the strategy for converting Nunjucks components to TerminalFour Handlebars partials. The goal is to create a modular, maintainable system that leverages TerminalFour's content management capabilities while preserving the design system's integrity.

---

## TerminalFour Handlebars Capabilities

Based on the [official documentation](https://docs.terminalfour.com/documentation/developer-resources/handlebars/handlebars-getting-started/), TerminalFour supports:

### Available Helpers

**Content Output:**
- `{{publish element="ElementName"}}` - Output text/HTML elements (use `{{{triple}}}` for HTML)
- `{{publish element="ElementName" inline-edit="true"}}` - Enable Direct Edit inline editing
- `{{{file element="FileElement"}}}` - Output file elements
- `{{filesize element="FileElement"}}` - Get file size

**List Elements:**
- `{{selectedNames element="ListElement" separator="|"}}` - Selected list item names
- `{{selectedValues element="ListElement" separator="|"}}` - Selected list item values
- `{{#each (list element="ListElement")}}...{{/each}}` - Loop all list items
- `{{#each (selected element="ListElement")}}...{{/each}}` - Loop selected items only
- `{{#each (listById id="123")}}...{{/each}}` - Loop list by ID

**Links:**
- `{{#link element="LinkElement"}}{{linkUrl}} {{linkText}}{{/link}}` - Access link URL and text

**Media & Images:**
- `{{{media id=(mediaId element="MediaElement") layout="text/alternative"}}}` - Output media with specific layout
- `{{#scale element="ImageElement" max-width="640" max-height="480"}}...{{/scale}}` - Scale images

**Repeaters (8.4.1+):**
- `{{repeater element="RepeaterElement" layout="text/example"}}` - Output with specific layout
- `{{#each (repeater element="RepeaterElement")}}...{{/each}}` - Loop repeater items

**Dates:**
- `{{dateFormat (dateElement element="DateElement") "YYYY/MM/dd hh:mma"}}` - Format dates

**Conditionals:**
- `{{#ifSet element="ElementName"}}...{{else}}...{{/ifSet}}` - Check if element has value
- `{{#if condition}}...{{else}}...{{/if}}` - Standard conditional
- `{{#unless condition}}...{{/unless}}` - Inverse conditional

**String Manipulation:**
- `{{abbreviate}}`, `{{capitalize}}`, `{{replace}}`, `{{slugify}}`, etc.

**Processing:**
- `{{process (publish element="CodeElement")}}` - Process user-supplied Handlebars
- `{{#raw}}...{{/raw}}` - Output without processing

**Metadata:**
- `{{contentId}}`, `{{contentName}}`, `{{sectionId}}`, `{{sectionName}}`
- `{{canonicalURL}}`, `{{fullURL}}`

### Loop Variables (in `{{#each}}` blocks)
- `@first`, `@last`, `@odd`, `@even`
- `@index` (0-based), `@index_1` (1-based)
- `@length` (total items)

---

## Component Mapping Strategy

### Tier 1: Simple Components (Direct Conversion)
These components have straightforward content needs and can be directly converted.

#### 1. **Text/Image Component** (`bm-text-image`)
**Content Type Fields:**
```
- Image (Media, Required)
- Image Aspect Ratio (Select: portrait|landscape|square)
- Image Position (Select: left|right)
- Size (Select: normal|small)
- Icon (Select: optional icon classes)
- Subhead (Text)
- Title (Text, Required)
- Content (HTML, Required)
- Optional Quote (Text)
- Quote Citation (Text)
- Call to Action (Link)
- Background Color (Select: white|light-blue|cream)
```

**Handlebars Partial:** `text-image.hbs`
```handlebars
<section class="bm--text-image {{#ifSet element="Background Color"}}has-bg--{{publish element="Background Color"}}{{/ifSet}}" 
         data-image="{{publish element="Image Position"}}" 
         data-size="{{publish element="Size"}}">
  <figure>
    {{#if (eq (publish element="Image Aspect Ratio") "square")}}
      {{{media id=(mediaId element="Image") layout="image/resp-square"}}}
    {{else if (eq (publish element="Image Aspect Ratio") "landscape")}}
      {{{media id=(mediaId element="Image") layout="image/resp-landscape"}}}
    {{else}}
      {{{media id=(mediaId element="Image") layout="image/resp-portrait"}}}
    {{/if}}
  </figure>
  <article class="content">
    {{#ifSet element="Icon"}}
      <span class="bm--icon {{publish element="Icon"}}"></span>
    {{/ifSet}}
    
    {{#ifSet element="Subhead"}}
      <span class="subhead">{{publish element="Subhead"}}</span>
    {{/ifSet}}
    
    <h2>{{publish element="Title"}}</h2>
    
    {{#ifSet element="Optional Quote"}}
      <div class="bm--quote">
        <blockquote><p>{{publish element="Optional Quote"}}</p></blockquote>
        {{#ifSet element="Quote Citation"}}
          <cite>{{publish element="Quote Citation"}}</cite>
        {{/ifSet}}
      </div>
    {{/ifSet}}
    
    {{{publish element="Content"}}}
    
    {{#ifSet element="Call to Action"}}
      {{#link element="Call to Action"}}
        <a href="{{linkUrl}}" class="bm--cta style-secondary has-arrow">{{linkText}}</a>
      {{/link}}
    {{/ifSet}}
  </article>
</section>
```

---

#### 2. **Callout Component** (`bm-callout`)
**Content Type Fields:**
```
- Image (Media, Required)
- Image Position (Select: left|right)
- Title (Text, Required)
- Content (HTML, Required)
```

**Handlebars Partial:** `callout.hbs`
```handlebars
<article class="bm--callout" data-image="{{publish element="Image Position"}}">
  {{{media id=(mediaId element="Image") layout="image/callout"}}}
  <div>
    <h2>{{publish element="Title" inline-edit="true"}}</h2>
    {{{publish element="Content" inline-edit="true"}}}
  </div>
</article>
```

---

#### 3. **Collapsible/Accordion** (`bm-collapsible`)
**Content Type Fields:**
```
- Accordion Items (Repeater)
  - Item Title (Text, Required)
  - Item Content (HTML, Required)
```

**Handlebars Partial:** `collapsible.hbs`
```handlebars
<article class="bm--collapsible" data-collapsible>
  {{#each (repeater element="Accordion Items")}}
    <h3>
      <button aria-controls="collapsible-{{@index}}" aria-expanded="false">
        {{publish element="Item Title"}}
      </button>
    </h3>
    <div id="collapsible-{{@index}}" hidden>
      {{{publish element="Item Content"}}}
    </div>
  {{/each}}
</article>
```

---

#### 4. **General Content** (`bm-general-content`)
**Content Type Fields:**
```
- Content (HTML, Required)
```

**Handlebars Partial:** `general-content.hbs`
```handlebars
<div class="bm--content">
  {{{publish element="Content" inline-edit="true"}}}
</div>
```

---

### Tier 2: Card Components

#### 5. **Card - Linked** (`bm-card-linked`)
**Content Type Fields:**
```
- Image (Media, Required)
- Title (Text, Required)
- Description (HTML, Required)
- Link (Link, Required)
- CTA Text (Text, Default: "Learn More")
```

**Handlebars Partial:** `card-linked.hbs`
```handlebars
{{#link element="Link"}}
  <a class="bm--card bm--is-card has-image-top" href="{{linkUrl}}">
    <figure>
      {{{media id=(mediaId element="Image") layout="image/card"}}}
    </figure>
    <article class="card--content">
      <h3>{{publish element="Title"}}</h3>
      {{{publish element="Description"}}}
    </article>
    <p>
      <span class="bm--cta style-primary">
        {{#ifSet element="CTA Text"}}{{publish element="CTA Text"}}{{else}}Learn More{{/ifSet}}
      </span>
    </p>
  </a>
{{/link}}
```

---

#### 6. **Card - Image Top** (`bm-card-image-top`)
**Content Type Fields:**
```
- Image (Media, Required)
- Title (Text, Required)
- Content (HTML, Required)
- Link (Link, Optional)
- Background Color (Select: white|cream|light-blue)
- Layout (Select: stacked|horizontal)
```

**Handlebars Partial:** `card-image-top.hbs`
```handlebars
<div class="bm--card is-layout-flex {{#ifSet element="Background Color"}}has-bg--{{publish element="Background Color"}}{{/ifSet}} is-layout--{{publish element="Layout"}} bm--is-card">
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
```

---

### Tier 3: Complex Components with Repeaters

#### 7. **Carousel - Cards** (`bm-carousel-cards`)
**Content Type Fields:**
```
- Section Title (Text, Required)
- Section Description (HTML)
- Carousel Header (Text)
- Carousel Style (Select: simple-heading|default)
- Carousel Breakout (Select: default|full)
- Background Color (Select: white|cream|light-blue)
- Cards (Repeater)
  - Card Image (Media, Required)
  - Card Content (HTML, Required)
  - Card Link (Link, Optional)
```

**Handlebars Partial:** `carousel-cards.hbs`
```handlebars
<section class="bm--content-container bm--carousel-container {{#ifSet element="Background Color"}}has-bg--{{publish element="Background Color"}}{{/ifSet}} is-fullwidth">
  <div class="bm--content">
    <header class="bm--section-title">
      <h2 class="is-fancy">{{publish element="Section Title"}}</h2>
      {{#ifSet element="Section Description"}}
        {{{publish element="Section Description"}}}
      {{/ifSet}}
    </header>
    
    <div data-bravery-carousel="{{publish element="Carousel Style"}}" 
         data-bravery-carousel-breakout="{{publish element="Carousel Breakout"}}" 
         class="is-carousel-side-panel">
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
      
      <div class="bm-carousel--items" data-bravery-carousel-items aria-roledescription="carousel">
        {{#each (repeater element="Cards")}}
          <div class="bm--card is-layout-flex has-bg--cream is-layout--stacked bm--is-card">
            <picture data-ar="1:1">
              {{{media id=(mediaId element="Card Image") layout="image/card-square"}}}
            </picture>
            <article class="card--content">
              {{{publish element="Card Content"}}}
              {{#ifSet element="Card Link"}}
                <div class="bm--buttons">
                  {{#link element="Card Link"}}
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

#### 8. **Home Hero** (`bm-home-hero`)
**Content Type Fields:**
```
- Mobile Image (Media, Required)
- Prehead (Text, Default: "For Christ and His Kingdom")
- Headline (Text, Required)
- CTA Text (Text, Default: "Explore Our Programs")
- Gallery Images (Repeater)
  - Image (Media, Required)
  - Alt Text (Text, Required)
```

**Handlebars Partial:** `home-hero.hbs`
```handlebars
<section class="bm-home--hero has-bg--blue-gradient-light is-fullwidth">
  <section class="home--greeting">
    <figure data-ar class="bm-home-hero--image bm-mobile">
      {{{media id=(mediaId element="Mobile Image") layout="image/hero-mobile"}}}
    </figure>
    <p class="prehead">{{publish element="Prehead"}}</p>
    <h2 class="type-xxl">{{publish element="Headline" inline-edit="true"}}</h2>
    <button class="bm--cta style-primary" data-widget="program-finder">
      {{publish element="CTA Text"}} {{> icons/left-arrow}}
    </button>
  </section>

  <div class="bm-gallery--marquee" data-gallery>
    {{#each (repeater element="Gallery Images")}}
      <picture data-ar="2:3">
        {{{scale element="Image" max-width="640" max-height="960"}}}
      </picture>
    {{/each}}
  </div>
</section>
```

---

### Tier 4: Advanced Components

#### 9. **Quote Carousel** (`bm-quote-carousel`)
**Content Type Fields:**
```
- Quotes (Repeater)
  - Quote Text (HTML, Required)
  - Citation (Text, Required)
  - Author Title (Text)
```

**Handlebars Partial:** `quote-carousel.hbs`
```handlebars
<div data-bravery-carousel="quotes" class="bm--quote-carousel">
  <div class="bm-carousel--items" data-bravery-carousel-items>
    {{#each (repeater element="Quotes")}}
      <blockquote class="bm--quote">
        {{{publish element="Quote Text"}}}
        <cite>
          {{publish element="Citation"}}
          {{#ifSet element="Author Title"}}
            <span class="title">{{publish element="Author Title"}}</span>
          {{/ifSet}}
        </cite>
      </blockquote>
    {{/each}}
  </div>
  
  <div class="bm-carousel--controls" data-bravery-carousel-controls>
    <button data-bravery-carousel-prev><span class="sr-only">Previous</span></button>
    <button data-bravery-carousel-next><span class="sr-only">Next</span></button>
  </div>
</div>
```

---

#### 10. **Section Header** (`bm-section-header`)
**Content Type Fields:**
```
- Title (Text, Required)
- Subtitle (Text)
- Description (HTML)
- Alignment (Select: left|center)
```

**Handlebars Partial:** `section-header.hbs`
```handlebars
<header class="bm--section-header" data-align="{{publish element="Alignment"}}">
  {{#ifSet element="Subtitle"}}
    <p class="subtitle">{{publish element="Subtitle"}}</p>
  {{/ifSet}}
  <h2>{{publish element="Title" inline-edit="true"}}</h2>
  {{#ifSet element="Description"}}
    {{{publish element="Description"}}}
  {{/ifSet}}
</header>
```

---

#### 11. **CTA Callout** (`bm-cta-callout`)
**Content Type Fields:**
```
- Title (Text, Required)
- Content (HTML)
- Primary CTA (Link, Required)
- Secondary CTA (Link)
- Background Color (Select: blue|cream|white)
```

**Handlebars Partial:** `cta-callout.hbs`
```handlebars
<section class="bm--cta-callout {{#ifSet element="Background Color"}}has-bg--{{publish element="Background Color"}}{{/ifSet}}">
  <h2>{{publish element="Title"}}</h2>
  {{#ifSet element="Content"}}
    {{{publish element="Content"}}}
  {{/ifSet}}
  <div class="bm--buttons">
    {{#link element="Primary CTA"}}
      <a href="{{linkUrl}}" class="bm--cta style-primary">{{linkText}}</a>
    {{/link}}
    {{#ifSet element="Secondary CTA"}}
      {{#link element="Secondary CTA"}}
        <a href="{{linkUrl}}" class="bm--cta style-secondary">{{linkText}}</a>
      {{/link}}
    {{/ifSet}}
  </div>
</section>
```

---

## Content Type Definitions

### Recommended Content Types to Create in TerminalFour

1. **Text/Image Block**
2. **Callout**
3. **Accordion/Collapsible**
4. **General Content**
5. **Linked Card**
6. **Image Top Card**
7. **Carousel - Cards**
8. **Home Hero**
9. **Quote Carousel**
10. **Section Header**
11. **CTA Callout**
12. **Gallery - Staggered** (see below)
13. **Video Embed** (see below)
14. **Stats Callout** (see below)

---

## Media Layouts Required

Create these media layouts in TerminalFour for consistent image output:

1. **image/resp-portrait** - Responsive portrait images (2:3 ratio)
2. **image/resp-landscape** - Responsive landscape images (16:9 ratio)
3. **image/resp-square** - Responsive square images (1:1 ratio)
4. **image/card** - Card images with srcset
5. **image/card-square** - Square card images
6. **image/hero-mobile** - Mobile hero images
7. **image/callout** - Callout component images

Each layout should output:
- WebP and JPEG sources with srcset
- Appropriate sizes attribute
- Lazy loading attributes
- Proper width/height for CLS prevention

---

## Icon/SVG Strategy

Since Nunjucks uses `{% include "components/svg/icon-name.svg" %}`, we need a TerminalFour equivalent:

### Option 1: Media Library SVGs
Store SVGs in media library and reference:
```handlebars
{{{media id="icons/left-arrow.svg" layout="svg/inline"}}}
```

### Option 2: Handlebars Partials
Create partial for each icon:
```handlebars
{{> icons/left-arrow}}
```

### Option 3: Inline SVG in Layouts
Embed commonly-used SVGs directly in the Handlebars templates.

**Recommendation:** Use Option 2 (partials) for maintainability.

---

## JavaScript Module Integration

All components that require JavaScript should include the `data-module` attribute:

```handlebars
<div data-module="carousel" data-bravery-carousel>
  <!-- carousel content -->
</div>
```

Modules are auto-initialized via the module loader (see `TERMINALFOUR-JS-IMPLEMENTATION.md`).

---

## Responsive Images Pattern

Standard pattern for all images in TerminalFour:

```handlebars
<picture data-ar="{{publish element="Aspect Ratio"}}">
  {{#scale element="Image" max-width="1200" max-height="800"}}
    <source
      type="image/webp"
      srcset="
        {{path}}?w=320 320w,
        {{path}}?w=640 640w,
        {{path}}?w=1200 1200w"
      sizes="(max-width: 767px) 100vw, 50vw">
    <img
      src="{{path}}"
      alt="{{publish element="Alt Text"}}"
      width="{{width}}"
      height="{{height}}"
      loading="lazy"
      decoding="async" />
  {{/scale}}
</picture>
```

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
- [ ] Set up TerminalFour Handlebars environment
- [ ] Create media layouts for images
- [ ] Create icon partial system
- [ ] Build Tier 1 components (simple conversions)
- [ ] Test basic content types

### Phase 2: Cards & Carousels (Week 3-4)
- [ ] Build Tier 2 components (cards)
- [ ] Build Tier 3 components (carousels with repeaters)
- [ ] Test carousel JavaScript integration
- [ ] QA responsive images

### Phase 3: Advanced Components (Week 5-6)
- [ ] Build Tier 4 components (complex layouts)
- [ ] Build home hero with marquee gallery
- [ ] Integrate program finder
- [ ] Test all JavaScript modules

### Phase 4: Testing & Refinement (Week 7-8)
- [ ] Cross-browser testing
- [ ] Accessibility audit (WCAG 2.2 AA)
- [ ] Performance testing
- [ ] Direct Edit inline editing verification
- [ ] Content editor training materials

---

## Best Practices

### 1. **Always Use Semantic HTML**
Maintain the existing semantic structure from Nunjucks templates.

### 2. **Accessibility First**
- Include ARIA attributes where needed
- Ensure keyboard navigation works
- Test with screen readers
- Maintain focus management

### 3. **Performance**
- Use lazy loading for images
- Implement proper srcset/sizes
- Minimize inline styles
- Leverage browser caching

### 4. **Content Editor Experience**
- Use `inline-edit="true"` for Direct Edit support
- Provide clear field labels and help text
- Set sensible defaults
- Validate required fields

### 5. **Maintainability**
- Keep partials modular and reusable
- Document custom helpers
- Use consistent naming conventions
- Comment complex logic

---

## Additional Components to Map

### Gallery - Staggered (`bm-gallery-staggered`)
**Content Type Fields:**
```
- Images (Repeater)
  - Image (Media, Required)
  - Alt Text (Text, Required)
  - Caption (Text)
```

### Video Embed (`bm-video-embed`)
**Content Type Fields:**
```
- Video URL (Text, Required - YouTube/Vimeo)
- Title (Text, Required)
- Aspect Ratio (Select: 16:9|4:3|1:1)
```

### Stats Callout (`bm-stat-callout`)
**Content Type Fields:**
```
- Stats (Repeater)
  - Number (Text, Required)
  - Label (Text, Required)
  - Description (Text)
```

---

## Migration Checklist

- [ ] Audit all existing Nunjucks components
- [ ] Map component fields to T4 content types
- [ ] Create content type definitions in T4
- [ ] Build Handlebars partials
- [ ] Create media layouts
- [ ] Set up icon system
- [ ] Test JavaScript module integration
- [ ] Verify responsive images
- [ ] Test Direct Edit functionality
- [ ] Accessibility audit
- [ ] Performance testing
- [ ] Create editor documentation
- [ ] Train content editors
- [ ] Migrate sample content
- [ ] QA on staging
- [ ] Production deployment

---

## Notes & Considerations

1. **TerminalFour Version**: Ensure you're on 8.4.1+ for full Handlebars support, especially for repeaters and inline editing.

2. **Custom Helpers**: TerminalFour doesn't support custom helpers. Any custom logic from Nunjucks needs to be handled via:
   - Content type field options
   - JavaScript on the frontend
   - Server-side processing before T4

3. **Nesting Limitation**: Be aware of nesting limits in Handlebars expressions. Complex nested logic may need to be simplified.

4. **Media Library Organization**: Establish a clear folder structure in the media library for images, icons, and other assets.

5. **Version Control**: Keep Handlebars partials in version control outside of T4 for backup and collaboration.

6. **Testing Environment**: Set up a staging T4 environment to test partials before production deployment.

---

## Resources

- [TerminalFour Handlebars Documentation](https://docs.terminalfour.com/documentation/developer-resources/handlebars/handlebars-getting-started/)
- [Existing JS Implementation Guide](./TERMINALFOUR-JS-IMPLEMENTATION.md)
- [Handlebars Official Docs](https://handlebarsjs.com/)
- [WCAG 2.2 Guidelines](https://www.w3.org/WAI/WCAG22/quickref/)
