# T4 Tag → Handlebars Conversion Cheat Sheet

Quick reference for converting legacy T4 tags to Handlebars expressions.

---

## Basic Content Output

### Plain Text Element

**Legacy T4:**
```php
<t4 type="content" name="Title" output="normal" modifiers="striptags,htmlentities" />
```

**Handlebars:**
```handlebars
{{publish element="Title"}}
```

**With Inline Editing:**
```handlebars
{{publish element="Title" inline-edit="true"}}
```

---

### HTML Element

**Legacy T4:**
```php
<t4 type="content" name="Content" output="normal" modifiers="medialibrary,nav_sections" />
```

**Handlebars:**
```handlebars
{{{publish element="Content"}}}
```

**With Inline Editing:**
```handlebars
{{{publish element="Content" inline-edit="true"}}}
```

**Note:** Triple braces `{{{` prevent HTML escaping.

---

## Conditional Output

### Selective Output (if element has value)

**Legacy T4:**
```php
<t4 type="content" name="Subhead" output="selective-output" 
    process-format="true" 
    format="<span class=&quot;subhead&quot;><t4 type=&quot;content&quot; name=&quot;Subhead&quot; output=&quot;normal&quot; /></span>" />
```

**Handlebars:**
```handlebars
{{#ifSet element="Subhead"}}
  <span class="subhead">{{publish element="Subhead"}}</span>
{{/ifSet}}
```

**With Fallback:**
```handlebars
{{#ifSet element="Subhead"}}
  <span class="subhead">{{publish element="Subhead"}}</span>
{{else}}
  <span class="subhead">Default Subhead</span>
{{/ifSet}}
```

---

## Links

### Link Element (URL + Text)

**Legacy T4:**
```php
<a href="<t4 type="content" name="CTA" output="linkurl" modifiers="nav_sections" />">
  <t4 type="content" name="CTA" output="linktext" />
</a>
```

**Handlebars:**
```handlebars
{{#link element="CTA"}}
  <a href="{{linkUrl}}">{{linkText}}</a>
{{/link}}
```

**With CSS Class:**
```handlebars
{{#link element="CTA"}}
  <a href="{{linkUrl}}" class="bm--cta style-primary has-arrow">{{linkText}}</a>
{{/link}}
```

---

## Images & Media

### Image Element (Basic)

**Legacy T4:**
```php
<t4 type="content" name="Image" output="normal" formatter="image/resp-portrait" cdn="true" />
```

**Handlebars:**
```handlebars
{{{media id=(mediaId element="Image") layout="image/resp-portrait"}}}
```

---

### Image with Scaling

**Legacy T4:**
```php
<t4 type="content" name="Image" output="normal" formatter="image/scaled" 
    width="640" height="480" cdn="true" />
```

**Handlebars:**
```handlebars
{{#scale element="Image" max-width="640" max-height="480"}}
  <img src="{{path}}" width="{{width}}" height="{{height}}" 
       alt="{{publish element="Alt Text"}}" loading="lazy" />
{{/scale}}
```

---

### Responsive Image with srcset

**Legacy T4:**
```php
<t4 type="content" name="Image" output="normal" formatter="image/responsive" cdn="true" />
```

**Handlebars:**
```handlebars
<picture data-ar="2:3">
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
</picture>
```

---

## Files

### File Download Link

**Legacy T4:**
```php
<a href="<t4 type="content" name="PDF" output="file" />">
  Download PDF
</a>
```

**Handlebars:**
```handlebars
<a href="{{file element="PDF"}}">Download PDF</a>
```

**With File Size:**
```handlebars
<a href="{{file element="PDF"}}">
  Download PDF ({{filesize element="PDF"}})
</a>
```

---

## List Elements

### Selected List Item Names

**Legacy T4:**
```php
<t4 type="content" name="Categories" output="normal" />
```

**Handlebars (comma-separated):**
```handlebars
{{selectedNames element="Categories"}}
```

**Handlebars (pipe-separated):**
```handlebars
{{selectedNames element="Categories" separator="|"}}
```

---

### Loop Through Selected Items

**Legacy T4:**
```php
<!-- Complex PHP/T4 loop -->
```

