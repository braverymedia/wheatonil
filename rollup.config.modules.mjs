import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import terser from '@rollup/plugin-terser';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Get all module files from src directory
const modulesDir = path.join(__dirname, 'src/assets/js/modules');
const moduleFiles = glob.sync('**/*.js', { cwd: modulesDir, absolute: true });

// Create an input object for Rollup
const input = moduleFiles.reduce((acc, filePath) => {
  const fileName = path.basename(filePath, '.js');
  acc[fileName] = filePath;  // Remove 'modules/' from the key
  return acc;
}, {});

export default {
  input,
  output: {
    dir: '_site/assets/js/modules',
    format: 'esm', // ESM required for multiple entry points
    sourcemap: process.env.NODE_ENV === 'development',
    entryFileNames: '[name].min.js',
    chunkFileNames: 'chunks/[name]-[hash].js',
  },
  plugins: [
    nodeResolve({
      browser: true,
      preferBuiltins: false,
      modulesOnly: true
    }),
    commonjs({
      include: /node_modules/,
      sourceMap: process.env.NODE_ENV === 'development',
      requireReturnsDefault: 'auto'
    }),
    // Always minify, but drop console only in production
    terser({
      format: {
        comments: false,
      },
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
        passes: 2, // Run compression twice for better results
      },
      mangle: {
        // Preserve window.wheaton namespace
        reserved: ['wheaton']
      }
    })
  ]
};
