import assert from "node:assert/strict";
import { test } from "node:test";
import { newsletterRepository } from "../../src/modules/newsletters/repositories/newsletter.repository.js";
import { newsletterService } from "../../src/modules/newsletters/services/newsletter.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const input = { email: "  ALEX@EXAMPLE.COM ", consentGiven: true as const };
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;

test("subscribe normalizes email and requires explicit consent", async (t) => {
  const find = t.mock.method(newsletterRepository, "findByEmail", async () => null);
  const create = t.mock.method(newsletterRepository, "create", async (value) => value);
  await assert.rejects(newsletterService.subscribe({ ...input, consentGiven: false }),
    hasError(400, "NEWSLETTER_CONSENT_REQUIRED"));
  assert.equal(find.mock.callCount(), 0);
  const result = await newsletterService.subscribe(input);
  assert.equal(result.email, "alex@example.com");
  assert.equal(result.consentGiven, true);
  assert.equal(create.mock.calls[0]?.arguments[0].email, "alex@example.com");
});

test("already-subscribed addresses conflict and unsubscribed addresses require re-consent", async (t) => {
  const find = t.mock.method(newsletterRepository, "findByEmail", async () => ({
    id: "68a111111111111111111111",
    email: "alex@example.com",
    status: "subscribed",
    consentGiven: true,
  } as never));
  const update = t.mock.method(newsletterRepository, "update", async () => ({}));
  await assert.rejects(newsletterService.subscribe(input),
    hasError(409, "NEWSLETTER_ALREADY_SUBSCRIBED"));
  find.mock.restore();
  t.mock.method(newsletterRepository, "findByEmail", async () => ({
    id: "68a111111111111111111111",
    email: "alex@example.com",
    status: "unsubscribed",
    consentGiven: true,
  } as never));
  t.mock.method(newsletterRepository, "findById", async () => ({
    id: "68a111111111111111111111",
    email: "alex@example.com",
    status: "unsubscribed",
    consentGiven: true,
  } as never));
  await assert.rejects(newsletterService.update("68a111111111111111111111", { status: "subscribed" }),
    hasError(400, "NEWSLETTER_RECONSENT_REQUIRED"));
  assert.equal(update.mock.callCount(), 0);
});

test("unsubscribe is idempotent for already-unsubscribed records", async (t) => {
  const find = t.mock.method(newsletterRepository, "findByEmail", async () => ({
    id: "68a111111111111111111111",
    email: "alex@example.com",
    status: "unsubscribed",
  } as never));
  const unsubscribe = t.mock.method(newsletterRepository, "unsubscribeByEmail", async () => null);
  const result = await newsletterService.unsubscribeByEmail("alex@example.com");
  assert.equal(result.status, "unsubscribed");
  assert.equal(find.mock.callCount(), 1);
  assert.equal(unsubscribe.mock.callCount(), 0);
});
