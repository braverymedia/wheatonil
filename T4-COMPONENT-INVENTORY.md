# TerminalFour Component Inventory

Complete inventory of all Nunjucks components and their TerminalFour conversion status.

---

## Component Status Legend

- ✅ **Ready** - Simple conversion, no blockers
- ⚠️ **Complex** - Requires repeaters or advanced features
- 🔧 **Custom** - Needs custom JavaScript or special handling
- 📋 **Planned** - Documented but not yet built

---

## Core Content Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| General Content | `bm-general-content.njk` | ✅ Ready | `general-content.hbs` | General Content | None | Simple WYSIWYG |
| Text/Image | `bm-text-image.njk` | ✅ Ready | `text-image.hbs` | Text/Image Block | None | Has legacy T4 tags in comments |
| Callout | `bm-callout.njk` | ✅ Ready | `callout.hbs` | Callout | None | Image + text highlight |
| Section Header | `bm-section-header.njk` | ✅ Ready | `section-header.hbs` | Section Header | None | Page section titles |
| Copy 2-Column | `bm-copy-2col.njk` | ✅ Ready | `copy-2col.hbs` | Two Column Content | None | Side-by-side text |

---

## Card Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Card - Linked | `bm-card-linked.njk` | ✅ Ready | `card-linked.hbs` | Linked Card | None | Entire card is clickable |
| Card - Image Top | `bm-card-image-top.njk` | ✅ Ready | `card-image-top.hbs` | Image Top Card | None | Image above content |
| Content Block | `bm-content-block.njk` | ✅ Ready | `content-block.hbs` | Content Block | None | Flexible content container |

---

## Interactive Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Collapsible | `bm-collapsible.njk` | ⚠️ Complex | `collapsible.hbs` | Accordion | `accordion` | Uses repeater for items |
| Accordion | Multiple items | ⚠️ Complex | `accordion.hbs` | Accordion Multi | `accordion` | Multiple collapsible sections |
| Modal | `bm-modal.njk` | 🔧 Custom | `modal.hbs` | Modal | `modal` | Requires a11y-dialog |
| Jump Menu | `bm-jump-menu.njk` | ✅ Ready | `jump-menu.hbs` | Jump Menu | None | Anchor link navigation |

---

## Carousel Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Carousel - Cards | `bm-carousel-cards.njk` | ⚠️ Complex | `carousel-cards.hbs` | Carousel Cards | `carousel` | Uses repeater for cards |
| Quote Carousel | `bm-quote-carousel.njk` | ⚠️ Complex | `quote-carousel.hbs` | Quote Carousel | `carousel` | Rotating testimonials |

---

## Hero/Header Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Home Hero | `bm-home-hero.njk` | ⚠️ Complex | `home-hero.hbs` | Home Hero | `marquee` | Marquee gallery + CTA |
| Page Header | `bm-page-header.njk` | ✅ Ready | `page-header.hbs` | Page Header | None | Standard page hero |
| Cover | `bm-cover.njk` | ✅ Ready | `cover.hbs` | Cover | None | Full-width cover image |

---

## CTA Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| CTA Callout | `bm-cta-callout.njk` | ✅ Ready | `cta-callout.hbs` | CTA Callout | None | Primary/secondary CTAs |
| CTA Text Arrow | `bm-cta-text-arrow.njk` | ✅ Ready | `cta-text-arrow.hbs` | CTA Text Arrow | None | Simple text link with arrow |
| Content CTAs | `bm-content-ctas.njk` | ⚠️ Complex | `content-ctas.hbs` | Content CTAs | None | Multiple CTA buttons |
| Action Menu | `bm-action-menu.njk` | ⚠️ Complex | `action-menu.hbs` | Action Menu | None | Dropdown action menu |
| Action Menu CTA | `bm-action-menu-cta.njk` | ✅ Ready | `action-menu-cta.hbs` | Action Menu CTA | None | Single action button |

---

## Media Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Gallery - Staggered | `bm-gallery-staggered.njk` | 🔧 Custom | `gallery-staggered.hbs` | Staggered Gallery | `gallery-staggered`, `modal` | Masonry layout |
| Video Embed | `bm-video-embed.njk` | ✅ Ready | `video-embed.hbs` | Video Embed | None | YouTube/Vimeo responsive |

