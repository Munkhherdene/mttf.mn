# Mongolian Table Tennis Federation - Platform Documentation

## 📋 Project Overview

A comprehensive web platform for the Mongolian Table Tennis Federation featuring:
- **Public Website** - News, rankings, tournaments, and player profiles
- **Admin Dashboard** - Complete management system for all data
- **ELO Rating System** - Automatic player ranking calculation
- **Match Statistics** - Detailed performance analytics

---

## 🏗️ Architecture

### Tech Stack

**Backend:**
- Node.js + Express.js
- PostgreSQL database
- JWT authentication
- Joi validation
- Bcrypt for password hashing

**Frontend:**
- Next.js (React framework)
- Tailwind CSS (styling)
- Axios (HTTP client)
- Recharts (data visualization)

**Deployment:**
- Frontend: Vercel
- Backend: Railway or Render
- Database: PostgreSQL (managed)

---

## 📁 Project Structure

```
mttf.mn/
├── backend/
│   ├── src/
│   │   ├── config/          # Database connection
│   │   ├── controllers/     # HTTP request handlers
│   │   ├── middleware/      # Authentication, validation
│   │   ├── models/          # Data models
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   ├── utils/           # Utilities (ELO, validation)
│   │   └── index.js         # Main server file
│   ├── scripts/
│   │   └── seed.js          # Database seeding
│   ├── package.json
│   ├── .env.example
│   └── README.md
│
├── frontend/
│   ├── pages/
│   │   ├── _app.js          # App wrapper
│   │   ├── _document.js     # HTML document
│   │   ├── index.js         # Home page
│   │   ├── players/         # Players pages
│   │   ├── tournaments/     # Tournament pages
│   │   ├── news/            # News pages
│   │   ├── rankings.js      # Rankings page
│   │   └── admin/           # Admin pages
│   ├── components/          # Reusable components
│   ├── lib/                 # Utilities and API client
│   ├── styles/              # Global styles
│   ├── public/              # Static files
│   ├── package.json
│   ├── next.config.js
│   └── tailwind.config.js
│
├── database/
│   └── schema.sql           # PostgreSQL schema
│
├── docs/
│   ├── README.md            # This file
│   ├── API.md               # API documentation
│   └── DEPLOYMENT.md        # Deployment guide
│
└── .gitignore
```

---

## 🗄️ Database Schema

### Core Tables

**players**
- Primary player information
- ELO rating (updated after matches)
- Win/loss statistics

**tournaments**
- Tournament information
- Dates and location
- Type (National, International, Club)

**matches**
- Match records linking two players
- Tournament reference
- Winner and scores (calculated from sets)

**match_sets**
- Individual set scores
- Supports best-of-3, best-of-5 formats

**rankings**
- Historical rating tracking
- Player position snapshots

**news**
- Published articles
- Author attribution
- Draft support

**users**
- Admin accounts
- Role-based access (admin, editor)

---

## 🔐 Authentication & Authorization

### JWT (JSON Web Tokens)
- Token-based authentication
- Expiration: 7 days (configurable)
- Stored in localStorage (frontend)

### Roles
- **Admin:** Full access to all operations including deletions
- **Editor:** Can create and edit content, but cannot delete

### Protected Endpoints
```
POST   /players              (admin/editor)
PATCH  /players/:id          (admin/editor)
DELETE /players/:id          (admin)
POST   /tournaments          (admin/editor)
PATCH  /tournaments/:id      (admin/editor)
DELETE /tournaments/:id      (admin)
POST   /matches              (admin/editor)
POST   /news                 (admin/editor)
PATCH  /news/:id             (admin/editor)
DELETE /news/:id             (admin)
```

---

## 🎯 ELO Rating System

### Formula
```
Expected Score: E = 1 / (1 + 10^((opponent_rating - player_rating) / 400))
New Rating = Old Rating + K × (Actual - Expected)
```

### Parameters
- **K-factor:** 32 (configurable via environment)
- **Base Rating:** 1000 (starting rating for new players)

### Example Calculation
```
Player A (1000) vs Player B (1200):
  E_A = 1 / (1 + 10^(200/400)) = 0.241
  E_B = 0.759

  If A wins (actual = 1):
    A's new rating = 1000 + 32 × (1 - 0.241) = 1024
    B's new rating = 1200 + 32 × (0 - 0.759) = 1176
```

### Automatic Updates
Ratings update automatically when matches are recorded in the admin dashboard.

---

## 👥 User Roles & Permissions

### Admin
- Create, read, update, delete all entities
- Manage user accounts
- Access all admin features
- Publish/unpublish news

### Editor
- Create and edit content
- Record match results
- Cannot delete entities
- Cannot manage admin accounts

### Public User
- View-only access to all public data
- No authentication required

---

## 🚀 Key Features

