# 🎬 YouTube Video Staging Dashboard

Web application для управління pipeline створення відео для YouTube.

## 📋 Features

- **Pipeline Tracker** - Відстежуйте статус: Idea → Script → Voiceover → Video → Thumbnail → Ready → Uploaded
- **3 Workflow Types** - НАПІВ-АВТО, FULL-AUTO, EMPIRE MODE
- **Content Storage** - Зберігайте скрипти, озвучку, відео, thumbnails
- **Dashboard** - Огляд pipeline з статистикою
- **Authentication** - Google OAuth через Supabase

## 🏗️ Tech Stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend:** Supabase (PostgreSQL, Storage, Auth)
- **Hosting:** Vercel (ready to deploy)

## 🚀 Setup Instructions

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and create a new project
2. In SQL Editor, run the schema from `supabase-schema.sql`
3. Go to Storage and create 3 buckets:
   - `videos` (public or auth)
   - `voiceovers` (public or auth)
   - `thumbnails` (public or auth)
4. Set up Google OAuth:
   - Go to Authentication → Providers → Google
   - Enable Google provider
   - Add your credentials (Client ID & Secret)

### 2. Configure Environment Variables

Copy `.env.local` and fill in your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Get these from Supabase Dashboard → Settings → API

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 5. Deploy to Vercel

```bash
npx vercel
```

Add the same environment variables in Vercel dashboard.

## 📂 Project Structure

```
├── app/
│   ├── page.tsx              # Dashboard
│   ├── login/page.tsx        # Login page
│   ├── videos/
│   │   ├── page.tsx          # Video list
│   │   ├── new/page.tsx      # Create video
│   │   └── [id]/page.tsx     # Edit video (TODO)
│   └── auth/
│       ├── callback/         # OAuth callback
│       └── signout/          # Sign out route
├── lib/
│   ├── supabase/
│   │   ├── client.ts         # Browser client
│   │   └── server.ts         # Server client
│   └── utils.ts              # Utilities
├── types/
│   └── database.ts           # TypeScript types
└── supabase-schema.sql       # Database schema
```

## 🎯 Workflows

### НАПІВ-АВТО (Semi-Auto)
1. Manual script creation
2. AI voiceover generation
3. Manual video editing
4. Manual thumbnail
5. Upload to YouTube

### FULL-AUTO
1. AI script generation
2. AI voiceover
3. AI video generation
4. AI thumbnail
5. Review & approve → Upload

### EMPIRE MODE
1. Bulk idea generation (10+)
2. Batch processing (scripts → videos)
3. Scheduling uploads
4. Analytics tracking

## 🔜 Next Steps (Future Features)

- [ ] Video editor page (`/videos/[id]`)
- [ ] File upload (voiceover, video, thumbnail)
- [ ] YouTube API integration (auto-upload)
- [ ] Workflow templates page
- [ ] Analytics dashboard
- [ ] Webhook support for external tools
- [ ] Team collaboration (multi-user)

## 📝 Database Schema

See `supabase-schema.sql` for full schema.

**Tables:**
- `videos` - Video pipeline tracking
- `channels` - YouTube channels & upload settings

**Storage:**
- `videos` - MP4 files
- `voiceovers` - MP3 files
- `thumbnails` - PNG/JPG files

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Lint
npm run lint
```

## 📄 License

MIT

---

**Created by:** Nazartsio + Petrulio  
**Date:** 2026-02-11
