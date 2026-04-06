# Vercel Deployment Instructions for MTTF

## Steps to Deploy to Vercel:

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```
Follow the prompts to authenticate with your GitHub/email

### 3. Deploy the Project
In the project root directory:
```bash
vercel
```

### 4. Configure Environment Variables
During deployment, Vercel will ask you these questions:
- **Project name**: `mttf-mn`
- **Project directory**: `.`
- **Build Command**: 
  ```
  cd frontend && npm run build
  ```
- **Output Directory**: `frontend/.next`
- **Install Command**: `npm install && cd backend && npm install && cd ../frontend && npm install`

### 5. Set Environment Variables in Vercel Dashboard
After deployment, add to your Vercel project settings:
- **NEXT_PUBLIC_API_URL**: `https://your-vercel-domain.vercel.app/api`
- **DATABASE_PATH**: `./data/mttf.db` (for SQLite)

### 6. Production Deployment
To deploy to production:
```bash
vercel --prod
```

## Alternative: Using GitHub Integration (Recommended)
1. Push your code to GitHub
2. Go to https://vercel.com
3. Click "New Project"
4. Select your `mttf.mn` repository
5. Click "Import"
6. Vercel auto-detects your Next.js project
7. Click "Deploy"

## Troubleshooting

**Issue**: "Cannot find module" errors
- Make sure both `backend/` and `frontend/` have valid `package.json` files

**Issue**: Database not found
- Vercel's filesystem is ephemeral. Consider using MongoDB Atlas (free tier) instead of SQLite

**Issue**: API calls returning 404
- Ensure `NEXT_PUBLIC_API_URL` environment variable is set correctly

## Next Steps After Deployment
1. Test your application at the Vercel URL
2. Connect your GitHub repo for automatic deployments on push
3. Set up CI/CD pipeline for automatic tests
