// Rollup-Plugin-MXN-Copy - Rollup plugin for copying assets into the output directory of your bundle
// Copyright (C) 2020 Ilya Zimnovich <zimnovich@gmail.com>
//
// On Rollup plugin documentation see:
// - https://github.com/rollup/rollup/blob/master/docs/05-plugin-development.md

"use strict";
const fs   = require("fs");
const path = require("path");

/**
 * copy file to dir
 * @param src
 * @param dest
 * @returns {Promise<any>}
 */
// Inspired by rollup-plugin-copy-files
//
const copyFile = function(src, dst) {
    const rd = createReadStream(src);
    const wr = createWriteStream(dst);
    return new Promise((resolve, reject) => {
        rd.on("error", reject);
        wr.on("error", reject);
        wr.on("finish", resolve);
        rd.pipe(wr);
    }).catch((error) => {
        rd.destroy();
        wr.end();
        throw error;
    });
}

// See:
// - https://stackoverflow.com/questions/13786160/copy-folder-recursively-in-node-js
//
// source <String> Note: if source is a directory it will copy everything inside of this directory, not the entire directory itself
// target <String> Note: if source is a file, target cannot be a directory

const copyFolderRecursive = async function(source, target)
{
    // Check if target folder needs to be created    
    // const targetFolder = path.join( target, path.basename( source ) );
    const targetExists = await fs.promises.lstat(target).then(r => true).catch(e => false);
    if ( !targetExists ) {
        await fs.promises.mkdir(target);
    }

    // Copy files recursively
    const sourceStats = await fs.promises.lstat(source);

    if (sourceStats.isDirectory() ) {
        const dirEntries = await fs.promises.opendir(source);

        for await (const dirEntry of dirEntries) {
            const curSource = path.join(source, dirEntry.name);
            const curTarget = path.join(target, dirEntry.name);
            const curSourceStats = await fs.promises.lstat(curSource);
            if (curSourceStats.isDirectory() ) {
                await copyFolderRecursive(curSource, curTarget);
            }
            if (curSourceStats.isFile() ) {
                await fs.promises.copyFile(curSource, curTarget);
            }
        }
    }
}

// A Rollup plugin is an object with one or more of the properties, build hooks,
// and output generation hooks described below, and which follows our conventions.
//
// Plugins allow you to customise Rollup's behaviour by, for example, transpiling
// code before bundling, or finding third-party modules in your node_modules folder. 

module.exports = function(options) {
    // Setting default options
    const defaults = {
        assets: [],
        verbose: false,
        overwrite: true,
        include: "*.svg",
        prepend: "**/"
	};

	// Mixing mandatory and user provided arguments
	// Note: Object.assign() does not throw on null or undefined sources
    options = Object.assign(defaults, options);
    let sourceDir = "";

    return {
        name: "mxn-copy", // this name will show up in warnings and errors
        // To interact with the build process, your plugin object includes 'hooks'.
		// Hooks are functions which are called at various stages of the build. 
        //
        // This is the recommended hook to use when you need access to the options
        // passed to rollup.rollup()
        //
        buildStart: function({ input }) {
            // Cache the base directory so we can figure out where to put assets.
            // const sourceDir = process.cwd();
            // for (const asset of assets)
            // const source = fs.readFileSync(srcFile);
            // this.emitFile({fileName, source, type: 'asset'});
            //
            // const entryRoot = path.dirname(input);
            //
            // input: [ 'src/index.js' ]
            //
            if (Array.isArray(input) ) {
                sourceDir = path.dirname(input[0]);
            } else {
                sourceDir = path.dirname(input);
            }
        },

        generateBundle: async function({ file, dir })
        {
            // dir: undefined,
            // file: "bundle/bundle.js"
            // this.resolvePath(path.join(basePath, file))

            const destDir = dir || path.dirname(file);

            return Promise.all(
                // assets.map((asset) =>
                //     fs.copy(asset, path.join(outputDirectory, path.basename(asset)))
                // );
      
                options.assets.map(async asset => {
                    try {
                        const relAssetPath = path.relative(sourceDir, asset);
                        if (relAssetPath.startsWith("..") ) {
                            throw new Error("Assets should reside within the input directory");
                        }

                        const assetPath = path.join(sourceDir, relAssetPath);
                        const targetPath = path.join(destDir, relAssetPath);

                        if (options.verbose) {
                            console.log("Copying asset from %j to %j", assetPath, targetPath);
                        }

                        const absAssetPath = path.resolve(assetPath);
                        const absTargetPath = path.resolve(targetPath);

                        // Check if source exists
                        // Tests a user's permissions for the file or directory specified by path
                        // await fs.promises.access(absAssetPath);
                        try {
                            const stats = await fs.promises.lstat(absAssetPath);
                            if (stats.isFile() ) {
                                // Copying file. See:
                                // - https://stackoverflow.com/questions/11293857/fastest-way-to-copy-a-file-in-node-js
                                await fs.promises.copyFile(absAssetPath, absTargetPath);
                            }
                            if (stats.isDirectory() ) {
                                // Copying directory
                                await copyFolderRecursive(absAssetPath, absTargetPath);
                            }
                        }
                        catch (e) {
                            this.warn(`Asset ${asset} does not exist. Error: ${e}`);
                        }
                    }
                    catch (e) {
                        this.warn(`Could not copy ${asset} because of an error: ${e}`);
                    }
                })
            );
        }
    }
}
