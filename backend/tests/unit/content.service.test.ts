import assert from "node:assert/strict";
import { test } from "node:test";
import { contentRepository } from "../../src/modules/content/repositories/content.repository.js";
import { contentService } from "../../src/modules/content/services/content.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const author = "68a111111111111111111111";
const input = {
  title: "Welcome",
  slug: "  Welcome to SOG Airways! ",
  body: "Welcome aboard.",
  author,
  tags: [" travel ", "  "],
};
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("create normalizes slug and tags and rejects an existing slug", async (t) => {
  const find = t.mock.method(contentRepository, "findBySlug", async () => null);
  const create = t.mock.method(contentRepository, "create", async (value) => value);
  const result = await contentService.create(input);
  assert.equal(result.slug, "welcome-to-sog-airways");
  assert.deepEqual(result.tags, ["travel"]);
  assert.equal(create.mock.callCount(), 1);
  find.mock.restore();
  t.mock.method(contentRepository, "findBySlug", async () => ({ _id: { toString: () => "68a222222222222222222222" } } as never));
  await assert.rejects(contentService.create(input), hasError(409, "CONTENT_SLUG_EXISTS"));
  assert.equal(create.mock.callCount(), 1);
});

test("published content cannot violate schedule or expiry rules", async () => {
  await assert.rejects(contentService.create({
    ...input,
    status: "published",
    scheduledAt: new Date(Date.now() + 60_000),
  }), hasError(400, "CONTENT_PUBLICATION_NOT_DUE"));
  await assert.rejects(contentService.create({
    ...input,
    scheduledAt: new Date("2025-01-02T00:00:00.000Z"),
    expiresAt: new Date("2025-01-01T00:00:00.000Z"),
  }), hasError(400, "INVALID_CONTENT_DATES"));
});

test("update normalizes slug and rejects missing content", async (t) => {
  const find = t.mock.method(contentRepository, "findById", async () => ({
    _id: { toString: () => author },
    scheduledAt: null,
    expiresAt: null,
  } as never));
  const slug = t.mock.method(contentRepository, "findBySlug", async () => null);
  const update = t.mock.method(contentRepository, "updateById", async (_id, values) => values);
  const result = await contentService.update(author, { slug: "  About Us " });
  assert.equal(result.slug, "about-us");
  assert.equal(update.mock.calls[0]?.arguments[1].slug, "about-us");
  find.mock.restore();
  t.mock.method(contentRepository, "findById", async () => null);
  await assert.rejects(contentService.update(author, { title: "Updated" }), hasError(404, "CONTENT_NOT_FOUND"));
  assert.equal(slug.mock.callCount(), 1);
});

test("list applies default pagination metadata", async (t) => {
  t.mock.method(contentRepository, "list", async () => ({ items: [], total: 21 }));
  const result = await contentService.list({});
  assert.deepEqual(result.pagination, { page: 1, limit: 20, total: 21, totalPages: 2 });
});
