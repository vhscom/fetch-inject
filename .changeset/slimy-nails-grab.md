---
'fetch-inject': major
---

End support for UMD and IIFE bundles

ECMAScript Modules have been standardized and thoroughly adopted throughout the JavaScript community, including in NodeJS, where they have been considered stable since version 12. As a result, support has been dropped for the UMD and IIFE bundle formats.

Dependents using version 2 with hard-coded path pointing any file in the `dist` directory will need to update import/require paths to upgrade to version 3.

The ES Module bundle can now be found at:

- `/fetch-inject.js` (uncompressed)
- `/fetch-inject.min.js` (compressed)

Furthermore, `injectors.js` is now combined with `fetch-inject.js` into a single file. This change was requested by end-users and simplifies development tooling.
