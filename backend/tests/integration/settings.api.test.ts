import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import type { Server } from "node:http";
import jwt from "jsonwebtoken";
import { app } from "../../src/app.js";
import { settingService } from "../../src/modules/settings/services/setting.service.js";

const adminToken = jwt.sign(
  { role: "admin" },
  "test-only-jwt-signing-secret",
  { subject: "68a111111111111111111111", expiresIn: "5m" },
);
let server: Server;
let baseUrl: string;

before(async () => {
  server = app.listen(0, "127.0.0.1");
  await new Promise<void>((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });
  const address = server.address();
  assert.ok(address && typeof address !== "string");
  baseUrl = `http://127.0.0.1:${address.port}`;
});
after(async () => {
  if (server.listening) await new Promise<void>((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test("public settings endpoint delegates category filtering and returns public settings", async (t) => {
  const getPublicSettings = t.mock.method(settingService, "getPublicSettings", async () => ({ "site.name": "SOG Airways" }));
  const response = await fetch(`${baseUrl}/api/v1/settings/public?category=general`);
  assert.equal(response.status, 200);
  assert.deepEqual(getPublicSettings.mock.calls[0]?.arguments, ["general"]);
  assert.deepEqual((await response.json()).data, { "site.name": "SOG Airways" });
});

test("private settings routes still require authentication", async () => {
  const response = await fetch(`${baseUrl}/api/v1/settings`);
  assert.equal(response.status, 401);
});

test("authenticated settings mutations use middleware identity", async (t) => {
  const create = t.mock.method(
    settingService,
    "createSetting",
    async (input, createdBy) => {
      assert.equal(createdBy, "68a111111111111111111111");
      return { ...input, id: "68a222222222222222222222" };
    },
  );
  const response = await fetch(`${baseUrl}/api/v1/settings`, {
    method: "POST",
    headers: {
      authorization: `Bearer ${adminToken}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      key: "test.setting",
      value: "enabled",
      description: "Test-only setting",
    }),
  });

  assert.equal(response.status, 201);
  assert.equal(create.mock.callCount(), 1);
});
