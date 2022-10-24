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
