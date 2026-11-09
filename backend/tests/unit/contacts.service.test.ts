import assert from "node:assert/strict";
import { test } from "node:test";
import { Contact } from "../../src/modules/contacts/models/contact-inquiry.model.js";
import { contactRepository } from "../../src/modules/contacts/repositories/contact.repository.js";
import { contactService } from "../../src/modules/contacts/services/contact.service.js";
import { ApiError } from "../../src/utils/api-error.js";

const service = contactService;
const contactId = "68a888888888888888888888";
const contactInput = {
  name: "  Alex Example ",
  email: "  ALEX@EXAMPLE.COM ",
  phone: " 555-0100 ",
  subject: "  Booking question ",
  message: "  I need help with my reservation. ",
};
const hasError = (status: number, code: string) => (error: unknown) =>
  error instanceof ApiError && error.statusCode === status && error.code === code;
const makeContact = (overrides: Record<string, unknown> = {}) =>
  Contact.hydrate({
    _id: contactId,
    reference: "SOG-CON-20250101-ABC123",
    name: "Alex Example",
    email: "alex@example.com",
    subject: "Booking question",
    message: "I need help with my reservation.",
    category: "general_inquiry",
    status: "new",
    resolvedAt: null,
    closedAt: null,
    ...overrides,
  });

test("createContact normalizes public input and persists a generated reference without database access", async (t) => {
  const find = t.mock.method(contactRepository, "findByReference", async () => null);
  const contact = makeContact({ reference: undefined });
  const save = t.mock.method(contact, "save", async () => contact);
  const create = t.mock.method(contactRepository, "create", async () => contact);
  const result = await service.createContact(contactInput);
  assert.equal(result.email, "alex@example.com");
  assert.match(result.reference, /^SOG-CON-\d{8}-[A-F0-9]{32}$/);
  assert.equal(create.mock.calls[0]?.arguments[0].name, "Alex Example");
  assert.equal(create.mock.calls[0]?.arguments[0].email, "alex@example.com");
  assert.equal(create.mock.calls[0]?.arguments[0].phone, "555-0100");
  assert.equal(save.mock.callCount(), 1);
  assert.equal(find.mock.callCount(), 1);
});

test("contact lookups reject malformed IDs and report missing submissions", async (t) => {
  const find = t.mock.method(contactRepository, "findById", async () => null);
  await assert.rejects(service.getContactById("bad"), hasError(400, "INVALID_CONTACT_ID"));
  await assert.rejects(service.getContactById(contactId), hasError(404, "CONTACT_NOT_FOUND"));
  assert.equal(find.mock.callCount(), 1);
});

test("contact updates normalize status timestamps and reject missing records", async (t) => {
  const existing = makeContact();
  const find = t.mock.method(contactRepository, "findById", async () => existing);
  const update = t.mock.method(contactRepository, "updateById", async (_id, updates) => makeContact(updates));
  await service.changeContactStatus(contactId, "resolved");
  assert.ok(update.mock.calls[0]?.arguments[1].resolvedAt instanceof Date);
  assert.equal(update.mock.calls[0]?.arguments[1].closedAt, null);
  find.mock.restore();
  t.mock.method(contactRepository, "findById", async () => null);
  await assert.rejects(service.updateContact(contactId, { subject: "Updated subject" }),
    hasError(404, "CONTACT_NOT_FOUND"));
  assert.equal(update.mock.callCount(), 1);
});
