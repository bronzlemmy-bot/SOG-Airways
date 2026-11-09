process.env.NODE_ENV = "test";
process.env.MONGODB_URI =
  "mongodb://sog-airways-test-disabled.invalid:27017/sogairway_test";
process.env.MONGODB_DB_NAME = "sogairway_test";
process.env.JWT_SECRET = "test-only-jwt-signing-secret";
process.env.FRONTEND_URL = "http://localhost:3000";