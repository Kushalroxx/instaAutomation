#!/usr/bin/env node

console.log(`
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║        Instagram Automation - Database Setup Guide            ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝

You need to set up PostgreSQL and Redis. Here are your options:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 OPTION 1: Cloud Services (Recommended - No Installation)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🟢 PostgreSQL - Neon (Free Tier)
   1. Go to: https://neon.tech
   2. Sign up with GitHub/Google
   3. Create a new project
   4. Copy the connection string
   5. Paste in .env as DATABASE_URL

   Example:
   DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

🟢 Redis - Upstash (Free Tier)
   1. Go to: https://upstash.com
   2. Sign up with GitHub/Google
   3. Create a Redis database
   4. Copy the connection details
   5. Paste in .env

   Example:
   REDIS_HOST="usw1-xxx.upstash.io"
   REDIS_PORT=6379
   REDIS_PASSWORD="your-password-here"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 OPTION 2: Alternative Cloud Services
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PostgreSQL Alternatives:
  • Supabase: https://supabase.com (includes auth & storage)
  • Railway: https://railway.app ($5 free credit)
  • Render: https://render.com (free tier)

Redis Alternatives:
  • Redis Cloud: https://redis.com/try-free (30MB free)
  • Railway: https://railway.app (includes Redis)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 OPTION 3: Local Installation (For Development)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔵 PostgreSQL on Windows:
   1. Download: https://www.postgresql.org/download/windows/
   2. Install with default settings
   3. Remember your password
   4. Use: DATABASE_URL="postgresql://postgres:yourpassword@localhost:5432/ig_automation"

🔵 Redis on Windows:
   Option A - Memurai (Native Windows):
   1. Download: https://www.memurai.com/get-memurai
   2. Install and start service
   3. Use: REDIS_HOST="127.0.0.1"

   Option B - WSL (Windows Subsystem for Linux):
   1. Install WSL: wsl --install
   2. In WSL: sudo apt-get install redis-server
   3. Start: sudo service redis-server start
   4. Use: REDIS_HOST="127.0.0.1"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 NEXT STEPS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Choose your option above and get credentials
2. Update .env file in the root directory
3. Run: npm run db:push (in packages/db)
4. Run: npm run test:connection (in packages/db)

If test:connection succeeds, you're ready to go! ✅

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💡 RECOMMENDED FOR BEGINNERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Use Neon + Upstash (both free, no installation needed):
  ✅ No local installation
  ✅ Works on any OS
  ✅ Free tier is generous
  ✅ Production-ready
  ✅ Setup in 5 minutes

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Need help? Check the README or ask for assistance!

`)
