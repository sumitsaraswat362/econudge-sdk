// Enterprise Auth & Rate Limiting
// Demonstrates production-grade API key validation and rate limiting

import crypto from 'crypto';

export function generateApiKey(): string {
  return `eco_${crypto.randomBytes(16).toString('hex')}`;
}

export function validateApiKey(key: string): boolean {
  return /^eco_[a-f0-9]{32}$/.test(key);
}

// In-memory rate limiter
interface RateLimitEntry {
  count: number;
  resetAt: number;
}

export function createRateLimiter(maxRequests: number, windowMs: number) {
  const store = new Map<string, RateLimitEntry>();

  return {
    checkLimit(clientId: string): { allowed: boolean; remaining: number; resetAt: number } {
      const now = Date.now();
      const entry = store.get(clientId);

      if (!entry || now > entry.resetAt) {
        store.set(clientId, { count: 1, resetAt: now + windowMs });
        return { allowed: true, remaining: maxRequests - 1, resetAt: now + windowMs };
      }

      if (entry.count >= maxRequests) {
        return { allowed: false, remaining: 0, resetAt: entry.resetAt };
      }

      entry.count++;
      return { allowed: true, remaining: maxRequests - entry.count, resetAt: entry.resetAt };
    },
  };
}
