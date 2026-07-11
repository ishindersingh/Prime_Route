import { PrismaClient } from '@prisma/client'
import path from 'path';
import fs from 'fs';

const globalForPrisma = global;

let dbUrl = "file:./dev.db";

// In Vercel (production), the filesystem is read-only. 
// We must copy the bundled dev.db to /tmp so Prisma can write to it.
if (process.env.NODE_ENV === 'production') {
  const tmpDbPath = '/tmp/dev.db';
  const bundledDbPath = path.join(process.cwd(), 'prisma', 'dev.db');
  
  // If the writable db doesn't exist in /tmp, copy it from the bundled one
  if (!fs.existsSync(tmpDbPath)) {
    try {
      if (fs.existsSync(bundledDbPath)) {
        fs.copyFileSync(bundledDbPath, tmpDbPath);
      } else {
        // Fallback: create empty file (Prisma will fail if schema is needed but it prevents crash on missing file)
        fs.writeFileSync(tmpDbPath, '');
      }
    } catch (e) {
      console.error("Failed to copy SQLite DB to /tmp", e);
    }
  }
  dbUrl = "file:/tmp/dev.db";
}

export const prisma = globalForPrisma.prisma || new PrismaClient({
  datasources: {
    db: {
      url: dbUrl
    }
  }
});

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

