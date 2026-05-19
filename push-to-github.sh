#!/usr/bin/env bash
# =============================================================
# push-to-github.sh
# Pushes all arc-community Next.js files to your GitHub repo
# using the GitHub API (no git CLI needed).
#
# Usage:
#   chmod +x push-to-github.sh
#   ./push-to-github.sh YOUR_GITHUB_PAT
#
# How to get a PAT:
#   GitHub → Settings → Developer settings →
#   Personal access tokens → Tokens (classic) →
#   Generate new token → check "repo" scope → copy token
# =============================================================

set -e

TOKEN="$1"
OWNER="mehedi2580"
REPO="ARC-Community"
BRANCH="main"
API="https://api.github.com"

if [ -z "$TOKEN" ]; then
  echo "❌  Usage: ./push-to-github.sh YOUR_GITHUB_PAT"
  exit 1
fi

echo "📡  Fetching current branch SHA..."
BRANCH_SHA=$(curl -sfL -H "Authorization: token $TOKEN" \
  "$API/repos/$OWNER/$REPO/git/refs/heads/$BRANCH" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['object']['sha'])")
echo "   Branch SHA: $BRANCH_SHA"

echo "🌲  Fetching current tree SHA..."
TREE_SHA=$(curl -sfL -H "Authorization: token $TOKEN" \
  "$API/repos/$OWNER/$REPO/git/commits/$BRANCH_SHA" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['tree']['sha'])")
echo "   Tree SHA: $TREE_SHA"

# ── Build file list ──────────────────────────────────────────
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
FILES=(
  "package.json"
  "tsconfig.json"
  "next.config.ts"
  "tailwind.config.ts"
  "postcss.config.mjs"
  ".eslintrc.json"
  ".gitignore"
  "src/app/globals.css"
  "src/app/layout.tsx"
  "src/app/page.tsx"
  "src/app/not-found.tsx"
  "src/app/feed/layout.tsx"
  "src/app/feed/page.tsx"
  "src/app/explore/layout.tsx"
  "src/app/explore/page.tsx"
  "src/app/notifications/layout.tsx"
  "src/app/notifications/page.tsx"
  "src/app/messages/layout.tsx"
  "src/app/messages/page.tsx"
  "src/app/profile/layout.tsx"
  "src/app/profile/page.tsx"
  "src/app/bookmarks/layout.tsx"
  "src/app/bookmarks/page.tsx"
  "src/app/collectibles/layout.tsx"
  "src/app/collectibles/page.tsx"
  "src/app/referrals/layout.tsx"
  "src/app/referrals/page.tsx"
  "src/app/settings/layout.tsx"
  "src/app/settings/page.tsx"
  "src/app/updates/layout.tsx"
  "src/app/updates/page.tsx"
  "src/lib/mockData.ts"
  "src/components/layout/AppShell.tsx"
  "src/components/layout/Sidebar.tsx"
  "src/components/layout/MobileNav.tsx"
  "src/components/layout/MobileHeader.tsx"
  "src/components/layout/MobileDrawer.tsx"
  "src/components/feed/PostCard.tsx"
  "src/components/feed/CreatePostModal.tsx"
  "src/components/shared/Skeleton.tsx"
)

echo ""
echo "📦  Creating blobs for ${#FILES[@]} files..."

TREE_ITEMS="["
FIRST=1
for FILE in "${FILES[@]}"; do
  FULL_PATH="$SCRIPT_DIR/$FILE"
  if [ ! -f "$FULL_PATH" ]; then
    echo "   ⚠️  Skipping (not found): $FILE"
    continue
  fi
  CONTENT_B64=$(base64 < "$FULL_PATH" | tr -d '\n')
  BLOB_SHA=$(curl -sfL -X POST \
    -H "Authorization: token $TOKEN" \
    -H "Content-Type: application/json" \
    "$API/repos/$OWNER/$REPO/git/blobs" \
    -d "{\"content\":\"$CONTENT_B64\",\"encoding\":\"base64\"}" \
    | python3 -c "import sys,json; print(json.load(sys.stdin)['sha'])")
  echo "   ✅  $FILE → $BLOB_SHA"
  if [ $FIRST -eq 0 ]; then TREE_ITEMS+=","; fi
  TREE_ITEMS+="{\"path\":\"$FILE\",\"mode\":\"100644\",\"type\":\"blob\",\"sha\":\"$BLOB_SHA\"}"
  FIRST=0
done
TREE_ITEMS+="]"

echo ""
echo "🌳  Creating new tree..."
NEW_TREE_SHA=$(curl -sfL -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  "$API/repos/$OWNER/$REPO/git/trees" \
  -d "{\"base_tree\":\"$TREE_SHA\",\"tree\":$TREE_ITEMS}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['sha'])")
echo "   New tree SHA: $NEW_TREE_SHA"

echo ""
echo "📝  Creating commit..."
NEW_COMMIT_SHA=$(curl -sfL -X POST \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  "$API/repos/$OWNER/$REPO/git/commits" \
  -d "{\"message\":\"feat: ARC Community Web3 social platform (Next.js 15)\",\"tree\":\"$NEW_TREE_SHA\",\"parents\":[\"$BRANCH_SHA\"]}" \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['sha'])")
echo "   Commit SHA: $NEW_COMMIT_SHA"

echo ""
echo "🚀  Updating branch ref..."
curl -sfL -X PATCH \
  -H "Authorization: token $TOKEN" \
  -H "Content-Type: application/json" \
  "$API/repos/$OWNER/$REPO/git/refs/heads/$BRANCH" \
  -d "{\"sha\":\"$NEW_COMMIT_SHA\",\"force\":false}" > /dev/null
echo "   ✅  Branch updated!"

echo ""
echo "============================================"
echo "✅  Done! Vercel will auto-deploy in ~60s."
echo "🌐  https://arc-community-liard.vercel.app"
echo "============================================"
