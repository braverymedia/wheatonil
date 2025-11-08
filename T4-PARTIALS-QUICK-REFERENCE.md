# TerminalFour Handlebars Partials - Quick Reference

This is a quick reference guide for the Handlebars partials you'll need to create in TerminalFour.

---

## Partial Naming Convention

Use kebab-case for all partial names:
- `text-image.hbs`
- `carousel-cards.hbs`
- `home-hero.hbs`

---

## Priority Partials (Build First)

### 1. General Content
**File:** `general-content.hbs`
**Usage:** Basic WYSIWYG content blocks
```handlebars
<div class="bm--content">
  {{{publish element="Content" inline-edit="true"}}}
</div>
```

### 2. Text/Image
**File:** `text-image.hbs`
**Usage:** Two-column layout with image and text
**Key Features:** Image position (left/right), multiple aspect ratios, optional quote

### 3. Callout
**File:** `callout.hbs`
**Usage:** Highlighted content with image
**Key Features:** Image position, title, content

### 4. Section Header
**File:** `section-header.hbs`
**Usage:** Page section headers
**Key Features:** Title, subtitle, description, alignment

### 5. CTA Callout
**File:** `cta-callout.hbs`
**Usage:** Call-to-action sections
**Key Features:** Title, content, primary/secondary CTAs

---

## Card Partials

### 6. Card - Linked
**File:** `card-linked.hbs`
**Usage:** Clickable card with image, title, description
**Key Features:** Full card is a link

### 7. Card - Image Top
**File:** `card-image-top.hbs`
**Usage:** Card with image on top, content below
**Key Features:** Background colors, layout options (stacked/horizontal)

---

## Interactive Partials

### 8. Collapsible/Accordion
**File:** `collapsible.hbs`
**Usage:** Expandable content sections
**Key Features:** Repeater for multiple items, ARIA attributes
**JavaScript:** Requires `accordion` module

### 9. Carousel - Cards
**File:** `carousel-cards.hbs`
**Usage:** Scrolling card carousel
**Key Features:** Section header, repeater for cards, navigation controls
**JavaScript:** Requires `carousel` module

### 10. Quote Carousel
**File:** `quote-carousel.hbs`
**Usage:** Rotating quotes/testimonials
**Key Features:** Repeater for quotes, navigation
**JavaScript:** Requires `carousel` module

---

## Specialty Partials

### 11. Home Hero
**File:** `home-hero.hbs`
**Usage:** Homepage hero section
**Key Features:** Mobile image, headline, CTA, marquee gallery
**JavaScript:** Requires `marquee` module

### 12. Gallery - Staggered
**File:** `gallery-staggered.hbs`
**Usage:** Masonry-style image gallery
**Key Features:** Repeater for images, lightbox support
**JavaScript:** Requires `gallery-staggered` and `modal` modules

### 13. Video Embed
**File:** `video-embed.hbs`
**Usage:** Responsive video embeds
**Key Features:** YouTube/Vimeo support, aspect ratios

### 14. Stats Callout
**File:** `stats-callout.hbs`
**Usage:** Display statistics/numbers
**Key Features:** Repeater for multiple stats

---

## Icon Partials

Create a partial for each icon in `icons/` subdirectory:

- `icons/left-arrow.hbs`
- `icons/right-arrow.hbs`
- `icons/close.hbs`
- `icons/search.hbs`
- etc.

Each icon partial contains the inline SVG code.

---

## Common Patterns

