# Quick Start Guide - Instagram Automation

## ⚠️ IMPORTANT: Current Limitations

**You CANNOT run the full app yet** because:
- ❌ No database configured
- ❌ No Redis installed
- ❌ No Meta/Instagram API credentials
- ❌ No UI pages built
- ❌ No automation logic implemented

## ✅ What You CAN Do Right Now

### 1. Test Individual Apps (They Won't Do Much)

#### Start the Web App (Next.js)
```bash
cd apps/web
pnpm dev
```
- Opens at: http://localhost:3000
- You'll see: Next.js welcome page
- **Note**: No Instagram features yet, just default Next.js page

#### Start the Webhook Server
```bash
cd apps/webhook
pnpm dev
```
- Runs on: http://localhost:4000
- Endpoints available:
  - GET /webhook (for Meta verification)
  - POST /webhook (for receiving events)
- **Note**: Won't process events without queue

#### Start the Worker (Will Crash Without Redis)
```bash
cd apps/worker
pnpm dev
```
- **Expected**: Will crash with Redis connection error
- **Why**: Needs Redis running on localhost:6379

---

## 🚀 To Actually Build the Instagram Automation

### Phase 1: Install Dependencies (1-2 hours)

#### 1. Install Redis
**Windows:**
```bash
# Option 1: Use WSL (Recommended)
wsl --install
# Then in WSL:
sudo apt update
sudo apt install redis-server
sudo service redis-server start

# Option 2: Use Memurai (Windows Redis alternative)
# Download from: https://www.memurai.com/
```

**Mac:**
```bash
brew install redis
brew services start redis
```

**Verify Redis:**
```bash
redis-cli ping
# Should return: PONG
```

#### 2. Install PostgreSQL
**Windows:**
- Download from: https://www.postgresql.org/download/windows/
- Or use Docker: `docker run -p 5432:5432 -e POSTGRES_PASSWORD=postgres postgres`

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

**Verify PostgreSQL:**
```bash
psql --version
```

### Phase 2: Set Up Database Package (2-3 hours)

#### 1. Navigate to packages/db
```bash
cd packages/db
pnpm init
```

#### 2. Install Prisma
```bash
pnpm add @prisma/client
pnpm add -D prisma
```

#### 3. Initialize Prisma
```bash
npx prisma init
```

#### 4. Create Schema (packages/db/prisma/schema.prisma)
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  accounts  InstagramAccount[]
  rules     AutomationRule[]
}

model InstagramAccount {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  username    String
  accessToken String
  createdAt   DateTime @default(now())
}

model AutomationRule {
  id          String   @id @default(cuid())
  userId      String
  user        User     @relation(fields: [userId], references: [id])
  name        String
  trigger     String   // "new_message", "keyword", etc.
  action      String   // "auto_reply", "tag", etc.
  enabled     Boolean  @default(true)
  createdAt   DateTime @default(now())
}
```

#### 5. Create .env file
```bash
# packages/db/.env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/instaautomation"
```

#### 6. Run Migration
```bash
npx prisma migrate dev --name init
```

### Phase 3: Set Up Meta/Instagram SDK (3-4 hours)

#### 1. Create Meta Developer Account
- Go to: https://developers.facebook.com/
- Create new app
- Add Instagram product
- Get credentials

#### 2. Set Up meta-sdk Package
```bash
cd packages/meta-sdk
pnpm init
pnpm add axios dotenv
pnpm add -D typescript @types/node
```

#### 3. Create SDK (packages/meta-sdk/src/index.ts)
```typescript
import axios from 'axios';

