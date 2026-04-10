# News Components for TerminalFour

This directory contains Handlebars templates and helpers for TerminalFour integration of the Wheaton College news system.

## Files Overview

### Partials
- `partials/hero-news.hbs` - Hero section with image, breadcrumbs, and photo caption
- `partials/news-article.hbs` - Main article content with metadata and body
- `partials/header.hbs` - Site header (existing)
- `partials/footer.hbs` - Site footer (existing)
- `partials/head.hbs` - HTML head section (existing)
- `partials/scripts.hbs` - JavaScript includes (existing)

### Layouts
- `news-single-layout.hbs` - Complete news article page layout
- `base-layout.hbs` - Base template (existing)

### Helpers
- `helpers.js` - Custom Handlebars helpers for formatting and data processing

## Usage

### Hero News Component

```handlebars
{{> "partials/hero-news" heroNews}}
```

**Data structure:**
```json
{
  "heroNews": {
    "image": "path/to/image.jpg",
    "alt": "Image description",
    "title": "Image title",
    "photoCredit": "Photo: Wheaton College Communications",
    "breadcrumbsLink": "/news",
    "breadcrumbsText": "All News"
  }
}
```

### News Article Component

```handlebars
{{> "partials/news-article" newsArticle}}
```

**Data structure:**
```json
{
  "newsArticle": {
    "date": "2024-04-29",
    "title": "Article Title",
    "body": "<p>Article content...</p>",
    "content": [
      {
        "heading": "Section Heading",
        "text": "Section content",
        "html": "<p>HTML content</p>"
      }
    ]
  }
}
```

### Complete News Page

```handlebars
{{> "news-single-layout"}}
```

**Full data structure:**
```json
{
  "heroNews": { /* hero data */ },
  "newsArticle": { /* article data */ },
  "relatedNews": [
    {
      "title": "Related Article",
      "url": "/news/related-article",
      "image": "path/to/image.jpg",
      "alt": "Image description",
      "excerpt": "Article excerpt..."
    }
  ]
}
```

## Available Helpers

### formatDate
Formats a date string to readable format:
```handlebars
{{formatDate date}}
```

### truncate
Truncates text to specified length:
```handlebars
{{truncate text 150}}
```

### imageUrl
Generates TerminalFour CDN URLs with dimensions:
```handlebars
{{imageUrl imagePath 1440 720 80}}
```

### ifEquals
Conditional comparison:
```handlebars
{{#ifEquals status "active"}}
  Active content
{{else}}
  Inactive content
{{/ifEquals}}
```

### cssClass
Conditional CSS class:
```handlebars
<div class="item {{cssClass isActive 'active'}}">
```

## TerminalFour Integration

1. **Upload templates** to TerminalFour's template manager
2. **Configure content types** to match the data structures above
3. **Set up helpers** in your TerminalFour Handlebars configuration
4. **Create layouts** using the provided templates
5. **Test with sample data** to ensure proper rendering

## Styling

The components use the existing Wheaton College CSS classes:
- `.bm-hero-news` - Hero section styling
- `.news-article-container` - Article container
- `.news-article` - Article content
- `.related-news-section` - Related news section

## Notes

- All images are responsive and use modern `<picture>` elements
- Photo captions are automatically positioned between hero and content
- Components are WCAG 2.2 compliant with proper semantic HTML
- SVG icons are included using partials
- No JavaScript dependencies for basic functionality

## Dependencies

- Handlebars.js
- Existing Wheaton College CSS framework
- SVG icon partials in `components/svg/` directory
