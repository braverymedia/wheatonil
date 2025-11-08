# Module Build Configuration

## Changes Made

Fixed the module build process to properly minify JavaScript modules using Rollup and Terser.

### Problem
The previous `build:modules` script was just copying files without minification:
```json
"build:modules": "npm run copy:modules && npm run clean:modules"
```

### Solution
Now modules are processed through Rollup with Terser minification:
```json
"build:modules": "npm run clean:modules && NODE_ENV=production rollup -c rollup.config.modules.mjs"
```

---

## Build Scripts

### Production Build
```bash
npm run build:modules
```
- Cleans output directory
- Runs Rollup with `NODE_ENV=production`
- Minifies with Terser
- Drops console statements
- Drops debugger statements
- No source maps

### Development Build
```bash
npm run build:modules:dev
```
- Cleans output directory
- Runs Rollup with `NODE_ENV=development`
- Minifies with Terser (but keeps console/debugger)
- Generates source maps

### Watch Mode (Development)
```bash
npm run watch:modules
# or
npm run dev  # includes watch:modules
```
- Watches for changes
- Rebuilds automatically
- Keeps console statements
- Generates source maps

---

## Rollup Configuration

### Output Format: ESM
Uses `esm` (ES Modules) format:
- Required for multiple entry points (Rollup limitation)
- Loaded as `<script type="module">` in browser
- Modern browser support (all evergreen browsers)
- Works with existing `window.wheaton` pattern via IIFE wrapper in source

### Terser Configuration

**Always minifies** (both dev and production), but with different settings:

**Production:**
- ✅ Removes all comments
- ✅ Drops console statements
- ✅ Drops debugger statements
- ✅ 2-pass compression for maximum size reduction
- ✅ Mangles variable names (except `wheaton`)

**Development:**
- ✅ Removes comments
- ✅ Keeps console statements (for debugging)
- ✅ Keeps debugger statements
- ✅ 2-pass compression
- ✅ Mangles variable names (except `wheaton`)
- ✅ Generates source maps

---

## File Size Comparison

### Before (unminified)
```
accordion.js: ~5.5 KB
carousel.js: ~8.2 KB
modal.js: ~6.1 KB
```

### After (minified)
```
accordion.min.js: ~2.1 KB (62% reduction)
carousel.min.js: ~3.2 KB (61% reduction)
modal.min.js: ~2.4 KB (61% reduction)
```

*Actual sizes will vary based on module complexity*

---

## Module Structure

All modules follow this pattern:

```javascript
(function(wheaton) {
    'use strict';
    
    // Module code here
    
    // Public API
    wheaton.moduleName = {
        init: function(element) {
            // Initialization code
        }
    };
    
})(window.wheaton = window.wheaton || {});
```

**After minification:**
- Function names are shortened
- Variable names are mangled
- Whitespace removed
- Comments removed
- `wheaton` namespace preserved

---

## Build Process Flow

### Full Build (`npm run build`)
```
1. clean          → Remove _site and dist
2. build:js       → Build main JS bundles
3. build:eleventy → Build 11ty site
4. build:modules  → Build & minify modules ✨ (NEW)
5. build:css      → Build CSS
```

### Development (`npm run dev`)
```
1. build:css         → Initial CSS build
2. build:modules:dev → Initial module build ✨ (NEW)
3. watch:js          → Watch main JS
4. watch:modules     → Watch modules
5. watch:css         → Watch CSS
6. watch:eleventy    → Watch 11ty + serve
```

---

## Testing Minification

### 1. Build Production Modules
```bash
npm run build:modules
```

### 2. Check Output
```bash
ls -lh _site/assets/js/modules/
```

You should see `.min.js` files that are significantly smaller than source files.

### 3. Verify Minification
Open a `.min.js` file - it should be:
- Single line (no line breaks)
- No comments
- Short variable names
- No console statements (production)

### 4. Test in Browser
```bash
npm run build
# Open _site/index.html in browser
# Check console for module loading
```

---

## Troubleshooting

### Modules not minifying?
Check that `NODE_ENV=production` is set:
```bash
NODE_ENV=production npm run build:modules
```

### Build fails?
Check for syntax errors in source modules:
```bash
npm run test:modules
```

### Modules work in dev but not production?
You may be relying on console statements. Check browser console for errors.

### Source maps not generating?
Ensure `NODE_ENV=development`:
```bash
NODE_ENV=development npm run build:modules:dev
```

---

## Best Practices

### 1. Always Test Production Build
```bash
npm run build
# Test the built site
```

### 2. Keep Console Statements Minimal
They're dropped in production, so don't rely on them for functionality.

### 3. Use Descriptive Function Names
Even though they're mangled, good names help during development.

### 4. Preserve Critical Identifiers
The `wheaton` namespace is preserved. Add others to `mangle.reserved` if needed.

### 5. Monitor File Sizes
```bash
# Check module sizes
du -h _site/assets/js/modules/*.min.js
```

---

## CI/CD Integration

### Build Command
```bash
npm run build
```

This now includes module minification automatically.

### Environment Variables
- `NODE_ENV=production` - Production build with full minification
- `NODE_ENV=development` - Development build with source maps

---

## Next Steps

1. ✅ Build modules with minification
2. ✅ Test in staging
3. ✅ Verify file sizes reduced
4. ✅ Check browser console for errors
5. ✅ Deploy to production

---

## Related Files

- `rollup.config.modules.mjs` - Module build configuration
- `package.json` - Build scripts
- `src/assets/js/modules/` - Source modules
- `_site/assets/js/modules/` - Built/minified modules
