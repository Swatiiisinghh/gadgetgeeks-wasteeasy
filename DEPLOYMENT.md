# WasteWise Deployment Guide

## Prerequisites

1. **Supabase Project**
   - Create account at https://supabase.com
   - Create new project
   - Copy Project URL and Anon Key

2. **Mapbox Account**
   - Sign up at https://account.mapbox.com
   - Create access token from https://account.mapbox.com/access-tokens/
   - Free tier includes 50k requests/month

3. **Google Gemini API**
   - Get API key from https://makersuite.google.com/app/apikey
   - Free tier: 60 requests/minute

4. **Vercel Account**
   - Sign up at https://vercel.com
   - Connect GitHub repository

## Setup Steps

### 1. Database Setup
\`\`\`bash
# Run the SQL schema in Supabase SQL Editor
# File: scripts/setup-database.sql

# Then seed demo data (optional)
npm run seed
\`\`\`

### 2. Environment Variables

Create `.env.local`:
\`\`\`
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_key
\`\`\`

### 3. Deploy to Vercel

\`\`\`bash
# Connect GitHub repo and push
git push origin main

# Set environment variables in Vercel dashboard
# Project Settings → Environment Variables
\`\`\`

## Testing Features

1. **Calculator**: `/calculator` - Test waste calculations
2. **Dashboard**: `/dashboard` - View stats and activity
3. **Maps**: `/maps` - Find community locations
4. **Coach**: `/coach` - Chat with AI coach
5. **Events**: `/events` - Create food donation requests

## Troubleshooting

### Mapbox Token Issues
- Check token is valid and has "gl:read" scope
- Verify NEXT_PUBLIC_MAPBOX_TOKEN is set

### Supabase Connection
- Check URL and Anon Key are correct
- Enable RLS policies in SQL Editor

### Gemini API Errors
- Verify GOOGLE_GENERATIVE_AI_API_KEY is set
- Check rate limits (60 requests/minute free tier)

## Database Backup

\`\`\`bash
# Export database from Supabase dashboard
# Settings → Database → Backups
\`\`\`

## Performance Tips

1. Enable Vercel Analytics
2. Use Vercel KV for session caching
3. Implement incremental static regeneration for maps
4. Cache Gemini responses in Supabase

## Support

For issues:
1. Check .env variables
2. Review Vercel logs
3. Check Supabase dashboard for errors
4. Test APIs with curl or Postman
