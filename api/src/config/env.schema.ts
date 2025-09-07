import { z } from 'zod';

export const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().default(3000),
  MONGO_URI: z.url().or(z.string().regex(/^mongodb/)),
  JWT_SECRET: z.string().min(16),
  JWT_TTL: z.coerce.number().default(3600),
  MAX_DELTA_SCORE: z.coerce.number().default(500),
});
export type AppEnv = z.infer<typeof envSchema>;
