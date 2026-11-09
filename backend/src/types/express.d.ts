
export {};

declare global {
  namespace Express {
    interface Locals {
      authenticatedUser?: {
        id: string;
        role?: string;
        email?: string;
      };

      validatedRequest?: Partial<
        Record<"body" | "params" | "query", unknown>
      >;
    }
  }
}
