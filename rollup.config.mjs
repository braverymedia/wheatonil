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
    plugins: [terser(), resolve()],
  },
  // Temporarily disabled old Svelte program finder to prevent conflicts
  // with new vanilla JS implementation
  // {
  //   input: path.join(JS_SRC, "program-finder-2023.js"),
  //   output: {
  //     file: path.join(JS_DIST, "program-finder-2023.bundle.js"),
  //     format: "iife",
  //   },
  //   plugins: [
  //     terser(),
  //     svelte({
  //       include: "src/**/*.svelte",
  //       emitCss: false,
  //       onwarn: (warning, handler) => {
  //         if (warning.code === "a11y-distracting-elements") return;
  //         handler(warning);
  //       },
  //       compilerOptions: {
  //         generate: "dom",
  //       },
  //     }),
  //     resolve({
  //       browser: true,
  //       exportConditions: ["svelte"],
  //       extensions: [".svelte"],
  //     }),
  //   ],
  // },
];
