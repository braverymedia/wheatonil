// Handlebars helpers for TerminalFour integration

// Date formatting helper
Handlebars.registerHelper('formatDate', function(date) {
  if (!date) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(date).toLocaleDateString('en-US', options);
});

// Truncate text helper
Handlebars.registerHelper('truncate', function(str, length) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
});

// JSON stringify helper for debugging
Handlebars.registerHelper('json', function(obj) {
  return JSON.stringify(obj);
});

// Conditional helper for checking if value equals another
Handlebars.registerHelper('ifEquals', function(arg1, arg2, options) {
  return (arg1 == arg2) ? options.fn(this) : options.inverse(this);
});

// Math helper for calculations
Handlebars.registerHelper('add', function(value, addition) {
  return parseInt(value) + parseInt(addition);
});

// Safe HTML helper that allows certain tags
Handlebars.registerHelper('safeHtml', function(html) {
  return new Handlebars.SafeString(html);
});

// Image URL helper for TerminalFour CDN
Handlebars.registerHelper('imageUrl', function(path, width, height, quality) {
  if (!path) return '';
  
  width = width || 1440;
  height = height || 720;
  quality = quality || 80;
  
  // Handle TerminalFour CDN URLs
  if (path.includes('terminalfour.net')) {
    return `${path}?width=${width}&height=${height}&quality=${quality}`;
  }
  
  // Handle local paths
  return path;
});

// CSS class helper for conditional classes
Handlebars.registerHelper('cssClass', function(condition, className) {
  return condition ? className : '';
});

// Debug helper
Handlebars.registerHelper('debug', function(obj) {
  console.log('Debug:', obj);
  return '';
});
