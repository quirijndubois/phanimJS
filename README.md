# PhanimJS

The js/ts version of Phanim (python). 

Usage with js (like in scenes dir) can be done by using esbuild, thus turning the TypeScript into a importable js file. 

Install esbuild (globally for example)
```bash
npm i -g esbuild
```

compile to the bundle.js file (witch watch mode on in this example)
```bash
npx esbuild src/index.ts \
  --bundle \
  --outfile=dist/my-library.js \
  --format=esm \
  --watch
```

Now you can import from that file

```bash
import * as Phanim from dist/bundle.js
```