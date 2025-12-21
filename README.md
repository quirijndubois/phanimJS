# PhanimJS

The js/ts version of Phanim (python). 

Usage with js (like in scenes dir) can be done by using esbuild, thus turning the TypeScript into a importable js file. 

Install esbuild (globally for example)
```bash
npm i -g esbuild
```

compile to the bundle.js file
```bash
npx esbuild src/index.ts \
  --bundle \
  --format=esm \
  --outfile=dist/bundle.js
```

Now you can import from that file

```bash
import * as Phanim from dist/bundle.js
```