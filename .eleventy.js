const { PurgeCSS } = require("purgecss");

module.exports = function (eleventyConfig) {
	/**
	 * Remove any CSS not used on the page and inline the remaining CSS in the
	 * <head>.
	 *
	 * @see {@link https://github.com/FullHuman/purgecss}
	 */
	eleventyConfig.addTransform(
		"purge-and-inline-css",
		async function (content) {
			const purgeCSSResults = await new PurgeCSS().purge({
				content: [{ raw: content }],
				css: ["src/_includes/assets/css/wheaton.css"],
				keyframes: true,
			});

			return content.replace(
				"<!-- INLINE CSS-->",
				"<style>" + purgeCSSResults[0].css + "</style>"
			);
		}
	);

	eleventyConfig.addWatchTarget("src/_includes/assets/scss");
	eleventyConfig.addPassthroughCopy({
		"src/_includes/assets/css": "assets/css",
	});
	eleventyConfig.addPassthroughCopy({
		"src/_includes/assets/js": "assets/js",
	});
	eleventyConfig.setServerOptions({
		// Default values are shown:

		// Whether the live reload snippet is used
		liveReload: true,

		// Whether DOM diffing updates are applied where possible instead of page reloads
		domDiff: true,

		// The starting port number
		// Will increment up to (configurable) 10 times if a port is already in use.
		port: 8080,

		// Additional files to watch that will trigger server updates
		// Accepts an Array of file paths or globs (passed to `chokidar.watch`).
		// Works great with a separate bundler writing files to your output folder.
		// e.g. `watch: ["_site/**/*.css"]`
		watch: [],

		// Show local network IP addresses for device testing
		showAllHosts: false,

		// Use a local key/certificate to opt-in to local HTTP/2 with https
		https: {
			// key: "./localhost.key",
			// cert: "./localhost.cert",
		},

		// Change the default file encoding for reading/serving files
		encoding: "utf-8",

		// Show the dev server version number on the command line
		showVersion: false,
	});
	return {
		templateFormats: ["md", "njk", "html"],
		pathPrefix: "/",
		markdownTemplateEngine: "liquid",
		htmlTemplateEngine: "njk",
		dataTemplateEngine: "njk",
		passthroughFileCopy: true,
		dir: {
			input: "src",
			includes: "_includes",
			data: "_data",
			output: "_site",
		},
	};
};
