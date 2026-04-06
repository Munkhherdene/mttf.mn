# Mongolian Table Tennis Federation - Complete API Documentation

## Base URL
```
http://localhost:5000/api
```

Production: `https://api.mttf.mn/api`

---

## Authentication

### Login
- **POST** `/auth/login`
- **Body:**
  ```json
  {
    "email": "admin@mttf.mn",
    "password": "password123"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful",
    "data": {
      "token": "eyJhbGc...",
      "user": {
        "id": 1,
        "email": "admin@mttf.mn",
        "name": "Admin User",
        "role": "admin"
      }
    }
  }
  ```

### Register
- **POST** `/auth/register`
- **Body:**
  ```json
  {
    "email": "newuser@mttf.mn",
    "password": "securepassword123",
    "name": "New User"
  }
  ```

### Get Current User
- **GET** `/auth/me` (requires authentication)

---

## Players

### Get All Players
- **GET** `/players?limit=50&offset=0&sortBy=rating`
- **Response:**
  ```json
  {
    "success": true,
    "data": [
      {
        "id": 1,
        "name": "Player Name",
        "age": 28,
        "club": "UB Club",
        "nationality": "Mongolia",
        "rating": 1200,
        "peak_rating": 1250,
        "total_matches": 45,
        "wins": 30,
        "losses": 15,
        "created_at": "2026-01-15T10:00:00Z"
      }
    ],
    "pagination": { "limit": 50, "offset": 0 }
  }
  ```

### Get Player by ID
- **GET** `/players/:id`

### Get Rankings
- **GET** `/players/rankings?limit=50&offset=0`
- Returns players sorted by rating with rank positions

### Create Player
- **POST** `/players` (requires admin/editor role)
- **Body:**
  ```json
  {
    "name": "New Player",
    "age": 25,
    "club": "UB Club",
    "nationality": "Mongolia"
  }
  ```

### Update Player
- **PATCH** `/players/:id` (requires admin/editor role)
- **Body:** (any or all fields)
  ```json
  {
    "name": "Updated Name",
    "club": "New Club"
  }
  ```

### Delete Player
- **DELETE** `/players/:id` (requires admin role)

---

## Tournaments

### Get All Tournaments
- **GET** `/tournaments?limit=50&offset=0`

### Get Tournament by ID
- **GET** `/tournaments/:id`
- Includes all matches for the tournament

### Create Tournament
- **POST** `/tournaments` (requires admin/editor role)
- **Body:**
  ```json
  {
    "name": "National Championship 2026",
    "start_date": "2026-03-15",
    "end_date": "2026-03-22",
    "location": "Ulaanbaatar",
    "type": "National",
    "description": "Annual national tournament"
  }
  ```

### Update Tournament
- **PATCH** `/tournaments/:id` (requires admin/editor role)

### Delete Tournament
- **DELETE** `/tournaments/:id` (requires admin role)

---

## Matches

### Get All Matches
- **GET** `/matches?tournament_id=1&limit=50&offset=0`

### Get Match by ID
- **GET** `/matches/:id`
- Includes detailed set information

### Create Match
- **POST** `/matches` (requires admin/editor role)
- **Important:** This endpoint automatically updates player ratings using the ELO system
- **Body:**
  ```json
  {
    "tournament_id": 1,
    "player1_id": 1,
    "player2_id": 2,
    "winner_id": 1,
    "played_at": "2026-03-16T10:00:00Z",
    "sets": [
      {
        "set_number": 1,
        "player1_score": 11,
        "player2_score": 8
      },
      {
        "set_number": 2,
        "player1_score": 11,
        "player2_score": 9
      },
      {
        "set_number": 3,
        "player1_score": 10,
        "player2_score": 12
      }
    ]
  }
  ```

### Get Head-to-Head
- **GET** `/players/:id/head-to-head/:opponentId`
- Returns total matches and wins for each player

### Get Player Matches
- **GET** `/players/:id/matches?limit=10`
- Returns recent matches for a player

### Get Tournament Stats
- **GET** `/players/:id/tournament-stats`
- Performance breakdown by tournament

---

## News

### Get Published News
- **GET** `/news?limit=20&offset=0`

### Get All News (Admin)
- **GET** `/news/admin/all` (requires admin/editor role)
- Includes unpublished articles

### Get News by ID
- **GET** `/news/:id`

### Create News
- **POST** `/news` (requires admin/editor role)
- **Body:**
  ```json
  {
    "title": "Article Title",
    "content": "Article content here...",
    "published": true
  }
  ```

### Update News
- **PATCH** `/news/:id` (requires admin/editor role)

### Delete News
- **DELETE** `/news/:id` (requires admin role)

---

## ELO Rating System

The system uses the standard ELO rating formula:

**Expected Score:** `E = 1 / (1 + 10^((opponent_rating - player_rating) / 400))`

**New Rating:** `New Rating = Old Rating + K × (Actual - Expected)`

Where:
- K = K-factor (default: 32)
- Actual = 1 for win, 0 for loss
- Expected = calculated expected score

### Rating Changes Example:
```
Player A (Rating: 1000) vs Player B (Rating: 1200)

Expected Score for A: 1 / (1 + 10^(200/400)) = 0.241
Expected Score for B: 0.759

If A wins:
  A gains: 32 × (1 - 0.241) = +24 points → 1024
  B loses: 32 × (0 - 0.759) = -24 points → 1176

If B wins:
  A loses: 32 × (0 - 0.241) = -8 points → 992
  B gains: 32 × (1 - 0.759) = +8 points → 1208
```

---

## Error Responses

All error responses follow this format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Common Status Codes:
- **200** - Success
- **201** - Created
- **400** - Bad Request / Validation Error
- **401** - Unauthorized
- **403** - Forbidden
- **404** - Not Found
- **500** - Server Error

---

## Rate Limiting & Best Practices

- Use pagination for large datasets (limit, offset)
- Cache rankings and tournament data (updates every 60 seconds)
- Store JWT token securely in localStorage (frontend)
- Always include Authorization header: `Bearer <token>`
- Validate data on both client and server

---

## Example Workflows

### Workflow 1: Create a Complete Tournament with Matches

1. Create tournament: `POST /tournaments`
2. Ensure all players exist: `GET /players`
3. Record match results: `POST /matches` (ratings auto-update)
4. View tournament: `GET /tournaments/:id`

### Workflow 2: Update Player Rankings

Ratings automatically update when matches are created. No manual action needed.

1. Submit match: `POST /matches`
2. System calculates ELO changes
3. Player ratings update instantly
4. View rankings: `GET /players/rankings`

### Workflow 3: Publish News

1. Create draft: `POST /news` with `published: false`
2. View unpublished: `GET /news/admin/all`
3. Publish: `PATCH /news/:id` with `published: true`
4. Public views at: `GET /news`

---

## Health Check

- **GET** `/health`
- Returns: `{ "status": "OK", "timestamp": "..." }`

---

For support: info@mttf.mn
