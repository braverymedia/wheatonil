# Migration Guide: Wheaton College JavaScript Refactoring

This document outlines the changes made during the JavaScript refactoring and provides guidance for developers working with the new structure.

## What Changed

1. **Modular Architecture**: The monolithic `wheaton.js` file has been split into focused, maintainable modules.
2. **Modern JavaScript**: Utilizes ES6+ features with a fallback for older browsers.
3. **Build Process**: Implemented Rollup for bundling and minification.
4. **Better Organization**: Clear separation of concerns with dedicated modules for different features.

## File Structure Changes

### Old Structure

```text
src/assets/js/
└── wheaton.js          # All JavaScript in one file
```

### New Structure

```text
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

## How to Update Your Code

### For Developers

1. **New Features**:
   - Create a new file in the `modules` directory
   - Follow the pattern of existing modules
   - Import and initialize in `main.js`

2. **Modifying Existing Features**:
   - Locate the relevant module in the `modules` directory
   - Make your changes following the existing patterns
   - Test thoroughly as modules are more isolated now

3. **Adding Dependencies**:
   - Use `npm install --save-dev` for build dependencies
   - For runtime dependencies, consider if they're truly necessary

### For TerminalFour Integration

The new structure is designed to work with TerminalFour:

1. **JavaScript Loading**:
   - Modern browsers use ES modules
   - Legacy browsers use a bundled version with polyfills

2. **Paths**:
   - All paths are relative to the site root
   - No absolute paths that would break in TerminalFour

3. **Initialization**:
   - All modules are auto-initialized
   - No manual initialization needed in TerminalFour templates

## Testing

Test the following in multiple browsers:

1. **Desktop**:
   - Navigation menus
   - Carousels
   - Modals
   - Accordions

2. **Mobile**:
   - Touch interactions
   - Menu toggles
   - Modal dialogs

3. **Legacy Browsers**:
   - IE11 (if supported)
   - Older versions of Edge/Safari

## Rollback Plan

If issues arise, you can rollback by:

1. Reverting to the previous `wheaton.js`
2. Updating the script reference in `html-head.njk`
3. Rebuilding the site

## Known Issues

- Some older browsers may experience a flash of unstyled content (FOUC) during loading
- JavaScript-heavy pages may need additional optimization for performance

## Future Improvements

- Implement code splitting for better performance
- Add more automated tests
- Consider a state management solution if the application grows

## Support

For questions or issues, contact the development team.
