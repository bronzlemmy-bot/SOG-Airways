import rateLimit from "express-rate-limit";

export const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 300,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "RATE_LIMIT_EXCEEDED",
        message: "Too many requests. Please try again later.",
      },
    });
  },
});

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "AUTH_RATE_LIMIT_EXCEEDED",
        message: "Too many authentication attempts. Please try again later.",
      },
    });
  },
});

export const emailVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "EMAIL_VERIFICATION_RATE_LIMIT_EXCEEDED",
        message: "Too many verification attempts. Please try again later.",
      },
    });
  },
});

export const resendVerificationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 3,
  standardHeaders: "draft-8",
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      success: false,
      error: {
        code: "VERIFICATION_RESEND_RATE_LIMIT_EXCEEDED",
        message: "Too many code requests. Please try again later.",
      },
    });
  },
});
