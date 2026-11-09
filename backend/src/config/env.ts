
import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),

  PORT: z.coerce
    .number()
    .int()
    .min(1)
    .max(65535)
    .default(5000),

  FRONTEND_URL: z
    .string()
    .url()
    .default("http://localhost:3000"),

  MONGODB_URI: z
    .string()
    .trim()
    .min(1, "MONGODB_URI is required"),

  MONGODB_DB_NAME: z
    .string()
    .trim()
    .min(1, "MONGODB_DB_NAME cannot be empty")
    .optional(),

  JWT_SECRET: z
    .string()
    .min(8, "JWT_SECRET must contain at least 8 characters")
    .optional(),

  RESEND_API_KEY: z.string().trim().min(1).optional(),

  EMAIL_FROM: z.string().trim().min(1).optional(),
}).superRefine((config, context) => {
  if (Boolean(config.RESEND_API_KEY) !== Boolean(config.EMAIL_FROM)) {
    context.addIssue({
      code: "custom",
      path: ["EMAIL_FROM"],
      message: "RESEND_API_KEY and EMAIL_FROM must be configured together.",
    });
  }

  if (
    config.NODE_ENV === "test" &&
    config.MONGODB_DB_NAME &&
    !/test/i.test(config.MONGODB_DB_NAME)
  ) {
    context.addIssue({
      code: "custom",
      path: ["MONGODB_DB_NAME"],
      message: "Tests must use a database name containing 'test'.",
    });
  }

  if (
    config.NODE_ENV === "production" &&
    (!config.JWT_SECRET || config.JWT_SECRET.length < 32)
  ) {
    context.addIssue({
      code: "custom",
      path: ["JWT_SECRET"],
      message: "Production JWT_SECRET must contain at least 32 characters.",
    });
  }
});

const result = envSchema.safeParse(process.env);

if (!result.success) {
  const errors = result.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join("\n");

  throw new Error(`Invalid environment configuration:\n${errors}`);
}

export const env = result.data;
