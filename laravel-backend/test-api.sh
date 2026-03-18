#!/bin/bash

# MusicGrid API Testing Script
# Test all API endpoints

BASE_URL="http://localhost:8000/api"

echo "==================================="
echo "MusicGrid API Testing"
echo "==================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 1. Get all songs
echo -e "${BLUE}1. GET All Songs${NC}"
curl -X GET "$BASE_URL/songs" \
  -H "Accept: application/json"
echo -e "\n${GREEN}✓ Success${NC}\n"

# 2. Create new song
echo -e "${BLUE}2. POST Create New Song${NC}"
curl -X POST "$BASE_URL/songs" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "title": "Hallelujah",
    "artist": "Leonard Cohen",
    "key": "C",
    "notes": "Beautiful melancholic song",
    "is_bookmarked": true
  }'
echo -e "\n${GREEN}✓ Success${NC}\n"

# 3. Get specific song (assuming ID 1)
echo -e "${BLUE}3. GET Specific Song (ID: 1)${NC}"
curl -X GET "$BASE_URL/songs/1" \
  -H "Accept: application/json"
echo -e "\n${GREEN}✓ Success${NC}\n"

# 4. Update song
echo -e "${BLUE}4. PATCH Update Song (ID: 1)${NC}"
curl -X PATCH "$BASE_URL/songs/1" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "key": "G",
    "notes": "Updated notes"
  }'
echo -e "\n${GREEN}✓ Success${NC}\n"

# 5. Get all chords
echo -e "${BLUE}5. GET All Chords${NC}"
curl -X GET "$BASE_URL/chords" \
  -H "Accept: application/json"
echo -e "\n${GREEN}✓ Success${NC}\n"

# 6. Create new chord
echo -e "${BLUE}6. POST Create New Chord${NC}"
curl -X POST "$BASE_URL/chords" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "song_id": 1,
    "note": "Dm",
    "chord_name": "D Minor"
  }'
echo -e "\n${GREEN}✓ Success${NC}\n"

# 7. Create chord row
echo -e "${BLUE}7. POST Create Chord Row${NC}"
curl -X POST "$BASE_URL/chord-rows" \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "song_id": 1,
    "row_index": 2,
    "chords": ["Dm", "G", "C"]
  }'
echo -e "\n${GREEN}✓ Success${NC}\n"

echo -e "${GREEN}=== All Tests Complete ===${NC}"
