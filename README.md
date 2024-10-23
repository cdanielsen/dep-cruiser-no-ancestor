A minimal reproduction of a desired dependency graph rule with dependency-cruiser

### Steps to Reproduce

Install deps

```sh
npm i
```

Run test script

```sh
npm run cruise:root
```

Actual Result:

This will flag all the imports as forbidden as the current config has empty objects for the one `forbidden` rule.

```sh
❯ npm run cruise:root

> dep-cruiser-no-ancestor@1.0.0 cruise:root
> depcruise src/rootFolder


  error no-root-folder-ancestor: src/rootFolder/subFolder/sub-root.js → src/outside-root.js
  error no-root-folder-ancestor: src/rootFolder/entryPoint.js → src/rootFolder/subFolder/sub-root.js
  error no-root-folder-ancestor: src/rootFolder/entryPoint.js → src/rootFolder/inside-peer.js

x 3 dependency violations (3 errors, 0 warnings). 4 modules, 3 dependencies cruised.
```

Desired Result:

Modify the `from` and `to` rules in such a way that only the _first_ error is reported, as it is a file importing something from outside the root folder
