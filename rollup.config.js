import { nodeResolve } from '@rollup/plugin-node-resolve';
import { terser } from '@rollup/plugin-terser';

// Common plugins
const plugins = [
    nodeResolve({
        browser: true
    })
];

// Production plugins
if (process.env.NODE_ENV === 'production') {
    plugins.push(
        terser({
            format: {
                comments: false,
            },
            compress: {
                drop_console: true,
            },
        })
    );
}

export default [
    // Modern bundle (ES modules)
    {
        input: 'src/assets/js/main.js',
        output: {
            file: 'dist/assets/js/wheaton.js',
            format: 'esm',
            sourcemap: process.env.NODE_ENV === 'development',
        },
        plugins
    },
    // Legacy bundle (IIFE for older browsers)
    {
        input: 'src/assets/js/main.js',
        output: {
            file: 'dist/assets/js/legacy-bundle.js',
            format: 'iife',
            name: 'wheaton',
            sourcemap: process.env.NODE_ENV === 'development',
        },
        plugins: [
            ...plugins,
            // Add any legacy-specific plugins here
        ]
    },
    // Legacy loader
    {
        input: 'src/assets/js/legacy.js',
        output: {
            file: 'dist/assets/js/legacy.js',
            format: 'iife',
            sourcemap: process.env.NODE_ENV === 'development',
        },
        plugins: plugins.filter(plugin => plugin.name !== 'node-resolve')
    }
];
