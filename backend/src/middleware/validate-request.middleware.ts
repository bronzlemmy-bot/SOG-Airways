
import type { RequestHandler } from "express";
import type { ZodType } from "zod";
import { ApiError } from "../utils/api-error.js";

type RequestPart = "body" | "params" | "query";

type RequestSchemas = Partial<Record<RequestPart, ZodType>>;

type ValidatedRequest = Partial<Record<RequestPart, unknown>>;

const REQUEST_PARTS: RequestPart[] = ["params", "query", "body"];

export function validateRequest(
  schemas: RequestSchemas,
): RequestHandler {
  return (req, res, next) => {
    const validated: ValidatedRequest = {};

    for (const part of REQUEST_PARTS) {
      const schema = schemas[part];

      if (!schema) {
        continue;
      }

      const result = schema.safeParse(req[part]);

      if (!result.success) {
        const details = result.error.issues.map((issue) => ({
          field: issue.path.map(String).join("."),
          message: issue.message,
        }));

        return next(
          new ApiError("Request validation failed.", 400, {
            code: "VALIDATION_ERROR",
            details,
          }),
        );
      }

      validated[part] = result.data;

      // Replace the body with its validated, parsed value.
      if (part === "body") {
        req.body = result.data;
      }
    }

    // Parsed params and query values are available here too.
    res.locals.validatedRequest = validated;
    res.locals.validated = validated;

    next();
  };
}
