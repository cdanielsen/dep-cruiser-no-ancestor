/** @type {import('dependency-cruiser').IConfiguration} */
module.exports = {
  forbidden: [
    {
      name: "no-root-folder-ancestor",
      /*
       * The proposed rule below actually forbids/ detects all dependencies outside
       * of the rootFolder folder - so a different name might be more appropriate, e.g.:
       */
      // name: "no-outside-root",
      comment:
        "Files cannot import files above the entrypoint containing folder",
      severity: "error",
      from: {
        // Ideally this would capture any files below the entrypoint containing folder
        
        /* For this _specific_ scenario, only mentioning the folder name directly
         * would also work, but I guess the more generic solution is what you're
         * after
         */
        // path: "^src/(rootFolder/).+" 

        /* The more  generic solution is to use `[^/]+/` to match a folder (1 or 
         * more characters that are not a /, followed by a /) and then any file 
         * in that folder
         */
        path: "^src/([^/]+/).+"
      },
      to: {
        /* If the path in the to object is src/rootFolder, then this would match 
         * any file that isn't in src/rootFolder (or a subfolder of it), so 
         * both the root (e.g. src/outside-root.js) but also sibling folders 
         * (e.g. src/otherRootFolder/sub/anyFile.js) which is probably what you need
         * for your use case
         * The $1 in the pathNot references  the capturing group in the
         * path property (the ([^/]+/) part)
         */
        pathNot: "^src/$1",

        /* Capturing only files in folder that are that are parents of src/rootFolder, 
         * but not capturing any files in sibling folders _is_ possible, in that case
         * you'd use:
         */
        // pathNot: "^src/([^/]+/).+"
        
        /* If it's about moving things around, it could be you're OK to keep 3rd 
         * party dependencies ('node_modules') as well as node built-ins around. 
         * To allow for that you'd want to add:
         */
        // dependencyTypesNot: ["npm", "core"]
      },
    },
  ],
  options: {
    /* Which modules not to follow further when encountered */
    doNotFollow: {
      /* path: an array of regular expressions in strings to match against */
      path: ["node_modules"],
    },

    /* Which modules to exclude */
    // exclude : {
    //   /* path: an array of regular expressions in strings to match against */
    //   path: '',
    // },

    /* Which modules to exclusively include (array of regular expressions in strings)
       dependency-cruiser will skip everything not matching this pattern
    */
    // includeOnly : [''],

    /* List of module systems to cruise.
       When left out dependency-cruiser will fall back to the list of _all_
       module systems it knows of. It's the default because it's the safe option
       It might come at a performance penalty, though.
       moduleSystems: ['amd', 'cjs', 'es6', 'tsd']

       As in practice only commonjs ('cjs') and ecmascript modules ('es6')
       are widely used, you can limit the moduleSystems to those.
     */

    // moduleSystems: ['cjs', 'es6'],

    /* prefix for links in html and svg output (e.g. 'https://github.com/you/yourrepo/blob/main/'
       to open it on your online repo or `vscode://file/${process.cwd()}/` to
       open it in visual studio code),
     */
    // prefix: `vscode://file/${process.cwd()}/`,

    /* false (the default): ignore dependencies that only exist before typescript-to-javascript compilation
       true: also detect dependencies that only exist before typescript-to-javascript compilation
       "specify": for each dependency identify whether it only exists before compilation or also after
     */
    // tsPreCompilationDeps: false,

    /* list of extensions to scan that aren't javascript or compile-to-javascript.
       Empty by default. Only put extensions in here that you want to take into
       account that are _not_ parsable.
    */
    // extraExtensionsToScan: [".json", ".jpg", ".png", ".svg", ".webp"],

    /* if true combines the package.jsons found from the module up to the base
       folder the cruise is initiated from. Useful for how (some) mono-repos
       manage dependencies & dependency definitions.
     */
    // combinedDependencies: false,

    /* if true leave symlinks untouched, otherwise use the realpath */
    // preserveSymlinks: false,

    /* TypeScript project file ('tsconfig.json') to use for
       (1) compilation and
       (2) resolution (e.g. with the paths property)

       The (optional) fileName attribute specifies which file to take (relative to
       dependency-cruiser's current working directory). When not provided
       defaults to './tsconfig.json'.
     */
    // tsConfig: {
    //   fileName: 'tsconfig.json'
    // },

    /* Webpack configuration to use to get resolve options from.

       The (optional) fileName attribute specifies which file to take (relative
       to dependency-cruiser's current working directory. When not provided defaults
       to './webpack.conf.js'.

       The (optional) `env` and `arguments` attributes contain the parameters
       to be passed if your webpack config is a function and takes them (see 
        webpack documentation for details)
     */
    // webpackConfig: {
    //  fileName: 'webpack.config.js',
    //  env: {},
    //  arguments: {}
    // },

    /* Babel config ('.babelrc', '.babelrc.json', '.babelrc.json5', ...) to use
      for compilation
     */
    // babelConfig: {
    //   fileName: '.babelrc',
    // },

    /* List of strings you have in use in addition to cjs/ es6 requires
       & imports to declare module dependencies. Use this e.g. if you've
       re-declared require, use a require-wrapper or use window.require as
       a hack.
    */
    // exoticRequireStrings: [],

    /* options to pass on to enhanced-resolve, the package dependency-cruiser
       uses to resolve module references to disk. The values below should be
       suitable for most situations

       If you use webpack: you can also set these in webpack.conf.js. The set
       there will override the ones specified here.
     */
    enhancedResolveOptions: {
      /* What to consider as an 'exports' field in package.jsons */
      exportsFields: ["exports"],
      /* List of conditions to check for in the exports field.
         Only works when the 'exportsFields' array is non-empty.
      */
      conditionNames: ["import", "require", "node", "default", "types"],
      /*
         The extensions, by default are the same as the ones dependency-cruiser
         can access (run `npx depcruise --info` to see which ones that are in
         _your_ environment). If that list is larger than you need you can pass
         the extensions you actually use (e.g. [".js", ".jsx"]). This can speed
         up module resolution, which is the most expensive step.
       */
      // extensions: [".js", ".jsx", ".ts", ".tsx", ".d.ts"],
      /* What to consider a 'main' field in package.json */
      mainFields: ["module", "main", "types", "typings"],
      /*
         A list of alias fields in package.jsons
         See [this specification](https://github.com/defunctzombie/package-browser-field-spec) and
         the webpack [resolve.alias](https://webpack.js.org/configuration/resolve/#resolvealiasfields)
         documentation

         Defaults to an empty array (= don't use alias fields).
       */
      // aliasFields: ["browser"],
    },
    reporterOptions: {
      dot: {
        /* pattern of modules that can be consolidated in the detailed
           graphical dependency graph. The default pattern in this configuration
           collapses everything in node_modules to one folder deep so you see
           the external modules, but their innards.
         */
        collapsePattern: "node_modules/(?:@[^/]+/[^/]+|[^/]+)",

        /* Options to tweak the appearance of your graph.See
           https://github.com/sverweij/dependency-cruiser/blob/main/doc/options-reference.md#reporteroptions
           for details and some examples. If you don't specify a theme
           dependency-cruiser falls back to a built-in one.
        */
        // theme: {
        //   graph: {
        //     /* splines: "ortho" gives straight lines, but is slow on big graphs
        //        splines: "true" gives bezier curves (fast, not as nice as ortho)
        //    */
        //     splines: "true"
        //   },
        // }
      },
      archi: {
        /* pattern of modules that can be consolidated in the high level
          graphical dependency graph. If you use the high level graphical
          dependency graph reporter (`archi`) you probably want to tweak
          this collapsePattern to your situation.
        */
        collapsePattern:
          "^(?:packages|src|lib(s?)|app(s?)|bin|test(s?)|spec(s?))/[^/]+|node_modules/(?:@[^/]+/[^/]+|[^/]+)",

        /* Options to tweak the appearance of your graph. If you don't specify a
           theme for 'archi' dependency-cruiser will use the one specified in the
           dot section above and otherwise use the default one.
         */
        // theme: { },
      },
      text: {
        highlightFocused: true,
      },
    },
  },
};
// generated: dependency-cruiser@16.4.2 on 2024-10-23T16:11:15.014Z
