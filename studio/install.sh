#!/usr/bin/env bash
# GLOBAL LUXURY DIGITAL STUDIO — installer
# Copies the studio configuration into ~/.claude so it applies to ALL Claude Code
# projects and sessions on this machine.
#
#   bash studio/install.sh
#
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
STAMP="$(date +%Y%m%d-%H%M%S)"

mkdir -p "$DEST/skills"

# --- CLAUDE.md -------------------------------------------------------------
if [ -f "$DEST/CLAUDE.md" ] && ! cmp -s "$SRC/CLAUDE.md" "$DEST/CLAUDE.md"; then
  cp "$DEST/CLAUDE.md" "$DEST/CLAUDE.md.bak-$STAMP"
  echo "backed up existing CLAUDE.md -> CLAUDE.md.bak-$STAMP"
fi
cp "$SRC/CLAUDE.md" "$DEST/CLAUDE.md"
echo "installed  $DEST/CLAUDE.md"

# --- skills ----------------------------------------------------------------
for d in "$SRC"/skills/*/; do
  name="$(basename "$d")"
  if [ -d "$DEST/skills/$name" ] && ! diff -rq "$d" "$DEST/skills/$name" >/dev/null 2>&1; then
    mv "$DEST/skills/$name" "$DEST/skills/.$name.bak-$STAMP"
    echo "backed up existing skill $name"
  fi
  rm -rf "$DEST/skills/$name"
  cp -r "$d" "$DEST/skills/$name"
  echo "installed  skill: $name"
done

echo
echo "Done. $(ls -d "$SRC"/skills/*/ | wc -l) skills + global CLAUDE.md installed to $DEST"
echo "Restart Claude Code (or start a new session) to pick them up."
