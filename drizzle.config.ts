import type { Config } from 'drizzle-kit';
import path from 'path';

export default {
  schema: './src/lib/db/schema.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: path.join(process.cwd(), 'data', 'blog.db'),
  },
} satisfies Config;
