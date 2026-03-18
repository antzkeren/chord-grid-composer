#!/bin/bash

# Railway API Endpoint Testing Script
# Tests all endpoints on chord-grid-composer-production.up.railway.app

BASE_URL="https://chord-grid-composer-production.up.railway.app/api"
AUTH_TOKEN=""
TEST_SONG_ID=""
TEST_SHARE_ID=""

echo "=========================================="
echo "  RAILWAY API ENDPOINT TESTING"
echo "  Base URL: $BASE_URL"
echo "  Time: $(date)"
echo "=========================================="
echo ""

# Function to test endpoint
test_endpoint() {
    local method=$1
    local name=$2
    local endpoint=$3
    local data=$4
    local token=$5
    
    echo "----------------------------------------"
    echo "TEST: $name"
    echo "Method: $method"
    echo "Endpoint: $endpoint"
    
    # Build curl command
    if [ "$method" = "GET" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "${BASE_URL}${endpoint}" \
                -H "Authorization: Bearer $token" \
                -H "Content-Type: application/json" 2>&1)
        else
            response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X GET "${BASE_URL}${endpoint}" \
                -H "Content-Type: application/json" 2>&1)
        fi
    elif [ "$method" = "POST" ]; then
        if [ -n "$token" ]; then
            response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${BASE_URL}${endpoint}" \
                -H "Authorization: Bearer $token" \
                -H "Content-Type: application/json" \
                -d "$data" 2>&1)
        else
            response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X POST "${BASE_URL}${endpoint}" \
                -H "Content-Type: application/json" \
                -d "$data" 2>&1)
        fi
    elif [ "$method" = "PUT" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PUT "${BASE_URL}${endpoint}" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    elif [ "$method" = "PATCH" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X PATCH "${BASE_URL}${endpoint}" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" \
            -d "$data" 2>&1)
    elif [ "$method" = "DELETE" ]; then
        response=$(curl -s -w "\nHTTP_CODE:%{http_code}" -X DELETE "${BASE_URL}${endpoint}" \
            -H "Authorization: Bearer $token" \
            -H "Content-Type: application/json" 2>&1)
    fi
    
    # Extract HTTP code
    http_code=$(echo "$response" | grep "HTTP_CODE:" | cut -d: -f2)
    body=$(echo "$response" | sed 's/HTTP_CODE:.*//')
    
    echo "HTTP Status: $http_code"
    echo "Response: $body"
    echo ""
    
    # Return HTTP code for logic
    echo "$http_code"
}

echo "=========================================="
echo "  SECTION 1: PUBLIC ENDPOINTS (No Auth)"
echo "=========================================="
echo ""

# Test 1: Get All Chords (Public)
echo ">>> TEST 1: Get All Chords"
result=$(test_endpoint "GET" "Get All Chords" "/chords" "" "")
echo "Result: $result"
echo ""

# Test 2: Create Share (Public)
echo ">>> TEST 2: Create Shared Song"
share_data='{"title":"Test Song from API","owner_name":"API Tester","rows":[{"cells":["C","G","Am","F"]}]}'
result=$(test_endpoint "POST" "Create Share" "/share" "$share_data" "")
echo "Result: $result"

if echo "$result" | grep -q "200\|201"; then
    # Try to extract share ID from response
    TEST_SHARE_ID=$(echo "$result" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ -z "$TEST_SHARE_ID" ]; then
        TEST_SHARE_ID=$(echo "$result" | grep -o '"share_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    fi
    echo "Extracted Share ID: $TEST_SHARE_ID"
fi
echo ""

# Test 3: Get Shared Song (if we have ID)
if [ -n "$TEST_SHARE_ID" ]; then
    echo ">>> TEST 3: Get Shared Song"
    result=$(test_endpoint "GET" "Get Shared Song" "/share/$TEST_SHARE_ID" "" "")
    echo "Result: $result"
    echo ""
fi

echo "=========================================="
echo "  SECTION 2: AUTHENTICATION"
echo "=========================================="
echo ""

# Test 4: Register
echo ">>> TEST 4: Register New User"
register_data='{"name":"API Test User","email":"apitest'"$(date +%s)"'@example.com","password":"password123","password_confirmation":"password123"}'
result=$(test_endpoint "POST" "Register" "/register" "$register_data" "")
echo "Result: $result"
echo ""

# Test 5: Login
echo ">>> TEST 5: Login"
login_data='{"email":"apitest@example.com","password":"password123"}'
result=$(test_endpoint "POST" "Login" "/login" "$login_data" "")
echo "Result: $result"

# Extract token from response
if echo "$result" | grep -q '"token"'; then
    AUTH_TOKEN=$(echo "$result" | grep -o '"token":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Extracted Token: ${AUTH_TOKEN:0:20}..."
fi
echo ""

echo "=========================================="
echo "  SECTION 3: PROTECTED ENDPOINTS (Auth)"
echo "=========================================="
echo ""

if [ -n "$AUTH_TOKEN" ]; then
    # Test 6: Get Current User
    echo ">>> TEST 6: Get Current User"
    result=$(test_endpoint "GET" "Get User" "/user" "" "$AUTH_TOKEN")
    echo "Result: $result"
    echo ""

    # Test 7: Get All Songs
    echo ">>> TEST 7: Get All Songs"
    result=$(test_endpoint "GET" "Get All Songs" "/songs" "" "$AUTH_TOKEN")
    echo "Result: $result"
    echo ""

    # Test 8: Create Song
    echo ">>> TEST 8: Create Song"
    song_data='{"title":"Test Song from API","artist":"API Tester","key":"C","notes":"Created by API test","visibility":"private","tempo":120,"time_signature":"4/4","base_chord":"C","rows":[{"cells":["C","G","Am","F"]},{"cells":["C","G","F","G"]}]}'
    result=$(test_endpoint "POST" "Create Song" "/songs" "$song_data" "$AUTH_TOKEN")
    echo "Result: $result"
    
    # Extract song ID
    TEST_SONG_ID=$(echo "$result" | grep -o '"id":[0-9]*' | head -1 | cut -d: -f2)
    if [ -n "$TEST_SONG_ID" ]; then
        echo "Extracted Song ID: $TEST_SONG_ID"
    fi
    echo ""

    # Test 9: Get Song by ID
    if [ -n "$TEST_SONG_ID" ]; then
        echo ">>> TEST 9: Get Song by ID"
        result=$(test_endpoint "GET" "Get Song" "/songs/$TEST_SONG_ID" "" "$AUTH_TOKEN")
        echo "Result: $result"
        echo ""
        
        # Test 10: Update Song
        echo ">>> TEST 10: Update Song"
        update_data='{"title":"Updated Song Title","artist":"Updated Artist","key":"G","visibility":"public"}'
        result=$(test_endpoint "PUT" "Update Song" "/songs/$TEST_SONG_ID" "$update_data" "$AUTH_TOKEN")
        echo "Result: $result"
        echo ""
        
        # Test 11: Bookmark Song
        echo ">>> TEST 11: Bookmark Song"
        result=$(test_endpoint "POST" "Bookmark Song" "/songs/$TEST_SONG_ID/bookmark" "" "$AUTH_TOKEN")
        echo "Result: $result"
        echo ""
        
        # Test 12: Duplicate Song
        echo ">>> TEST 12: Duplicate Song"
        result=$(test_endpoint "POST" "Duplicate Song" "/songs/$TEST_SONG_ID/duplicate" "" "$AUTH_TOKEN")
        echo "Result: $result"
        echo ""
    fi

    # Test 13: Create Chord
    echo ">>> TEST 13: Create Chord"
    chord_data='{"song_id":1,"note":"C4","chord_name":"C Major"}'
    result=$(test_endpoint "POST" "Create Chord" "/chords" "$chord_data" "$AUTH_TOKEN")
    echo "Result: $result"
    echo ""
    
    # Test 14: Get All Chords (with auth)
    echo ">>> TEST 14: Get All Chords (Authenticated)"
    result=$(test_endpoint "GET" "Get All Chords Auth" "/chords" "" "$AUTH_TOKEN")
    echo "Result: $result"
    echo ""

    # Test 15: Logout
    echo ">>> TEST 15: Logout"
    result=$(test_endpoint "POST" "Logout" "/logout" "" "$AUTH_TOKEN")
    echo "Result: $result"
    echo ""
else
    echo "SKIPPED: No authentication token available"
    echo ""
fi

echo "=========================================="
echo "  TEST SUMMARY"
echo "=========================================="
echo "Base URL: $BASE_URL"
echo "Test Time: $(date)"
echo ""
echo "Endpoints Tested:"
echo "  - GET    /api/chords"
echo "  - POST   /api/share"
echo "  - GET    /api/share/{id}"
echo "  - POST   /api/register"
echo "  - POST   /api/login"
echo "  - GET    /api/user"
echo "  - GET    /api/songs"
echo "  - POST   /api/songs"
echo "  - GET    /api/songs/{id}"
echo "  - PUT    /api/songs/{id}"
echo "  - POST   /api/songs/{id}/bookmark"
echo "  - POST   /api/songs/{id}/duplicate"
echo "  - POST   /api/chords"
echo "  - GET    /api/chords (auth)"
echo "  - POST   /api/logout"
echo ""
echo "=========================================="
echo "  TEST COMPLETE"
echo "=========================================="
