
import { randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { ApiError } from "../../../utils/api-error.js";
import { contactRepository } from "../repositories/contact.repository.js";
import type {
  ContactCountResult,
  ContactFilters,
  ContactPaginationOptions,
  CreateContactInput,
  UpdateContactInput,
} from "../types/contact.types.js";

type ContactStatus = NonNullable<UpdateContactInput["status"]>;
type ContactCategory = NonNullable<CreateContactInput["category"]>;

function applyStatusTimestamps(
  updates: UpdateContactInput,
  existing: { resolvedAt?: Date | null },
): UpdateContactInput {
  const result: UpdateContactInput = { ...updates };
  const status: string | undefined = updates.status;

  switch (status) {
    case "resolved":
      result.resolvedAt = updates.resolvedAt ?? new Date();
      result.closedAt = null;
      break;

    case "closed":
      result.closedAt = updates.closedAt ?? new Date();
      result.resolvedAt = existing.resolvedAt ?? new Date();
      break;

    case "new":
    case "in_progress":
      result.resolvedAt = null;
      result.closedAt = null;
      break;
  }

  return result;
}

class ContactService {
  private generateReference(): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const suffix = randomBytes(16).toString("hex").toUpperCase();

    return `SOG-CON-${date}-${suffix}`;
  }

  async createContact(input: CreateContactInput) {
    const normalizedInput: CreateContactInput = {
      ...input,
      name: input.name.trim(),
      email: input.email.trim().toLowerCase(),
      phone: input.phone?.trim() || null,
      subject: input.subject.trim(),
      message: input.message.trim(),
    };

    for (let attempt = 0; attempt < 5; attempt += 1) {
      const reference = this.generateReference();
      const existing =
        await contactRepository.findByReference(reference);

      if (existing) {
        continue;
      }

      const contact = await contactRepository.create({
        ...normalizedInput,
        category: input.category ?? "general_inquiry",
      });

      if (!contact.reference) {
        contact.reference = reference;
        await contact.save();
      }

      return contact;
    }

    throw new ApiError(
      "Unable to generate a unique contact reference. Please try again.",
      500,
      { code: "CONTACT_REFERENCE_GENERATION_FAILED" },
    );
  }

  async getContactById(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid contact ID.", 400, {
        code: "INVALID_CONTACT_ID",
      });
    }

    const contact = await contactRepository.findById(id);

    if (!contact) {
      throw new ApiError("Contact submission not found.", 404, {
        code: "CONTACT_NOT_FOUND",
      });
    }

    return contact;
  }

  async getContactByReference(reference: string) {
    const normalizedReference = reference.trim().toUpperCase();

    if (!normalizedReference) {
      throw new ApiError("A contact reference is required.", 400, {
        code: "CONTACT_REFERENCE_REQUIRED",
      });
    }

    const contact =
      await contactRepository.findByReference(normalizedReference);

    if (!contact) {
      throw new ApiError("Contact submission not found.", 404, {
        code: "CONTACT_NOT_FOUND",
      });
    }

    return contact;
  }

  async getContacts(
    filters: ContactFilters = {},
    pagination: ContactPaginationOptions = {
      page: 1,
      limit: 20,
      sortBy: "createdAt",
      sortOrder: "desc",
    },
  ) {
    return contactRepository.findMany(filters, pagination);
  }

  async getContactsByEmail(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      throw new ApiError("An email address is required.", 400, {
        code: "CONTACT_EMAIL_REQUIRED",
      });
    }

    return contactRepository.findByEmail(normalizedEmail);
  }

  async updateContact(id: string, updates: UpdateContactInput) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid contact ID.", 400, {
        code: "INVALID_CONTACT_ID",
      });
    }

    const existing = await contactRepository.findById(id);

    if (!existing) {
      throw new ApiError("Contact submission not found.", 404, {
        code: "CONTACT_NOT_FOUND",
      });
    }

    const normalizedUpdates: UpdateContactInput = { ...updates };

    if (updates.name !== undefined) {
      normalizedUpdates.name = updates.name.trim();
    }

    if (updates.email !== undefined) {
      normalizedUpdates.email = updates.email.trim().toLowerCase();
    }

    if (updates.phone !== undefined) {
      normalizedUpdates.phone = updates.phone?.trim() || null;
    }

    if (updates.subject !== undefined) {
      normalizedUpdates.subject = updates.subject.trim();
    }

    if (updates.message !== undefined) {
      normalizedUpdates.message = updates.message.trim();
    }

    if (updates.adminNotes !== undefined) {
      normalizedUpdates.adminNotes =
        updates.adminNotes?.trim() || null;
    }

    const updatesWithTimestamps = applyStatusTimestamps(
      normalizedUpdates,
      { resolvedAt: existing.resolvedAt },
    );

    const updated = await contactRepository.updateById(
      id,
      updatesWithTimestamps,
    );

    if (!updated) {
      throw new ApiError(
        "Contact submission could not be updated.",
        404,
        { code: "CONTACT_UPDATE_FAILED" },
      );
    }

    return updated;
  }

  async changeContactStatus(id: string, status: ContactStatus) {
    return this.updateContact(id, { status });
  }

  async assignContact(id: string, staffUserId: string) {
    if (!Types.ObjectId.isValid(staffUserId)) {
      throw new ApiError("Invalid staff user ID.", 400, {
        code: "INVALID_STAFF_USER_ID",
      });
    }

    await this.getContactById(id);

    const contact = await contactRepository.assignToStaff(
      id,
      staffUserId,
    );

    if (!contact) {
      throw new ApiError(
        "Contact submission could not be assigned.",
        404,
        { code: "CONTACT_ASSIGNMENT_FAILED" },
      );
    }

    return contact;
  }

  async unassignContact(id: string) {
    await this.getContactById(id);

    const contact = await contactRepository.unassignStaff(id);

    if (!contact) {
      throw new ApiError(
        "Contact submission could not be unassigned.",
        404,
        { code: "CONTACT_UNASSIGNMENT_FAILED" },
      );
    }

    return contact;
  }

  async deleteContact(id: string) {
    if (!Types.ObjectId.isValid(id)) {
      throw new ApiError("Invalid contact ID.", 400, {
        code: "INVALID_CONTACT_ID",
      });
    }

    const deleted = await contactRepository.deleteById(id);

    if (!deleted) {
      throw new ApiError("Contact submission not found.", 404, {
        code: "CONTACT_NOT_FOUND",
      });
    }

    return deleted;
  }

  async getContactCount(
    filters: {
      customer?: string;
      assignedTo?: string;
      createdFrom?: Date;
      createdTo?: Date;
    } = {},
  ): Promise<number> {
    return contactRepository.count(filters);
  }

  async getContactCounts(
    filters: {
      customer?: string;
      assignedTo?: string;
      createdFrom?: Date;
      createdTo?: Date;
    } = {},
  ): Promise<ContactCountResult> {
    return contactRepository.getCounts(filters);
  }

  async getCountByStatus(
    status: ContactStatus,
    filters: {
      customer?: string;
      assignedTo?: string;
      createdFrom?: Date;
      createdTo?: Date;
    } = {},
  ): Promise<number> {
    return contactRepository.countByStatus(status, filters);
  }

  async getCountByCategory(
    category: ContactCategory,
    filters: {
      customer?: string;
      assignedTo?: string;
      createdFrom?: Date;
      createdTo?: Date;
    } = {},
  ): Promise<number> {
    return contactRepository.countByCategory(category, filters);
  }
}

export const contactService = new ContactService();