**Handlebars:**
```handlebars
<ul>
  {{#each (selected element="Categories")}}
    <li>{{name}}</li>
  {{/each}}
</ul>
```

**With Index:**
```handlebars
<ul>
  {{#each (selected element="Categories")}}
    <li>{{@index_1}}. {{name}}</li>
  {{/each}}
</ul>
```

---

### Loop Through All List Items

**Handlebars:**
```handlebars
<ul>
  {{#each (list element="Categories")}}
    <li class="{{#if selected}}selected{{/if}}">{{name}}</li>
  {{/each}}
</ul>
```

---

## Repeater Elements

### Basic Repeater Loop

**Legacy T4:**
```php
<!-- Not available in legacy T4 -->
```

**Handlebars (8.4.1+):**
```handlebars
{{#each (repeater element="Slides")}}
  <div class="slide">
    <h3>{{publish element="Slide Title"}}</h3>
    {{{publish element="Slide Content"}}}
  </div>
{{/each}}
```

---

### Repeater with Index

**Handlebars:**
```handlebars
{{#each (repeater element="Accordion Items")}}
  <h3>
    <button aria-controls="panel-{{@index}}" aria-expanded="false">
      {{publish element="Title"}}
    </button>
  </h3>
  <div id="panel-{{@index}}" hidden>
    {{{publish element="Content"}}}
  </div>
{{/each}}
```

---

### Repeater with First/Last Detection

**Handlebars:**
```handlebars
{{#each (repeater element="Items")}}
  {{#if @first}}<ul>{{/if}}
  
  <li>{{publish element="Item Text"}}</li>
  
  {{#if @last}}</ul>{{/if}}
{{/each}}
```

---

### Access Parent Scope in Repeater

**Handlebars:**
```handlebars
{{#each (repeater element="Cards")}}
  <div class="card">
    <h3>{{publish element="Card Title"}}</h3>
    <p>Part of: {{publish element="Section Title" scope="parent"}}</p>
  </div>
{{/each}}
```

---

## Dates

### Date Element

**Legacy T4:**
```php
<t4 type="content" name="Event Date" output="normal" />
```

**Handlebars (default format):**
```handlebars
{{publish element="Event Date"}}
```
Output: `Thu, 25 Apr 2024 09:00:05 UTC`

**Handlebars (custom format):**
```handlebars
{{dateFormat (dateElement element="Event Date") "YYYY/MM/dd hh:mma"}}
```
Output: `2024/04/25 09:00AM`

**Common Date Formats:**
```handlebars
{{dateFormat (dateElement element="Event Date") "MMMM d, YYYY"}}
{{!-- Output: April 25, 2024 --}}

{{dateFormat (dateElement element="Event Date") "MMM d"}}
{{!-- Output: Apr 25 --}}

{{dateFormat (dateElement element="Event Date") "YYYY-MM-dd"}}
{{!-- Output: 2024-04-25 --}}
```

---

## Metadata

### Content ID

**Legacy T4:**
```php
<t4 type="meta" meta="content_id" />
```

**Handlebars:**
```handlebars
{{contentId}}
```

---

### Content Name

**Legacy T4:**
```php
<t4 type="meta" meta="content_name" />
```

**Handlebars:**
```handlebars
{{contentName}}
```

---

### Section Name

**Legacy T4:**
```php
<t4 type="meta" meta="section_name" />
```

**Handlebars:**
```handlebars
{{sectionName}}
```

---

### Canonical URL

**Legacy T4:**
```php
<t4 type="meta" meta="canonical_url" />
```

**Handlebars:**
```handlebars
{{canonicalURL}}
```

---

## String Manipulation

### Abbreviate (Truncate)

**Handlebars:**
```handlebars
{{abbreviate (publish element="Description") 200}}
```
Truncates to 200 characters with ellipsis.

---

### Capitalize

**Handlebars:**
```handlebars
{{capitalize (publish element="Title")}}
```

---

### Slugify

**Handlebars:**
```handlebars
<div id="{{slugify (publish element="Title")}}">
  <!-- content -->
</div>
```

---

### Replace

**Handlebars:**
```handlebars
{{replace (publish element="Text") "old" "new"}}
```

---

## Advanced Patterns

### Conditional CSS Classes