export class MetaSDK {
  private accessToken: string;
  private apiVersion = 'v18.0';
  
  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }
  
  async sendMessage(recipientId: string, message: string) {
    const url = `https://graph.facebook.com/${this.apiVersion}/me/messages`;
    return axios.post(url, {
      recipient: { id: recipientId },
      message: { text: message }
    }, {
      params: { access_token: this.accessToken }
    });
  }
  
  async getMessages(userId: string) {
    const url = `https://graph.facebook.com/${this.apiVersion}/${userId}/conversations`;
    return axios.get(url, {
      params: { access_token: this.accessToken }
    });
  }
}
```

### Phase 4: Build the Web UI (1-2 weeks)

#### 1. Create Pages in apps/web/app/
```
app/
├── (auth)/
│   ├── login/
│   │   └── page.tsx
│   └── signup/
│       └── page.tsx
├── dashboard/
│   ├── page.tsx
│   ├── accounts/
│   │   └── page.tsx
│   ├── rules/
│   │   └── page.tsx
│   └── analytics/
│       └── page.tsx
└── page.tsx (landing page)
```

#### 2. Install UI Dependencies
```bash
cd apps/web
pnpm add next-auth @prisma/client
pnpm add lucide-react class-variance-authority clsx tailwind-merge
```

### Phase 5: Connect Everything (3-5 days)

#### 1. Update Webhook to Use Queue
```typescript
// apps/webhook/src/index.ts
import { Queue } from 'bullmq';

const queue = new Queue('inbound-events', {
  connection: {
    host: process.env.REDIS_HOST || '127.0.0.1',
    port: +(process.env.REDIS_PORT || 6379)
  }
});

app.post("/webhook", async (req, res) => {
  console.log("webhook event", JSON.stringify(req.body).slice(0,200));
  
  // Push to queue
  await queue.add('process-message', {
    event: req.body
  });
  
  res.sendStatus(200);
});
```

#### 2. Update Worker with Logic
```typescript
// apps/worker/src/worker.ts
import { Worker } from "bullmq";
import { MetaSDK } from "@repo/meta-sdk";
import { PrismaClient } from "@repo/db";

const prisma = new PrismaClient();
const metaSDK = new MetaSDK(process.env.META_ACCESS_TOKEN!);

const worker = new Worker("inbound-events", async job => {
  const { event } = job.data;
  
  // Get user's automation rules
  const rules = await prisma.automationRule.findMany({
    where: { enabled: true }
  });
  
  // Process based on rules
  for (const rule of rules) {
    if (rule.trigger === 'new_message') {
      await metaSDK.sendMessage(
        event.sender.id,
        "Thanks for your message! We'll get back to you soon."
      );
    }
  }
}, { connection });
```

---

## 📋 Complete Checklist

### Infrastructure
- [ ] Redis installed and running
- [ ] PostgreSQL installed and running
- [ ] Environment variables configured

### Packages
- [ ] packages/db - Prisma setup with schema
- [ ] packages/meta-sdk - Meta API wrapper
- [ ] packages/ai - AI integration (optional)
- [ ] packages/shared - Shared utilities

### Apps
- [ ] apps/web - UI pages and components
- [ ] apps/webhook - Queue integration
- [ ] apps/worker - Automation logic

### Features
- [ ] User authentication
- [ ] Instagram account connection
- [ ] Automation rules creation
- [ ] Message processing
- [ ] Analytics dashboard

### Testing
- [ ] Unit tests
- [ ] Integration tests
- [ ] End-to-end tests

### Deployment
- [ ] Environment setup
- [ ] CI/CD pipeline
- [ ] Production deployment

---

## 🎯 Recommended Next Step

**Start with the database package** because everything else depends on it:

```bash
cd packages/db
pnpm init
pnpm add @prisma/client
pnpm add -D prisma typescript @types/node
npx prisma init
```

Then create the schema and run migrations.

---

## 💡 Need Help?

1. **Database Issues**: Check PostgreSQL is running: `pg_isready`
2. **Redis Issues**: Check Redis is running: `redis-cli ping`
3. **TypeScript Errors**: Make sure all packages have tsconfig.json
4. **Meta API**: Read docs at https://developers.facebook.com/docs/instagram-api

---

**Remember**: You're building a complex system. Take it step by step! 🚀
