#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/../../.." && pwd)"
SRC_DIR="$ROOT_DIR/clients/prototype-web"
DEST_DIR="$ROOT_DIR/clients/prototype-android/app/src/main/assets/www"

mkdir -p "$DEST_DIR"
cp "$SRC_DIR/index.html" "$SRC_DIR/styles.css" "$SRC_DIR/app.js" "$DEST_DIR/"

echo "Synced prototype web assets into Android WebView assets."
