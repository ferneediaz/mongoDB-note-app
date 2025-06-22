// In-memory store for rate limiting
const rateLimitStore = new Map();

// Clean up old entries every minute
setInterval(() => {
  const now = Date.now();
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const filtered = timestamps.filter(timestamp => now - timestamp < 60000); // 60 seconds
    if (filtered.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, filtered);
    }
  }
}, 60000);

// Rate limiter configuration
const rateLimitConfig = {
  windowMs: 60000, // 1 minute
  maxRequests: 5,  // 5 requests per minute
};

export { rateLimitStore, rateLimitConfig };