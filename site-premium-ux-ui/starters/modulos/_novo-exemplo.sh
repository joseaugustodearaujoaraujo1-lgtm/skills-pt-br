#!/bin/sh
# Cria package.json e servir.mjs de um exemplo: sh _novo-exemplo.sh 01-giro-3d-quadros
d="$1/exemplo"; mkdir -p "$d/src" "$d/public"
cat > "$d/package.json" <<'J'
{
  "name": "exemplo-modulo",
  "private": true,
  "type": "module",
  "scripts": {
    "build": "esbuild src/main.js --bundle --minify --format=esm --target=es2020 --outdir=public --entry-names=app",
    "serve": "node servir.mjs"
  }
}
J
cat > "$d/servir.mjs" <<'J'
// Uso: node servir.mjs [porta]   (serve a pasta public/; rode `npm run build` antes)
import { servir } from '../../servir-base.mjs';
servir(3100);
J
