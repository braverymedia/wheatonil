import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from '@rollup/plugin-terser';

// Common plugins
const plugins = [
    nodeResolve({
        browser: true,
        preferBuiltins: false,
        modulesOnly: true
    }),
    commonjs({
        include: /node_modules/,
        requireReturnsDefault: 'auto'
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

// Base configuration for all builds
const baseConfig = {
    output: {
        dir: '_site/assets/js',
        sourcemap: process.env.NODE_ENV === 'development',
        format: 'esm',
        entryFileNames: '[name].bundle.js',
        chunkFileNames: 'chunks/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
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
        ...(process.env.NODE_ENV === 'production' ? [terser({
            format: {
                comments: false,
            },
            compress: {
                drop_console: true,
            },
        })] : [])
    ]
};

export default [
    // Modern bundle (ES modules)
    {
        ...baseConfig,
        input: 'src/assets/js/main.js',
        output: {
            ...baseConfig.output,
            file: '_site/assets/js/main.js',
            format: 'esm',
        },
    },
    // Legacy bundle (IIFE for older browsers)
    {
        ...baseConfig,
        input: 'src/assets/js/main.js',
        output: {
            ...baseConfig.output,
            file: '_site/assets/js/legacy-bundle.js',
            format: 'iife',
            name: 'wheaton',
        },
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
