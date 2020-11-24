# rollup-plugin-mxn-copy

[![npm@latest](https://badgen.net/npm/v/rollup-plugin-mxn-copy)](https://www.npmjs.com/package/rollup-plugin-mxn-copy)
[![Install size](https://packagephobia.now.sh/badge?p=rollup-plugin-mxn-copy)](https://packagephobia.now.sh/result?p=rollup-plugin-mxn-copy)
[![Downloads](https://img.shields.io/npm/dm/rollup-plugin-mxn-copy.svg)](https://npmjs.com/rollup-plugin-mxn-copy)

A Rollup plugin for copying assets into the output directory of your bundle

- ~6.1kb size
- ~2.5kb minified + gzipped

## Install

```
$ npm install --save-dev rollup-plugin-mxn-copy
```

## Usage

Suppose an input file containing the snippet below exists at `src/index.js`, and attempts to load `src/logo.svg` as follows:

```bash
# ls -d -1 /home/setevoy/*/
/home/setevoy/Desktop/
/home/setevoy/Downloads/
/home/setevoy/Dropbox/
/home/setevoy/Images/
/home/setevoy/Soft/
/home/setevoy/Temp/
/home/setevoy/VirtualBox VMs/

// src/index.js
import Logo from './logo.svg';

console.log(Logo);
```

Create a `rollup.config.js` [configuration file](https://www.rollupjs.org/guide/en/#configuration-files) and import the plugin:

```js
// rollup.config.js
// ... other imports ...
import rollupMxnCopy from "rollup-plugin-mxn-copy";
// ... other imports, etc ...

export default {
	input: "src/index.js",
	// ...
	output: {
		file: "bundle/bundle.js",
		format: "iife"
	},
	plugins: [
		// ... other plugins ...
		rollupMxnCopy({
			assets: [
				// You can include files & directories
				"src/index.html",
				"src/logo.svg",
				"src/preact"
			]
		})
	]
};
```

Then call `rollup` either via the [CLI](https://www.rollupjs.org/guide/en/#command-line-reference) or the [API](https://www.rollupjs.org/guide/en/#javascript-api).

## Options

This plugin has the following configuration options:

| Property    | Description    | Default      |
|-------------|----------------|--------------|
| `assets`    | An array of strings with `import` statements that will be inserted at the beginning of the resulting file. | `"import {h} from \"preact\";"` |
| `verbose`   | This property specifies which files to include. It is a single [glob pattern](https://en.wikipedia.org/wiki/Glob_(programming)), or an array of them. | `false` |

## Examples











## Install

```
$ npm install rollup-plugin-mxn-copy
```

## Usage

Use it like this in your rollup.config:

```js
import rollupMxnCopy from "rollup-plugin-mxn-copy";

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
