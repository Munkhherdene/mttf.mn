# Setup & Deployment Guide

## Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 12+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file from example:**
   ```bash
   cp .env.example .env
   ```

4. **Update `.env` with your database credentials:**
   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=mttf_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   JWT_SECRET=your_secret_key_here_change_in_production
   PORT=5000
   NODE_ENV=development
   ```

5. **Create PostgreSQL database:**
   ```bash
   createdb mttf_db
   ```

6. **Initialize database schema:**
   ```bash
   psql -U postgres -d mttf_db -f ../database/schema.sql
   ```

7. **Seed database with sample data:**
   ```bash
   npm run seed
   ```

8. **Start backend server:**
   ```bash
   npm run dev
   ```
   Server runs on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env.local` file:**
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```
   Frontend runs on `http://localhost:3000`

### Testing Locally

1. Visit `http://localhost:3000` for public website
2. Visit `http://localhost:3000/admin/login` for admin panel
3. **Demo Credentials:**
   - Email: `admin@mttf.mn`
   - Password: `password123`

---

## Production Deployment

### Environment Variables Checklist

#### Backend (.env)
```env
DB_HOST=production-db-host
DB_PORT=5432
DB_NAME=mttf_db
DB_USER=postgres_user
DB_PASSWORD=secure_password_here
JWT_SECRET=change_to_very_long_random_secret_key
JWT_EXPIRY=7d
NODE_ENV=production
PORT=5000
```

#### Frontend (.env.production)
```env
NEXT_PUBLIC_API_URL=https://api.mttf.mn/api
```

### Option 1: Vercel (Recommended for Frontend)

1. **Push code to GitHub**
2. **Connect GitHub to Vercel:** vercel.com/import
3. **Configure environment variables** in Vercel dashboard
4. **Deploy:** Automatic on push to main branch

### Option 2: Railway (Recommended for Backend)

1. **Create Railway account:** railway.app
2. **Create new project**
3. **Connect GitHub repository**
4. **Add PostgreSQL plugin**
5. **Configure environment variables**
6. **Deploy:** Automatic

### Option 3: Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/.next ./.next
COPY public ./public
EXPOSE 3000
CMD ["npm", "start"]
```

**Docker Compose:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "5000:5000"
    environment:
      DB_HOST: postgres
      NODE_ENV: production
    depends_on:
      - postgres
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:5000/api
    depends_on:
      - backend
  
  postgres:
    image: postgres:14
    environment:
      POSTGRES_DB: mttf_db
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./database/schema.sql:/docker-entrypoint-initdb.d/schema.sql

volumes:
  postgres_data:
```

Run with: `docker-compose up -d`

---

## Database Backup & Restore

### Backup PostgreSQL
```bash
pg_dump -U postgres -d mttf_db > backup.sql
```

### Restore PostgreSQL
```bash
psql -U postgres -d mttf_db < backup.sql
```

---

## Monitoring & Maintenance

### Health Checks
```bash
# Backend health
curl http://localhost:5000/health

# Frontend accessible on http://localhost:3000
```

### Database Maintenance
```bash
# View slow queries
EXPLAIN ANALYZE SELECT * FROM matches;

# Vacuum and analyze
VACUUM ANALYZE;
```

### Log Monitoring

**Backend logs:**
```bash
# If using systemd
journalctl -u mttf-backend -f

# If using Docker
docker logs -f mttf-backend
```

---

## Security Checklist

- [ ] Change JWT_SECRET to a long random string
- [ ] Use HTTPS in production
- [ ] Set up CORS properly for your domain
- [ ] Use strong database passwords
- [ ] Enable database backups
- [ ] Set up firewall rules
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (consider using nginx or middleware)
- [ ] Set up monitoring and alerting
- [ ] Regular security updates for dependencies

---

## Troubleshooting

### Connection Issues
```bash
# Check if backend is running
lsof -i :5000

# Test database connection
psql -U postgres -d mttf_db -c "SELECT 1"
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Use different port
PORT=8000 npm run dev
```

### Database Issues
```bash
# Reset database
dropdb mttf_db
createdb mttf_db
psql -U postgres -d mttf_db -f ../database/schema.sql
npm run seed
```

---

## Performance Optimization

1. **Database Indexing:** Already configured in schema.sql
2. **Frontend Caching:** Next.js ISR (Incremental Static Regeneration)
3. **API Caching:** Implement Redis for rankings cache
4. **Image Optimization:** Use Next.js Image component
5. **Code Splitting:** Next.js automatic code splitting

---

## Support

For deployment issues or questions:
- Email: info@mttf.mn
- GitHub Issues: [project-repo]
- Documentation: /docs

---

**Last Updated:** April 2026
**Version:** 1.0.0