---

## Specialty Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Stat Callout | `bm-stat-callout.njk` | ⚠️ Complex | `stat-callout.hbs` | Stat Callout | None | Uses repeater for stats |
| Sticky Split | `bm-sticky-split.njk` | 🔧 Custom | `sticky-split.hbs` | Sticky Split | Custom | Sticky scroll behavior |
| Breadcrumb | `bm-breadcrumb.njk` | 🔧 Custom | `breadcrumb.hbs` | N/A | None | Auto-generated from nav |
| Section Menu | `bm-section-menu.njk` | 🔧 Custom | `section-menu.hbs` | N/A | None | Auto-generated from sections |
| Icons | `bm-icons.njk` | ✅ Ready | `icons/*.hbs` | N/A | None | SVG icon partials |

---

## Faculty/Staff Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Faculty | `bm-faculty.njk` | 🔧 Custom | `faculty.hbs` | Faculty Profile | `faculty-filter` | Complex filtering |

---

## Form Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Slate RFI - UG | `bm-slate-rfi-ug.njk` | 🔧 Custom | `slate-rfi-ug.hbs` | Slate Form | Custom | Slate integration |
| Slate RFI - Grad | `bm-slate-rfi-grad.njk` | 🔧 Custom | `slate-rfi-grad.hbs` | Slate Form | Custom | Slate integration |

---

## Program Finder

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Program Finder - 2023 | `bm-program-finder-2023-data.njk` | 🔧 Custom | See separate doc | Program | `program-finder` | Svelte-based, complex |
| Program Finder - Enhanced | `bm-program-finder-enhanced.njk` | 🔧 Custom | See separate doc | Program | `program-finder` | Enhanced version |
| Program Finder - Vanilla | `bm-program-finder-vanilla.njk` | 🔧 Custom | See separate doc | Program | `program-finder` | Vanilla JS version |
| Program Finder - Demo | `bm-program-finder-demo.njk` | 🔧 Custom | See separate doc | Program | `program-finder` | Demo/test version |
| Program Finder - Filters | `bm-program-finder-filters.njk` | 🔧 Custom | See separate doc | Program | `program-finder` | Filter component |

---

## Special/Utility Components

| Component | File | Status | T4 Partial | Content Type | JS Module | Notes |
|-----------|------|--------|------------|--------------|-----------|-------|
| Tables | `bm-tables.njk` | ✅ Ready | `tables.hbs` | Table | None | Responsive tables |
| Nutrition | `bm-nutrition.njk` | ✅ Ready | `nutrition.hbs` | Nutrition Info | None | Nutrition facts display |
| Counselor Map | `bm-counselor-map.njk` | 🔧 Custom | `counselor-map.hbs` | Counselor Map | Custom | Interactive map |
| Give Floater | `bm-give-floater.njk` | ✅ Ready | `give-floater.hbs` | Give Floater | None | Sticky donation CTA |

---

## Component Priority Matrix

### Phase 1: Essential (Build First)
1. General Content
2. Text/Image
3. Section Header
4. Page Header
5. CTA Callout
6. Card - Linked
7. Card - Image Top

### Phase 2: Common (Build Second)
1. Collapsible/Accordion
2. Carousel - Cards
3. Quote Carousel
4. Video Embed
5. Callout
6. Copy 2-Column

### Phase 3: Specialty (Build Third)
1. Home Hero
2. Gallery - Staggered
3. Stat Callout
4. Tables
5. Jump Menu

### Phase 4: Advanced (Build Last)
1. Program Finder
2. Faculty Filter
3. Slate Forms
4. Counselor Map
5. Sticky Split

---

## JavaScript Module Dependencies

| Module | Components Using It | Priority |
|--------|-------------------|----------|
| `carousel` | Carousel Cards, Quote Carousel | High |
| `accordion` | Collapsible, Accordion | High |
| `modal` | Modal, Gallery Staggered | Medium |
| `marquee` | Home Hero | Medium |
| `gallery-staggered` | Gallery Staggered | Medium |
| `program-finder` | Program Finder variants | High |
| `faculty-filter` | Faculty | Low |
| `navigation` | Site navigation | Critical |

---

## Content Type Summary

