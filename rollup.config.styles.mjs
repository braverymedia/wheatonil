import postcss from 'rollup-plugin-postcss';
import lightningcss from 'postcss-lightningcss';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const stylesDir = join(__dirname, 'src/assets/styles');
const nodeModulesDir = join(__dirname, 'node_modules');

const isProduction = process.env.NODE_ENV === 'production';

// Define all SCSS entry points
const styles = [
  'wheaton',
  'critical',
  'faculty-profile',
  'transition22'
];

// Create a config for each style entry
export default styles.map(style => ({
  input: `src/assets/styles/${style}.scss`,
  output: {
    dir: 'src/assets/css',
    format: 'es',
    assetFileNames: '[name][extname]'
  },
  plugins: [
    postcss({
      extract: true,
      // Minification handled by Lightning CSS
      minimize: false,
      sourceMap: true,
      plugins: [
        // Lightning CSS handles prefixing and minification per browserslist
        lightningcss({
          minify: isProduction
        })
      ],
      use: [
        [
          'sass',
          {
            sourceMap: true,
            includePaths: [stylesDir, nodeModulesDir]
          }
        ]
      ]
    })
  ]
}));
