import assert from "node:assert/strict";
import { test } from "node:test";
import { settingRepository } from "../../src/modules/settings/repositories/setting.repository.js";
import { SettingService } from "../../src/modules/settings/services/setting.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const service = new SettingService();
const settingId = "68a222222222222222222222";
const actorId = "68a111111111111111111111";
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("createSetting normalizes keys and rejects duplicates", async (t) => {
  const find = t.mock.method(settingRepository, "findByKey", async () => null);
  const create = t.mock.method(settingRepository, "create", async (value) => value);
  const result = await service.createSetting({ key: " Site.Name ", value: "SOG" }, actorId);
  assert.equal(result.key, "site.name");
  assert.equal(create.mock.calls[0]?.arguments[0].updatedBy?.toString(), actorId);
  find.mock.restore();
  t.mock.method(settingRepository, "findByKey", async () => ({ key: "site.name" } as never));
  await assert.rejects(service.createSetting({ key: "site.name", value: "SOG" }), hasError(409, "SETTING_ALREADY_EXISTS"));
  assert.equal(create.mock.callCount(), 1);
});

test("protected settings can only be changed or deleted by super admins", async (t) => {
  const get = t.mock.method(settingRepository, "findById", async () => ({
    key: "jwt.secret",
    category: "security",
  } as never));
  const update = t.mock.method(settingRepository, "updateById", async () => ({ key: "jwt.secret" } as never));
  const remove = t.mock.method(settingRepository, "deleteById", async () => ({ key: "jwt.secret" } as never));
  await assert.rejects(service.updateSetting(settingId, { value: "new" }, actorId),
    hasError(403, "PROTECTED_SETTING"));
  await assert.rejects(service.deleteSetting(settingId),
    hasError(403, "PROTECTED_SETTING"));
  assert.equal(update.mock.callCount(), 0);
  assert.equal(remove.mock.callCount(), 0);
  get.mock.restore();
  t.mock.method(settingRepository, "findById", async () => ({ key: "jwt.secret", category: "security" } as never));
  await service.updateSetting(settingId, { value: "new" }, actorId, true);
  assert.equal(update.mock.callCount(), 1);
});

test("public settings query returns only explicitly public values", async (t) => {
  const find = t.mock.method(settingRepository, "findMany", async (filters) => {
    assert.equal(filters.isPublic, true);
    return [
      { key: "site.name", value: "SOG Airways", isPublic: true },
      { key: "internal.flag", value: true, isPublic: false },
    ] as never;
  });
  const result = await service.getPublicSettings("general");
  assert.deepEqual(result, { "site.name": "SOG Airways", "internal.flag": true });
  assert.equal(find.mock.calls[0]?.arguments[0].category, "general");
});
