module.exports = function (eleventyConfig) {
    eleventyConfig.addWatchTarget("src/_includes/assets/scss");
    eleventyConfig.addPassthroughCopy({ "src/_includes/assets/css": "assets/css" });
    eleventyConfig.addPassthroughCopy({ "src/_includes/assets/js": "assets/js" });
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
}