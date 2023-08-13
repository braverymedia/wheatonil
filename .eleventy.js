const sass = require("sass");
const path = require("node:path");
const browserslist = require("browserslist");
const {
	bundle,
	browserslistToTargets,
	composeVisitors,
} = require("lightningcss");

module.exports = function (eleventyConfig) {
	eleventyConfig.addTemplateFormats("scss");

	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css", // optional, default: "html"

		// can be an async function
		compile: async function (inputContent, inputPath) {
			// Skip files like _fileName.scss
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith("_")) {
				return;
			}

			// Run file content through Sass
			let result = sass.compileString(inputContent, {
				loadPaths: [parsed.dir || "."],
				sourceMap: false, // or true, your choice!
			});

			// Allow included files from @use or @import to
			// trigger rebuilds when using --incremental
			this.addDependencies(inputPath, result.loadedUrls);

			return async () => {
				return result.css;
			};
		},
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
		watch: ["_site/**/*.css"],

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