### Responsive Image with Scaling
```handlebars
<picture data-ar="{{publish element="Aspect Ratio"}}">
  {{#scale element="Image" max-width="1200" max-height="800"}}
    <source
      type="image/webp"
      srcset="{{path}}?w=320 320w, {{path}}?w=640 640w, {{path}}?w=1200 1200w"
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

### Link with URL and Text
```handlebars
{{#link element="CTA Link"}}
  <a href="{{linkUrl}}" class="bm--cta style-primary">{{linkText}}</a>
{{/link}}
```

### Conditional Content
```handlebars
{{#ifSet element="Optional Field"}}
  <div class="optional-content">
    {{publish element="Optional Field"}}
  </div>
{{/ifSet}}
```

### Repeater Loop
```handlebars
{{#each (repeater element="Items")}}
  <div class="item">
    <h3>{{publish element="Item Title"}}</h3>
    {{{publish element="Item Content"}}}
  </div>
{{/each}}
```

### Background Color Classes
```handlebars
<section class="bm--component {{#ifSet element="Background Color"}}has-bg--{{publish element="Background Color"}}{{/ifSet}}">
  <!-- content -->
</section>
```

### JavaScript Module Initialization
```handlebars
<div data-module="carousel" data-bravery-carousel>
  <!-- component content -->
</div>
```

---

## Content Type Field Types Reference

| Field Type | Use Case | Example |
|------------|----------|---------|
| **Text** | Short text (titles, labels) | "Section Title" |
| **HTML** | Rich text content | "Main Content" |
| **Media** | Images, files | "Hero Image" |
| **Link** | Internal/external links | "Call to Action" |
| **Select Box** | Single choice | "Background Color" |
| **Multi-select** | Multiple choices | "Tags" |
| **Checkbox** | Boolean | "Show CTA" |
| **Repeater** | Multiple items | "Carousel Slides" |
| **Date** | Date/time | "Event Date" |

---

## Inline Editing

Enable Direct Edit inline editing for key fields:

```handlebars
{{publish element="Title" inline-edit="true"}}
{{{publish element="Content" inline-edit="true"}}}
```

**Note:** Only works in T4 8.4.1+

---

## Accessibility Checklist

For each partial, ensure:
- [ ] Semantic HTML elements
- [ ] ARIA attributes where needed (`aria-expanded`, `aria-controls`, etc.)
- [ ] Proper heading hierarchy
- [ ] Alt text for images
- [ ] Keyboard navigation support
- [ ] Focus management for interactive elements
- [ ] Screen reader friendly labels (`sr-only` class)

---

## Testing Checklist

For each partial:
- [ ] Content displays correctly
- [ ] Responsive on mobile/tablet/desktop
- [ ] Images load with proper srcset
- [ ] Links work correctly
- [ ] JavaScript modules initialize
- [ ] Inline editing works (if enabled)
- [ ] Accessibility passes WCAG 2.2 AA
- [ ] Performance is acceptable

---

## Common Gotchas

1. **Triple Braces for HTML**: Use `{{{publish}}}` for HTML content, `{{publish}}` for text
2. **Scope in Repeaters**: Inside `{{#each (repeater)}}`, context shifts to child content
3. **No Custom Helpers**: Can't create custom Handlebars helpers in T4
4. **Media Layouts**: Must create media layouts before using `{{{media}}}` helper
5. **Icon Includes**: Use partials, not Nunjucks `{% include %}` syntax
6. **Conditional Equality**: Use built-in `{{#if}}` with comparison, not custom helpers
7. **String Concatenation**: Limited - use separate elements or JavaScript

---

## File Organization in T4

Recommended structure in TerminalFour:

```
Content Layouts/
├── components/
│   ├── general-content.hbs
│   ├── text-image.hbs
│   ├── callout.hbs
│   ├── card-linked.hbs
│   ├── card-image-top.hbs
│   ├── collapsible.hbs
│   ├── carousel-cards.hbs
│   ├── quote-carousel.hbs
│   ├── home-hero.hbs
│   ├── gallery-staggered.hbs
│   ├── video-embed.hbs
│   ├── stats-callout.hbs
│   └── section-header.hbs
├── icons/
│   ├── left-arrow.hbs
│   ├── right-arrow.hbs
│   └── close.hbs
└── media-layouts/
    ├── image-resp-portrait.hbs
    ├── image-resp-landscape.hbs
    ├── image-resp-square.hbs
    ├── image-card.hbs
    └── svg-inline.hbs
```

---

## Next Steps

1. Review the full integration plan: `TERMINALFOUR-HANDLEBARS-INTEGRATION-PLAN.md`
2. Set up T4 content types based on component requirements
3. Create media layouts for responsive images
4. Build icon partials
5. Start with Tier 1 simple components
6. Test each partial thoroughly before moving to next tier
7. Document any T4-specific quirks or workarounds
