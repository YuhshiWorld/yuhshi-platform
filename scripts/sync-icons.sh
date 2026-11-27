#!/usr/bin/env bash
# Copies the generated UI icon index from a local clone of YuhshiWorld/yuhshi-icons
# into packages/icons and records the source commit. Usage: scripts/sync-icons.sh ../yuhshi-icons
set -euo pipefail
SRC="${1:?path to a yuhshi-icons clone}"
cp "$SRC/ui/src/index.ts" packages/icons/src/index.ts
SHA=$(git -C "$SRC" rev-parse HEAD)
node -e "const f='packages/icons/package.json';const p=require('./'+f);p.yuhshiIconsCommit='$SHA';require('fs').writeFileSync(f,JSON.stringify(p,null,2)+'\n')"
echo "Synced icons from $SHA"
