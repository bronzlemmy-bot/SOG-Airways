
import { env } from "./config/env.js";
import {
  connectDatabase,
  disconnectDatabase,
} from "./database/mongoose.js";
import { app } from "./app.js";

async function startServer(): Promise<void> {
  // Connect to MongoDB before accepting API requests.
  await connectDatabase();

  const server = app.listen(env.PORT, () => {
    console.log(`SOG Airways API running at http://localhost:${env.PORT}`);
    console.log(
      `Health endpoint: http://localhost:${env.PORT}/api/v1/health`,
    );
  });

  let isShuttingDown = false;

  const shutdown = (signal: string): void => {
    if (isShuttingDown) return;

    isShuttingDown = true;
    console.log(`${signal} received. Shutting down SOG Airways API...`);

    server.close((error) => {
      if (error) {
        console.error("Failed to close the HTTP server:", error);
        process.exitCode = 1;
      }

      void disconnectDatabase()
        .then(() => {
          console.log("SOG Airways API shutdown complete.");
        })
        .catch((disconnectError: unknown) => {
          console.error("Failed to disconnect MongoDB:", disconnectError);
          process.exitCode = 1;
        });
    });
  };

  process.once("SIGINT", () => shutdown("SIGINT"));
  process.once("SIGTERM", () => shutdown("SIGTERM"));
}

void startServer().catch(async (error: unknown) => {
  console.error("Failed to start SOG Airways API:", error);

  try {
    await disconnectDatabase();
  } catch (disconnectError: unknown) {
    console.error("MongoDB cleanup failed:", disconnectError);
  }

  process.exitCode = 1;
});
