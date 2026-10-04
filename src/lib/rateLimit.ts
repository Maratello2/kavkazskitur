interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

// Periodically purge stale IP entries
if (typeof setInterval !== 'undefined') {
  const cleanupTimer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of rateLimitMap.entries()) {
      if (record.resetAt <= now) {
        rateLimitMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  
  if (cleanupTimer.unref) {
    cleanupTimer.unref();
  }
}

/**
 * In-memory sliding window rate limiter (Zero-lag, 0 dependencies)
 * @param identifier Unique IP or token identifier
 * @param limit Maximum allowed requests within the time window
 * @param windowSeconds Window length in seconds
 */
export function checkRateLimit(
  identifier: string,
  limit: number,
  windowSeconds: number
): { success: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;
  const record = rateLimitMap.get(identifier);

  if (!record || record.resetAt <= now) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetAt: now + windowMs,
    });
    return { success: true, remaining: limit - 1, resetInSeconds: windowSeconds };
  }

  if (record.count >= limit) {
    const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { success: false, remaining: 0, resetInSeconds };
  }

  record.count += 1;
  const resetInSeconds = Math.ceil((record.resetAt - now) / 1000);
  return { success: true, remaining: limit - record.count, resetInSeconds };
}
