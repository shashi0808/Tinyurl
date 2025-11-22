# TinyLink - URL Shortener

A clean, modern URL shortener similar to bit.ly, built with Next.js 14, TypeScript, and Tailwind CSS.

## Features

- **URL Shortening**: Convert long URLs into short, shareable links
- **Custom Short Codes**: Choose your own custom codes (6-8 alphanumeric characters)
- **Click Tracking**: Track total clicks and last clicked time for each link
- **Statistics**: View detailed stats for individual links
- **Link Management**: Easy dashboard to add, delete, and search links
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Database**: PostgreSQL (Neon)
- **Hosting**: Vercel

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- PostgreSQL database (Neon recommended)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd tinylink
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local`
   - Update `DATABASE_URL` with your Neon Postgres connection string
   - Update `NEXT_PUBLIC_BASE_URL` with your application URL

4. Initialize the database:
   - Run the SQL schema in `lib/schema.sql` on your Neon database

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Endpoints

- `POST /api/links` - Create a new short link
- `GET /api/links` - List all links
- `GET /api/links/[code]` - Get stats for a specific link
- `DELETE /api/links/[code]` - Delete a link
- `GET /healthz` - Health check endpoint

## Pages

- `/` - Dashboard with links table
- `/code/[code]` - Stats page for individual link
- `/[code]` - Redirect to original URL

## License

MIT
