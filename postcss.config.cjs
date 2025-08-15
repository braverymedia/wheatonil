const isProduction = process.env.ELEVENTY_ENV === 'production';
const lightningcss = require('postcss-lightningcss');

module.exports = {
  plugins: [
    // Lightning CSS handles prefixing and minification per browserslist
    lightningcss({
      minify: isProduction
    })
  ]
};
