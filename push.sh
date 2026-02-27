#!/bin/bash

# MusicGrid Push Script
# Usage: ./push.sh [commit message]

cd "$(dirname "$0")"

MESSAGE="${1:-Update}"

git add -A
git commit -m "$MESSAGE"

# Push with stored credentials
git remote set-url origin "https://x-token-auth:ATCTT3xFfGN0G-_-yhx9mGlb2zUbM1MCIxuEcHvGDTASt1Hm0Q3kvEibkv27I1AKU_o08rFLPVYU7nJ5klLz0kfKzVeEdpLBPFAmtaZJrvAA_vJRqck5IsWdGxbOpTzuqhciNjEUePKXYA7AeI0PtuX5DmcNQWeytb2Oa_jwLDk1Z3X-q5vI-hI=8961AD34@bitbucket.org/andi_personal/chord-grid-composer.git"

GIT_TERMINAL_PROMPT=0 git push origin main