**Handlebars:**
```handlebars
<section class="bm--component {{#ifSet element="Background Color"}}has-bg--{{publish element="Background Color"}}{{/ifSet}}">
  <!-- content -->
</section>
```

---

### Multiple Conditions

**Handlebars:**
```handlebars
{{#ifSet element="Image"}}
  {{#ifSet element="Caption"}}
    <figure>
      {{{media id=(mediaId element="Image") layout="image/default"}}}
      <figcaption>{{publish element="Caption"}}</figcaption>
    </figure>
  {{else}}
    {{{media id=(mediaId element="Image") layout="image/default"}}}
  {{/ifSet}}
{{/ifSet}}
```

---

### Nested Repeaters (Sublists)

**Handlebars:**
```handlebars
{{#each (list element="Categories")}}
  <li>
    {{name}}
    {{#if hasSubList}}
      <ul>
        {{#each (list subList)}}
          <li>{{name}}</li>
        {{/each}}
      </ul>
    {{/if}}
  </li>
{{/each}}
```

---

## Common Gotchas

### ❌ Don't Use Double Braces for HTML

```handlebars
{{!-- WRONG - will escape HTML --}}
{{publish element="Content"}}

{{!-- CORRECT - outputs HTML --}}
{{{publish element="Content"}}}
```

---

### ❌ Don't Forget inline-edit Flag

```handlebars
{{!-- Without inline editing --}}
{{publish element="Title"}}

{{!-- With inline editing (recommended) --}}
{{publish element="Title" inline-edit="true"}}
```

---

### ❌ Scope Issues in Repeaters

```handlebars
{{#each (repeater element="Items")}}
  {{!-- This gets "Title" from child item --}}
  {{publish element="Title"}}
  
  {{!-- This gets "Title" from parent content --}}
  {{publish element="Title" scope="parent"}}
{{/each}}
```

---

### ❌ Media Layout Must Exist

```handlebars
{{!-- WRONG - layout doesn't exist --}}
{{{media id=(mediaId element="Image") layout="image/my-custom-layout"}}}

{{!-- CORRECT - use existing layout --}}
{{{media id=(mediaId element="Image") layout="image/resp-portrait"}}}
```

---

## Migration Checklist

When converting a component:

- [ ] Replace `<t4 type="content"...>` with `{{publish}}`
- [ ] Use `{{{triple}}}` braces for HTML elements
- [ ] Convert `output="selective-output"` to `{{#ifSet}}`
- [ ] Convert link output to `{{#link}}` helper
- [ ] Update image formatters to media layouts
- [ ] Add `inline-edit="true"` where appropriate
- [ ] Test in staging environment
- [ ] Verify Direct Edit works
- [ ] Check responsive images load correctly
- [ ] Validate accessibility

---

## Quick Reference Table

| Legacy T4 | Handlebars | Notes |
|-----------|------------|-------|
| `<t4 type="content" name="X" output="normal" />` | `{{publish element="X"}}` | Plain text |
| `<t4 type="content" name="X" output="normal" modifiers="medialibrary" />` | `{{{publish element="X"}}}` | HTML content |
| `<t4 type="content" name="X" output="selective-output" />` | `{{#ifSet element="X"}}...{{/ifSet}}` | Conditional |
| `<t4 type="content" name="X" output="linkurl" />` | `{{#link element="X"}}{{linkUrl}}{{/link}}` | Link URL |
| `<t4 type="content" name="X" output="linktext" />` | `{{#link element="X"}}{{linkText}}{{/link}}` | Link text |
| `<t4 type="content" name="X" output="file" />` | `{{file element="X"}}` | File path |
| `<t4 type="meta" meta="content_id" />` | `{{contentId}}` | Metadata |
| `<t4 type="meta" meta="canonical_url" />` | `{{canonicalURL}}` | Metadata |

---

## Resources

- [T4 Handlebars Documentation](https://docs.terminalfour.com/documentation/developer-resources/handlebars/handlebars-getting-started/)
- [Integration Plan](./TERMINALFOUR-HANDLEBARS-INTEGRATION-PLAN.md)
- [Migration Strategy](./T4-MIGRATION-STRATEGY.md)
- [Component Inventory](./T4-COMPONENT-INVENTORY.md)
