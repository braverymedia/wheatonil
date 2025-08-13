// Configuration for Eleventy build

export default function(eleventyConfig) {
  // Watch built CSS for changes
  eleventyConfig.addWatchTarget("_site/assets/css/wheaton.css");

  // Set server options for live reload
  eleventyConfig.setServerOptions({
    watch: [
      "_site/assets/css/wheaton.css"
    ]
  });

  // Copy assets to _site
  eleventyConfig.addPassthroughCopy({
    'src/assets/fonts': 'assets/fonts',
    'src/assets/images': 'assets/images',
    'src/assets/js': 'assets/js',
    'src/assets/css': 'assets/css',
    'src/favicon.ico': 'favicon.ico',
    'src/robots.txt': 'robots.txt',
    'src/site.webmanifest': 'site.webmanifest',
    'src/browserconfig.xml': 'browserconfig.xml',
    'src/assets/icons': 'assets/icons',
    'src/assets/videos': 'assets/videos',
  });

  // Watch the CSS file for changes
  eleventyConfig.addWatchTarget('src/assets/css/wheaton.css');

  // Server options
  eleventyConfig.setServerOptions({
    liveReload: true,
    domDiff: true,
    port: 8080,
    watch: [],
    showAllHosts: false,
    encoding: "utf-8",
    showVersion: false,
  });

  // Add debug logging for includes and layouts
  eleventyConfig.on('eleventy.before', ({ runMode }) => {
    console.log(`Running in ${runMode} mode`);
  });

  // Add layout aliases with full paths
  eleventyConfig.addLayoutAlias("general", "layouts/general.njk");
  eleventyConfig.addLayoutAlias("faculty", "layouts/faculty.njk");
  eleventyConfig.addLayoutAlias("program", "layouts/program.njk");
  eleventyConfig.addLayoutAlias("slate", "layouts/slate.njk");
  eleventyConfig.addLayoutAlias("home", "layouts/home.njk");

  // Debug logging for layouts
  eleventyConfig.on('eleventy.after', async ({ dir, results }) => {
    console.log(`Wrote ${results.length} files to ${dir.output}`);
  });

  // Watch for changes in includes, data, and SCSS/CSS
  eleventyConfig.addWatchTarget("_includes/");
  eleventyConfig.addWatchTarget("_data/");
  eleventyConfig.addWatchTarget("src/assets/styles/");
  eleventyConfig.addWatchTarget("src/assets/css/");

  // Ignore specific files from processing
  eleventyConfig.ignores.add('TERMINALFOUR-JS-IMPLEMENTATION.md');
  eleventyConfig.ignores.add('README.md');

  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_includes/layouts",
      data: "_data",
      output: "_site",
    },
    templateFormats: ["md", "njk", "html"],
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
    dataTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
