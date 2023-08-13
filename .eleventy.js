const path = require("path");
const sass = require("sass");
const browserslist = require("browserslist");
const { transform, browserslistToTargets, Features } = require("lightningcss");

module.exports = function (eleventyConfig) {
	eleventyConfig.addTemplateFormats("scss");
	eleventyConfig.addExtension("scss", {
		outputFileExtension: "css",
		outputFileExtension: "css",
		compile: async function (inputContent, inputPath) {
			// Skip files like _fileName.scss
			let parsed = path.parse(inputPath);
			if (parsed.name.startsWith("_")) {
				return;
			}

			// Run file content through Sass
			let result = sass.compileString(inputContent, {
				loadPaths: [parsed.dir || "."],
				sourceMap: true,
			});

			// Allow included files from @use or @import to
			// trigger rebuilds when using --incremental
			this.addDependencies(inputPath, result.loadedUrls);

			let targets = browserslistToTargets(
				browserslist("> 5% and not dead")
			);

			return async () => {
				let { code } = transform({
					code: Buffer.from(result.css),
					minify: true,
					sourceMap: true,
					targets
				});
				return code;
			};
		},
	});
	eleventyConfig.addPassthroughCopy({
		"src/assets/js": "assets/js",
	});

	return {
		dir: {
			input: "src",
			includes: "_includes",
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