Total content types needed: **~25-30**

### Simple Content Types (10)
- General Content
- Section Header
- Page Header
- CTA Callout
- Video Embed
- Tables
- Jump Menu
- Give Floater
- Nutrition
- Copy 2-Column

### Medium Complexity (8)
- Text/Image Block
- Callout
- Linked Card
- Image Top Card
- Content Block
- CTA Text Arrow
- Cover
- Action Menu CTA

### Complex with Repeaters (7)
- Accordion
- Carousel Cards
- Quote Carousel
- Stat Callout
- Content CTAs
- Action Menu
- Staggered Gallery

### Highly Custom (5)
- Home Hero
- Program Finder
- Faculty Profile
- Slate Forms
- Counselor Map

---

## Media Layout Requirements

### Image Layouts Needed
1. `image/resp-portrait` - 2:3 aspect ratio
2. `image/resp-landscape` - 16:9 aspect ratio
3. `image/resp-square` - 1:1 aspect ratio
4. `image/card` - Card images with srcset
5. `image/card-square` - Square card images
6. `image/hero-mobile` - Mobile hero images
7. `image/hero-desktop` - Desktop hero images
8. `image/callout` - Callout component images
9. `image/gallery` - Gallery images with lightbox

### SVG/Icon Layouts
1. `svg/inline` - Inline SVG output
2. `svg/icon` - Icon-sized SVG

---

## Accessibility Requirements by Component

### ARIA Attributes Required
- **Accordion/Collapsible**: `aria-expanded`, `aria-controls`
- **Carousel**: `aria-roledescription="carousel"`, `aria-label`
- **Modal**: `aria-modal`, `aria-labelledby`, `aria-describedby`
- **Navigation**: `aria-current`, `aria-haspopup`
- **Jump Menu**: `aria-label` for skip links

### Focus Management
- Carousel navigation buttons
- Modal open/close
- Accordion expand/collapse
- Mobile menu toggle

### Screen Reader Support
- `.sr-only` class for visually hidden labels
- Proper heading hierarchy
- Alt text for all images
- ARIA labels for icon-only buttons

---

## Performance Considerations

### Lazy Loading
- All images below the fold
- Carousel images
- Gallery images
- Video embeds

### Critical CSS
- Hero components
- Navigation
- Above-the-fold content

### JavaScript Loading
- Module loader (async)
- Individual modules (lazy loaded on demand)
- Program finder (code splitting)

---

## Testing Matrix

For each component, test:
- [ ] Desktop (1920px, 1440px, 1024px)
- [ ] Tablet (768px, 834px)
- [ ] Mobile (375px, 414px)
- [ ] Safari (macOS, iOS)
- [ ] Chrome (Windows, macOS, Android)
- [ ] Firefox (Windows, macOS)
- [ ] Edge (Windows)
- [ ] Screen readers (NVDA, JAWS, VoiceOver)
- [ ] Keyboard navigation
- [ ] Touch interactions
- [ ] Print styles

---

## Migration Notes

### Components with Legacy T4 Tags
Some components already have T4 tag examples in comments:
- `bm-text-image.njk` - Has PHP/T4 tag examples at bottom

These can be used as reference for Handlebars conversion.

### Components Requiring Data Migration
- Faculty profiles
- Program data
- News/events (if applicable)

### Components That May Need Redesign
- Sticky Split (complex scroll behavior)
- Counselor Map (interactive map integration)
- Program Finder (Svelte to vanilla JS conversion recommended)

---

## Next Steps

1. ✅ Review this inventory
2. ✅ Prioritize components based on usage
3. 📋 Create content types in T4 (Phase 1 first)
4. 📋 Build media layouts
5. 📋 Create icon partials
6. 📋 Build Phase 1 component partials
7. 📋 Test Phase 1 components
8. 📋 Repeat for Phases 2-4
9. 📋 Migrate content
10. 📋 QA and launch

---

## Questions to Answer

1. Which components are most frequently used?
2. Are there any components that can be deprecated?
3. What's the T4 version in use? (Need 8.4.1+ for full features)
4. What's the media library structure?
5. Are there existing T4 content types to build upon?
6. What's the content editor skill level?
7. What's the timeline for migration?
8. Is there a staging environment for testing?
