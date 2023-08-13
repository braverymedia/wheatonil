import terser from "@rollup/plugin-terser";
import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import path from "path";

const ASSETS_DIR = "src//assets";
const DIST_DIR = "_site";

const JS_SRC = path.join(ASSETS_DIR, "js");
const JS_DIST = path.join(DIST_DIR, "assets/js");

// can export an array to have multiple unrelated items built [ https://rollupjs.org/command-line-interface/#configuration-files ]
export default [
  {
    input: path.join(JS_SRC, "wheaton.js"),
    output: {
      file: path.join(JS_DIST, "wheaton.bundle.js"),
      format: "iife",
    },
    plugins: [terser()],
  },
  {
    input: path.join(JS_SRC, "program-finder-2023.js"),
    output: {
      file: path.join(JS_DIST, "program-finder-2023.bundle.js"),
      format: "iife",
    },
    plugins: [
      terser(),
      svelte({
        // By default, all ".svelte" files are compiled
        //extensions: [".my-custom-extension"],

        // You can restrict which files are compiled
        // using `include` and `exclude`
        include: "src/**/*.svelte",

        // Optionally, preprocess components with svelte.preprocess:
        // https://svelte.dev/docs#compile-time-svelte-preprocess
        // preprocess: {
        //   style: ({ content }) => {
        //     return transformStyles(content);
        //   },
        // },

        // Emit CSS as "files" for other plugins to process. default is true
        emitCss: false,

        // Warnings are normally passed straight to Rollup. You can
        // optionally handle them here, for example to squelch
        // warnings with a particular code
        onwarn: (warning, handler) => {
          // e.g. don't warn on <marquee> elements, cos they're cool
          if (warning.code === "a11y-distracting-elements") return;

          // let Rollup handle all other warnings normally
          handler(warning);
        },

        // You can pass any of the Svelte compiler options
        compilerOptions: {
          // By default, the client-side compiler is used. You
          // can also use the server-side rendering compiler
          generate: "dom",

          // ensure that extra attributes are added to head
          // elements for hydration (used with generate: 'ssr')
          //hydratable: true,

          // You can optionally set 'customElement' to 'true' to compile
          // your components to custom elements (aka web elements)
          //customElement: false,
        },
      }),
      // see NOTICE below
      resolve({
        browser: true,
        exportConditions: ["svelte"],
        extensions: [".svelte"],
      }),
      // ...
    ],
  },
];
