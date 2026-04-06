# 🏓 Mongolian Table Tennis Federation - Complete Platform

> A production-ready, full-stack web platform for national table tennis federation featuring player management, tournament tracking, ELO ratings, and advanced statistics.

![Status](https://img.shields.io/badge/status-production--ready-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-proprietary-blue)

---

## 📖 Quick Start

### 1. Backend Setup (2 minutes)
```bash
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```
Backend runs on: `http://localhost:5000`

### 2. Frontend Setup (2 minutes)
```bash
cd frontend
npm install
npm run dev
```
Frontend runs on: `http://localhost:3000`

### 3. Login
- **Email:** `admin@mttf.mn`
- **Password:** `password123`
- **URL:** `http://localhost:3000/admin/login`

---

## ✨ Key Features

### Public Website
✅ Homepage with featured content  
✅ Player profiles with statistics  
✅ Tournament schedule and results  
✅ Real-time ELO rankings  
✅ Match details with set-by-set scores  
✅ News and updates feed  
✅ Advanced player statistics  
✅ Head-to-head comparison  

### Admin Dashboard
✅ Secure JWT authentication  
✅ Role-based access control  
✅ Player management (CRUD)  
✅ Tournament management  
✅ Match result input with automatic rating updates  
✅ News publishing  
✅ Real-time statistics  
✅ User-friendly forms  

### ELO Rating System
✅ Automatic calculation after each match  
✅ Configurable K-factor  
✅ Expected score formula  
✅ Rating history tracking  
✅ Peak rating monitoring  

---

## 🏗️ Architecture

### Backend Stack
- **Framework:** Node.js + Express.js
- **Database:** PostgreSQL with proper indexing
- **Auth:** JWT (JSON Web Tokens)
- **Validation:** Joi schemas
- **Security:** Bcryptjs, Helmet.js, CORS

### Frontend Stack
- **Framework:** Next.js (React)
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Charts:** Recharts (ready for stats)
- **Authentication:** JWT with localStorage

---

## 📁 Project Structure

```
mttf.mn/
├── 📂 backend/               # Node.js + Express API
│   ├── src/
│   │   ├── config/           # Database setup
│   │   ├── controllers/      # Request handlers
│   │   ├── services/         # Business logic
│   │   ├── middleware/       # Auth, validation
│   │   ├── routes/           # API routes
│   │   ├── utils/            # ELO system, validation
│   │   └── index.js          # Main server
│   ├── scripts/seed.js       # Sample data
│   └── package.json
│
├── 📂 frontend/              # Next.js + React
│   ├── pages/                # Page routes
│   ├── components/           # Reusable UI
│   ├── lib/                  # API client
│   ├── styles/               # Tailwind CSS
│   └── package.json
│
├── 📂 database/
│   └── schema.sql            # PostgreSQL schema
│
├── 📂 docs/
│   ├── README.md             # Overview
│   ├── API.md                # API documentation
│   └── DEPLOYMENT.md         # Setup & deployment
│
└── README.md                 # This file
```

---

## 🗄️ Database Schema

### 7 Main Tables

| Table | Purpose | Records |
|-------|---------|---------|
| **players** | Player profiles & ratings | Indexed by rating |
| **tournaments** | Tournament info | Indexed by date |
| **matches** | Match records | Indexed by date & players |
| **match_sets** | Set-by-set scores | Linked to matches |
| **rankings** | Historical ratings | Auto-updated |
| **news** | Published articles | Indexed by date |
| **users** | Admin accounts | Role-based |

---

## 🔐 Authentication

### JWT Tokens
- **Expiration:** 7 days (configurable)
- **Secret:** Environment variable
- **Storage:** localStorage (frontend)

### Roles
- **Admin:** Full CRUD + deletion rights
- **Editor:** Create/edit but no deletion
- **Public:** View-only

---

## 🎯 ELO Rating System

### Formula
```
E = 1 / (1 + 10^((opponent_rating - player_rating) / 400))
New_Rating = Old_Rating + K × (Actual - Expected)
```

### Example
```
Player A (1000) vs Player B (1200) - A wins:
  Expected: A=24.1%, B=75.9%
  A gains: +24 points → 1024
  B loses: -24 points → 1176
```

**Automatic:** Ratings update instantly when match is recorded.

---

## 📊 API Endpoints

### Core Endpoints (41 total)
```
Authentication (3)
GET    /auth/me
POST   /auth/login
POST   /auth/register

Players (7)
GET    /players
GET    /players/rankings
GET    /players/:id
POST   /players
PATCH  /players/:id
DELETE /players/:id
GET    /players/:id/matches

Tournaments (5)
GET    /tournaments
GET    /tournaments/:id
POST   /tournaments
PATCH  /tournaments/:id
DELETE /tournaments/:id

Matches (6)
GET    /matches
GET    /matches/:id
POST   /matches (auto updates ratings!)
GET    /players/:id/head-to-head/:opponentId
GET    /players/:id/tournament-stats
...and more

News (6)
GET    /news
POST   /news
PATCH  /news/:id
DELETE /news/:id
...and more
```

See [docs/API.md](./docs/API.md) for complete reference.

---

## 🚀 Quick Deployment

### Vercel (Frontend)
```bash
# Push to GitHub, connect to Vercel
# Auto-deploys on push
# Env: NEXT_PUBLIC_API_URL
```

### Railway (Backend)
```bash
# Connect GitHub repo
# Add PostgreSQL plugin
# Set environment variables
# Deploy with one click
```

### Docker Compose (Full Stack)
```bash
docker-compose up -d
# All services run together
```

See [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) for full guide.

---

## 📈 Performance

- ✅ Database indexes on all query fields
- ✅ Connection pooling (PostgreSQL)
- ✅ Next.js ISR (Incremental Static Regeneration)
- ✅ Code splitting & lazy loading
- ✅ Pagination support (limit, offset)
- ✅ Caching ready (Redis compatible)

---

## 🧪 Testing

### Sample Data Included
- 2 admin accounts
- 10 players with realistic ratings
- 3 tournaments (National, International, Club)
- 5+ match records with complete scores
- 3 news articles
- Real Mongolian names and clubs

### Seed Database
```bash
cd backend
npm run seed
```

---

## 🛡️ Security Features

- 🔒 JWT token-based auth
- 🔒 Bcrypt password hashing
- 🔒 Role-based access control
- 🔒 Input validation (Joi)
- 🔒 SQL injection prevention (parameterized queries)
- 🔒 CORS protection
- 🔒 Helmet.js security headers
- 🔒 Environment variables for secrets

---

## 📱 Frontend Pages

### Public Pages
- `/` - Homepage with featured content
- `/players` - All players directory
- `/players/[id]` - Player profile & stats
- `/tournaments` - Tournament list
- `/tournaments/[id]` - Tournament details
- `/rankings` - Live player rankings
- `/news` - News feed
- `/news/[id]` - Full article

### Admin Pages
- `/admin/login` - Authentication
- `/admin/dashboard` - Main dashboard
- `/admin/players` - Player management
- `/admin/tournaments` - Tournament management
- `/admin/matches` - Match recording
- `/admin/news` - News management

---

## 🎨 UI/UX

- **Design System:** Tailwind CSS utility classes
- **Responsive:** Mobile-first, all breakpoints
- **Components:** Reusable, well-structured
- **Colors:** Professional blue theme
- **Typography:** Clear hierarchy
- **Forms:** Validation feedback included
- **Tables:** Sortable, paginated
- **Cards:** Hover effects, transitions

---

## 📚 Documentation

- **[docs/README.md](./docs/README.md)** - Complete platform overview
- **[docs/API.md](./docs/API.md)** - Full API reference with examples
- **[docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Setup & production deployment

---

## 🔧 Technology Stack Summary

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Node.js + Express | 18+ / 4.x |
| **Database** | PostgreSQL | 12+ |
| **Auth** | JWT + Bcrypt | jsonwebtoken / bcryptjs |
| **Frontend** | Next.js + React | 14.x / 18.x |
| **Styling** | Tailwind CSS | 3.x |
| **Validation** | Joi | 17.x |
| **HTTP** | Axios | 1.x |

---

## 💡 Example Workflows

### Adding a Player
1. Admin goes to `/admin/players`
2. Fills form: Name, age, club
3. System assigns base rating (1000)
4. Player appears in rankings immediately

### Recording a Match
1. Go to `/admin/matches`
2. Select tournament, players, date
3. Enter set-by-set scores
4. Submit - **system auto-updates both players' ratings**
5. Match appears on player profiles

### Publishing News
1. Create article in `/admin/news`
2. Draft with `published: false`
3. Edit as needed
4. Set `published: true`
5. Appears on public news feed

---

## 📞 Support

- **Email:** info@mttf.mn
- **Federation:** Mongolian Table Tennis Federation
- **Website:** https://mttf.mn

---

## 📄 License

Mongolian Table Tennis Federation Platform  
© 2026. Proprietary software.

---

## ✅ Production Checklist

Before going live:

- [ ] Change JWT_SECRET to long random string
- [ ] Set NODE_ENV=production
- [ ] Configure CORS for your domain
- [ ] Use HTTPS everywhere
- [ ] Set up database backups
- [ ] Configure monitoring/logging
- [ ] Update admin credentials
- [ ] Test all features
- [ ] Set up CI/CD pipeline
- [ ] Document API endpoints for integrations

---

## 🚀 Get Started Now

```bash
# Clone the repository
git clone <repo-url>
cd mttf.mn

# Backend
cd backend
npm install && npm run seed && npm run dev

# Frontend (new terminal)
cd frontend
npm install && npm run dev

# Open browser
http://localhost:3000
```

**That's it! You have a production-ready table tennis platform.** 🎉

---

**Version:** 1.0.0  
**Status:** Production Ready ✅  
**Updated:** April 2026
