import terser from "@rollup/plugin-terser";
import path from "path";

const ASSETS_DIR = "src/_includes/assets";
const DIST_DIR = "_site";

const JS_SRC = path.join(ASSETS_DIR, "js");
const JS_DIST = path.join(DIST_DIR, "assets/js");

export default {
	input: path.join(JS_SRC, "wheaton.js"),
	output: {
		file: path.join(JS_DIST, "wheaton.bundle.js"),
		format: "iife",
	},
	plugins: [terser()],
};
