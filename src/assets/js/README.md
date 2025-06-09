# Wheaton College JavaScript Architecture

This directory contains the modular JavaScript for the Wheaton College website.

## Structure

```
src/assets/js/
├── main.js              # Main entry point
├── legacy.js            # Legacy browser loader
├── modules/             # Feature modules
│   ├── carousel.js      # Carousel functionality
│   ├── navigation.js    # Navigation and mobile menu
│   ├── modal.js         # Modal dialogs
│   ├── accordion.js     # Accordion functionality
│   ├── marquee.js       # Marquee animations
│   └── faculty-filter.js # Faculty filtering
└── utils/               # Utility functions
    └── debounce.js      # Debounce utility
```

## Development

### Building

To build the JavaScript:

```bash
npm run build:js
```

### Watching for Changes

To watch for changes and rebuild automatically:

```bash
npm run watch:js
```

### Adding a New Module

1. Create a new file in the `modules` directory
2. Follow the pattern of existing modules:
   - Use the revealing module pattern
   - Add your module to the `window.wheaton` namespace
   - Implement an `init()` method
   - Add auto-initialization code
3. Import and initialize the module in `main.js`

## Browser Support

The JavaScript is built to support modern browsers with a fallback for older browsers:

- **Modern Browsers**: Loads `wheaton.js` as an ES module
- **Legacy Browsers**: Loads `legacy.js` which includes polyfills and a legacy bundle

## TerminalFour Integration

The JavaScript is built to work with TerminalFour by:

1. Using relative paths for all assets
2. Not relying on server-side rendering features
3. Including all necessary polyfills for older browsers

## Best Practices

- Keep modules small and focused on a single responsibility
- Use the `wheaton.utils.debounce` utility for debouncing events
- Follow the existing code style
- Add comments for complex logic
- Test in all supported browsers
