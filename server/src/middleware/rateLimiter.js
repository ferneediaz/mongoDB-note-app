import { rateLimitStore, rateLimitConfig } from "../config/rateLimitConfig.js";

const rateLimiter = async (req, res, next) => {
  try {
    // Get client IP address with debugging
    const ip = req.ip;
    const connectionRemote = req.connection.remoteAddress;
    const socketRemote = req.socket.remoteAddress;
    const connectionSocketRemote = req.connection.socket?.remoteAddress;
    

    //fallback chain for different environments
    const identifier = ip || connectionRemote || socketRemote || connectionSocketRemote || 'unknown';
    //console.log('Final identifier:', identifier);
    
    const now = Date.now();
    
    // Get existing timestamps for this IP
    const timestamps = rateLimitStore.get(identifier) || [];
    
    // Filter out timestamps older than the window
    const validTimestamps = timestamps.filter(timestamp => now - timestamp < rateLimitConfig.windowMs);
    
    // Check if limit exceeded
    if (validTimestamps.length >= rateLimitConfig.maxRequests) {
      return res.status(429).json({
        message: "Too many requests, please try again later",
      });
    }
    
    // Add current timestamp
    validTimestamps.push(now);
    rateLimitStore.set(identifier, validTimestamps);
    
    next();
  } catch (error) {
    console.log("Rate limit error", error);
    next(error);
  }
};

export default rateLimiter;