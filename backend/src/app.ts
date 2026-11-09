
import { apiRateLimiter } from "./middleware/rate-limit.middleware.js";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { env } from "./config/index.js";
import apiRouter from "./routes/index.js";
import { notFoundHandler } from "./middleware/not-found.middleware.js";
import { errorHandler } from "./middleware/error-handler.middleware.js";

export const app = express();

// Security and HTTP configuration
app.disable("x-powered-by");
app.use(helmet());

app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);

// Request parsing
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true, limit: "1mb" }));
app.use(cookieParser());


 // Apply rate limiting to API requests before routing.
app.use("/api/v1", apiRateLimiter);

// Versioned API routes
app.use("/api/v1", apiRouter);




// These must come after all registered routes.
app.use(notFoundHandler);
app.use(errorHandler);
