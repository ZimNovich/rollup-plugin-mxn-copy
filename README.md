# rollup-plugin-mxn-copy

Rollup plugin for copying assets into the output directory of your bundle

- ~6.1kb size
- ~2.5kb minified + gzipped

## Install

```
$ npm install rollup-plugin-mxn-copy
```

## Usage

Use it like this in your rollup.config:

```js
import rollupMxnJsx from "rollup-plugin-mxn-jsx";

export default {
	input: "src/index.js",
	external: [
		"preact",
		"prop-types"
	],
	output: {
		file: "bundle/bundle.js",
		format: "iife",
		name: "App",
		sourcemap: false,
		globals: {
			"preact": "preact",
			"prop-types": "PropTypes"
		}
	},
	plugins: [
		rollupMxnJsx({
			factory: "h",
			include: ["*.js", "*.jsx"]
		})
	]
};

```

## License

This module is released under the MIT license.

## Related

- [mxn-jsx-ast-transformer](https://github.com/ZimNovich/mxn-jsx-ast-transformer) - Transforms JSX AST into regular JS AST
- [mxn-jsx-transpiler](https://github.com/ZimNovich/mxn-jsx-transpiler) - Transpiles JSX to regular JavaScript
