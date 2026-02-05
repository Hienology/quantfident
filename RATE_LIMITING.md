# 🚦 Rate Limiting Implementation

## Overview

Rate limiting has been implemented across all authentication and blog posting endpoints to prevent abuse and ensure fair resource usage.

## Implementation Details

### Rate Limiter Architecture

**Location**: `src/lib/middleware/rate-limit.ts`

Uses an in-memory **sliding window counter** algorithm to track requests:
- Stores request counts per identifier (IP address or user ID + IP)
- Automatically expires old entries
- Returns remaining requests and retry-after time

### Rate Limit Configurations

#### 1. Authentication Rate Limiting (`authLimiter`)
- **Window**: 15 minutes
- **Max Requests**: 10 per IP address
- **Applied to**:
  - `POST /api/auth/login`
  - `POST /api/auth/register`
- **Purpose**: Prevent brute force attacks and account enumeration

#### 2. Blog Operations Rate Limiting (`blogLimiter`)
- **Window**: 1 minute
- **Max Requests**: 5 per admin user
- **Applied to**:
  - `POST /api/blog` (create post)
  - `PUT /api/blog/[id]` (update post)
  - `DELETE /api/blog/[id]` (delete post)
- **Purpose**: Prevent spam posting and accidental mass operations

## Protected Endpoints

### Authentication Endpoints
```typescript
// POST /api/auth/login
// Rate limited per IP: 10 requests / 15 minutes
// Returns 429 when exceeded

// POST /api/auth/register
// Rate limited per IP: 10 requests / 15 minutes
// Returns 429 when exceeded
```

### Blog Management Endpoints (Admin Only)
```typescript
// POST /api/blog
// Rate limited per admin user: 5 requests / 1 minute
// Returns 429 when exceeded

// PUT /api/blog/[id]
// Rate limited per admin user: 5 requests / 1 minute
// Returns 429 when exceeded

// DELETE /api/blog/[id]
// Rate limited per admin user: 5 requests / 1 minute
// Returns 429 when exceeded
```

## Response Format

### Success Response
```json
{
  "message": "Success"
}
```

**Headers**:
- `X-RateLimit-Remaining`: Number of requests remaining in current window

### Rate Limited Response (429)
```json
{
  "error": "Quá nhiều yêu cầu. Vui lòng thử lại sau 15 phút.",
  "retryAfter": 900
}
```

**Headers**:
- `Retry-After`: Seconds until rate limit resets
- `X-RateLimit-Remaining`: 0

## Identifier Strategy

### IP-Based (Authentication)
- Uses client IP from `x-forwarded-for` or `x-real-ip` headers
- Fallback to "unknown" if headers not available
- Prevents single IP from overwhelming authentication endpoints

### User-Based (Blog Operations)
- Combines user ID + IP address for unique identifier
- Tracks admin activity per user account
- Prevents a single admin from executing too many operations

## Benefits

✅ **Security**: Prevents brute force attacks on login/register endpoints  
✅ **Stability**: Prevents accidental mass operations on blog posts  
✅ **Fair Usage**: Ensures no single user can monopolize resources  
✅ **Compliance**: Follows API best practices (RFC 6585)  
✅ **Transparent**: Clear error messages and retry-after headers

## Production Considerations

### Scaling with Distributed Systems

The current implementation uses **in-memory storage**, which works for single-server deployments. For distributed/multi-server deployments (Vercel serverless, multiple Kubernetes pods, etc.), consider:

1. **Redis-based rate limiting**:
   ```bash
   npm install @upstash/ratelimit @upstash/redis
   ```

2. **Replace in-memory store** with Redis:
   ```typescript
   import { Ratelimit } from "@upstash/ratelimit";
   import { Redis } from "@upstash/redis";

   const redis = Redis.fromEnv();
   export const authLimiter = new Ratelimit({
     redis,
     limiter: Ratelimit.slidingWindow(10, "15 m"),
   });
   ```

3. **Environment Variables**:
   ```env
   UPSTASH_REDIS_REST_URL=your-redis-url
   UPSTASH_REDIS_REST_TOKEN=your-redis-token
   ```

### Monitoring

Track rate limit violations:
```typescript
if (!rateLimitResult.allowed) {
  console.warn(`Rate limit exceeded for ${identifier}`);
  // Send to monitoring service (e.g., Sentry, DataDog)
}
```

### Adjusting Limits

Edit limits in `src/lib/middleware/rate-limit.ts`:

```typescript
// Auth: 20 requests per 30 minutes
export const authLimiter = new RateLimiter(30 * 60 * 1000, 20);

// Blog: 10 requests per 2 minutes
export const blogLimiter = new RateLimiter(2 * 60 * 1000, 10);
```

## Testing Rate Limits

### Manual Testing

**Test authentication rate limit**:
```bash
# Make 11 login attempts quickly
for i in {1..11}; do
  curl -X POST http://localhost:3000/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}' \
    && echo ""
done
```

Expected: First 10 succeed/fail with 401, 11th returns 429

**Test blog rate limit**:
```bash
# Make 6 post creation attempts with admin token
TOKEN="your-admin-token"
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/blog \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d '{"title":"Test","content":"Test"}' \
    && echo ""
done
```

Expected: First 5 succeed, 6th returns 429

### Unit Testing

```typescript
import { authLimiter, getClientIdentifier } from '@/lib/middleware/rate-limit';

describe('Rate Limiter', () => {
  it('should allow requests under limit', () => {
    const result = authLimiter.check('test-ip');
    expect(result.allowed).toBe(true);
  });

  it('should block requests over limit', () => {
    for (let i = 0; i < 10; i++) {
      authLimiter.check('test-ip');
    }
    const result = authLimiter.check('test-ip');
    expect(result.allowed).toBe(false);
  });
});
```

## Database-Level Protection

While rate limiting is implemented at the API level, database-level protection is handled through:

1. **Prisma Client Pooling**: Connection pool size limited (default 10-20)
2. **Query Optimization**: All queries use indexed fields
3. **Transaction Safety**: Critical operations wrapped in transactions
4. **Graceful Degradation**: Database errors don't crash the app

For additional database protection, consider:
- PostgreSQL connection limits per user
- Query execution time limits
- Read replicas for heavy traffic

## Summary

✅ **Authentication endpoints**: Rate limited at 10 requests/15min per IP  
✅ **Blog posting endpoints**: Rate limited at 5 requests/min per admin user  
✅ **Two-layer protection**: IP-based for auth, User+IP for admin operations  
✅ **Production ready**: Includes headers, error messages, and retry logic  
✅ **Scalable**: Can upgrade to Redis for multi-server deployments