### For Public Users
1. **Browse Players** - View all registered players
2. **Player Profiles** - Detailed stats, recent matches, head-to-head records
3. **Ranking System** - Real-time ELO rankings
4. **Tournament Info** - Complete tournament schedules and results
5. **Match Details** - Set-by-set scores and player stats
6. **News Feed** - Latest announcements and updates
7. **Statistics** - Win rates, performance trends, tournament history

### For Administrators
1. **Player Management**
   - Add new players
   - Edit player profiles
   - View comprehensive statistics
   - Automatic rating calculations

2. **Tournament Management**
   - Create tournaments
   - Set dates and locations
   - View all matches
   - Track tournament progress

3. **Match Recording**
   - User-friendly form for set-by-set scores
   - Automatic rating updates via ELO system
   - Set winner determination
   - Historical match data

4. **News Management**
   - Create and publish articles
   - Draft support
   - Author attribution
   - Edit or remove articles

5. **Analytics Dashboard**
   - Player statistics
   - Tournament performance
   - Rating trends
   - System overview

---

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 640px, 768px, 1024px, 1280px
- Optimized for phones, tablets, desktops
- Accessible UI components

---

## 🔍 Advanced Statistics

### Player Stats Include:
- Total matches, wins, losses
- Win rate percentage
- Last 10 match form
- Head-to-head vs other players
- Performance by tournament
- Rating trends
- Peak rating

### Match Analysis:
- Set-by-set breakdown
- Player ratings at match time
- Rank changes after match
- Tournament context

---

## 📊 Data Insights

### Rankings Page
- Real-time player rankings
- Sorted by ELO rating
- Win/loss ratios
- Win rate percentages
- 50 players per page with pagination

### Player Detail Pages
- Complete player biography
- Last 10 matches with outcomes
- Tournament performance breakdown
- Head-to-head statistics
- Rating history

### Tournament Pages
- Upcoming and completed tournaments
- Match list with results
- Player participation details
- Tournament statistics

---

## 🔗 API Integration

All frontend-backend communication uses REST API:
- Base URL: `http://localhost:5000/api` (dev)
- JSON request/response format
- Consistent error handling
- Pagination support (limit, offset)

See [API.md](./API.md) for full endpoint documentation.

---

## 🧪 Testing & Seed Data

### Sample Data Includes:
- 2 admin accounts
- 10 players with various ratings
- 3 tournaments (national, international, club)
- 5+ match records with complete set data
- 3 news articles
- Realistic Mongolia-based names and clubs

### Run Seed Script:
```bash
cd backend
npm run seed
```

---

## 🛡️ Security Features

1. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - No plain text password storage

2. **API Security**
   - JWT token validation
   - Role-based access control
   - Input validation (Joi)
   - CORS protection

3. **Data Integrity**
   - Database constraints
   - Foreign key relationships
   - Transaction support

4. **Production Ready**
   - Environment variable configuration
   - Helmet.js security headers
   - HTTPS-ready architecture
   - Rate limiting ready

---

## 📈 Performance Considerations

1. **Database**
   - Indexed fields (rating, created_at, etc.)
   - Optimized queries
   - Connection pooling

2. **Frontend**
   - Next.js static generation (ISR)
   - Code splitting
   - Image optimization ready
   - Client-side caching

3. **Caching Strategy**
   - 60-second ISR on public pages
   - 300-second ISR on detail pages
   - Server-side caching ready for Redis

---

## 🔄 Development Workflow

1. **Local Development**
   ```bash
   cd backend && npm run dev
   cd frontend && npm run dev
   ```

2. **Making Changes**
   - Backend: Restart server (nodemon watches files)
   - Frontend: Hot reload on save

3. **Database Changes**
   - Update schema.sql
   - Run seed script again if needed

4. **Deployment**
   - Push to GitHub
   - Vercel/Railway auto-deploy
   - See DEPLOYMENT.md for details

---

## 📞 Support & Contact

- **Email:** info@mttf.mn
- **Website:** https://mttf.mn
- **Federation:** Mongolian Table Tennis Federation

---

## 📝 Version History

- **v1.0.0** - Initial release with full-stack implementation
  - Complete API with all endpoints
  - Public website with player, tournament, and news pages
  - Admin dashboard with CRUD operations
  - ELO rating system
  - PostgreSQL database with proper schema
  - Seed data for testing
  - Full documentation

---

## 📄 License

Mongolian Table Tennis Federation Platform
© 2026. All rights reserved.

---

## 🎓 Learning Resources

- Next.js: https://nextjs.org/docs
- Express.js: https://expressjs.com
- PostgreSQL: https://www.postgresql.org/docs
- Tailwind CSS: https://tailwindcss.com/docs
- JWT: https://jwt.io
- ELO Rating: https://en.wikipedia.org/wiki/Elo_rating_system

---

**Last Updated:** April 5, 2026
**Status:** Production Ready ✅
