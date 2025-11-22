# TinyLink Deployment Guide

This guide will walk you through deploying TinyLink to Vercel with a Neon Postgres database.

## Prerequisites

1. A GitHub account
2. A Vercel account (sign up at https://vercel.com)
3. A Neon account (sign up at https://neon.tech)

## Step 1: Set Up Neon Postgres Database

1. Go to https://neon.tech and sign in/sign up
2. Click "Create a project"
3. Choose a name for your project (e.g., "tinylink-db")
4. Select your preferred region
5. Click "Create project"
6. Once created, you'll see a connection string like:
   ```
   postgresql://user:password@ep-xxx-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
7. Copy this connection string - you'll need it later
8. In the Neon dashboard, go to the SQL Editor
9. Copy the contents of `lib/schema.sql` from your project
10. Paste and run it in the SQL Editor to create the tables
11. Verify the `links` table was created successfully

## Step 2: Push Code to GitHub

1. Initialize git repository (if not already done):
   ```bash
   cd tinylink
   git init
   git add .
   git commit -m "Initial commit: TinyLink URL shortener"
   ```

2. Create a new repository on GitHub:
   - Go to https://github.com/new
   - Name it "tinylink" (or your preferred name)
   - Don't initialize with README (we already have code)
   - Click "Create repository"

3. Push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/tinylink.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Deploy to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New..." → "Project"
3. Import your GitHub repository (tinylink)
4. Configure your project:
   - **Framework Preset**: Next.js (should auto-detect)
   - **Root Directory**: ./
   - **Build Command**: `npm run build`
   - **Output Directory**: .next

5. Add Environment Variables:
   Click "Environment Variables" and add the following:

   **DATABASE_URL**
   - Value: Your Neon connection string from Step 1
   - Example: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require`

   **NEXT_PUBLIC_BASE_URL**
   - Value: Leave empty for now (we'll update after deployment)
   - Or use your custom domain if you have one

6. Click "Deploy"
7. Wait for the deployment to complete (usually 2-3 minutes)

## Step 4: Update Base URL

1. Once deployed, Vercel will give you a URL like: `https://tinylink-xxx.vercel.app`
2. Go to your Vercel project settings → Environment Variables
3. Update `NEXT_PUBLIC_BASE_URL` to your deployment URL:
   ```
   https://tinylink-xxx.vercel.app
   ```
4. Redeploy the project:
   - Go to "Deployments" tab
   - Click the three dots on the latest deployment
   - Click "Redeploy"

## Step 5: Test Your Deployment

1. Visit your deployed URL: `https://tinylink-xxx.vercel.app`
2. Test the health check: `https://tinylink-xxx.vercel.app/healthz`
   - Should return: `{"ok":true,"version":"1.0",...}`
3. Create a test link:
   - Click "+ Add New Link"
   - Enter a URL (e.g., https://google.com)
   - Optionally add a custom code
   - Click "Create Short Link"
4. Verify the short link works:
   - Copy the short link
   - Open in a new tab
   - Should redirect to the target URL
5. Check statistics:
   - Click "Stats" next to your link
   - Verify click count increased
6. Test deletion:
   - Click "Delete" on a link
   - Confirm the link is removed
   - Verify the short code returns 404

## Step 6: Custom Domain (Optional)

1. In Vercel project settings, go to "Domains"
2. Add your custom domain
3. Follow Vercel's instructions to configure DNS
4. Update `NEXT_PUBLIC_BASE_URL` environment variable to your custom domain
5. Redeploy the project

## Environment Variables Reference

### Required Variables

- `DATABASE_URL`: PostgreSQL connection string from Neon
- `NEXT_PUBLIC_BASE_URL`: Your application's base URL

### Example `.env.local` for Local Development

```bash
DATABASE_URL=postgresql://user:password@localhost:5432/tinylink
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

### Example Production Environment Variables

```bash
DATABASE_URL=postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
NEXT_PUBLIC_BASE_URL=https://tinylink-xxx.vercel.app
```

## Troubleshooting

### Database Connection Issues

**Problem**: "Failed to connect to database"
**Solution**:
- Verify your DATABASE_URL is correct
- Ensure Neon project is active
- Check that SSL mode is enabled in the connection string

### Build Failures

**Problem**: Build fails on Vercel
**Solution**:
- Check the build logs for specific errors
- Ensure all dependencies are in package.json
- Verify TypeScript errors locally: `npm run build`

### 404 on Short Links

**Problem**: Short links return 404
**Solution**:
- Verify the link exists in the database
- Check that the redirect handler is working: `/[code]/page.tsx`
- Ensure database tables were created correctly

### Environment Variable Issues

**Problem**: NEXT_PUBLIC_BASE_URL not working
**Solution**:
- Redeploy after updating environment variables
- Clear browser cache
- Verify the variable is set in Vercel dashboard

## Monitoring and Maintenance

1. **Check Health Endpoint**:
   - Regularly visit `/healthz` to ensure the app is running

2. **Monitor Database Usage**:
   - Check Neon dashboard for database size and usage
   - Free tier has limits on storage and compute time

3. **View Logs**:
   - In Vercel dashboard, go to "Deployments" → Select deployment → "Logs"
   - Monitor for errors or issues

4. **Analytics**:
   - Consider adding analytics to track usage
   - Monitor API endpoint performance

## Scaling Considerations

1. **Database**: Neon free tier is limited. For production, consider upgrading.
2. **Vercel**: Free tier should handle most use cases. Monitor usage.
3. **Rate Limiting**: Consider adding rate limiting for production use.
4. **Caching**: Add caching for frequently accessed links.

## Security Best Practices

1. Never commit `.env.local` or `.env` files
2. Rotate database credentials periodically
3. Use Vercel environment variable encryption
4. Monitor for abuse (spam links, malicious URLs)
5. Consider adding authentication for link creation

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review Neon database logs
3. Verify environment variables are set correctly
4. Test locally first: `npm run dev`

---

**Congratulations!** Your TinyLink URL shortener is now deployed and ready to use.
