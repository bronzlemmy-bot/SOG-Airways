
import type { RequestHandler } from "express";
import { asyncHandler } from "../../../utils/async-handler.js";
import { contactService } from "../services/contact.service.js";
import type {
  ContactCountValidatedQuery,
  ContactIdParams,
  ContactListValidatedQuery,
  ContactReferenceParams,
  CreateContactValidatedInput,
  UpdateContactValidatedInput,
} from "../validations/contact.validation.js";
import type {
  ContactCategory,
  ContactStatus,
} from "../models/contact-inquiry.model.js";

type ValidatedRequestData = {
  body?: unknown;
  params?: unknown;
  query?: unknown;
};

const getValidatedData = <T,>(
  res: Parameters<RequestHandler>[1],
  key: keyof ValidatedRequestData,
): T => {
  const validated = res.locals.validated as
    | ValidatedRequestData
    | undefined;

  const value = validated?.[key];

  if (value === undefined) {
    throw new Error(`Validated request ${key} is missing.`);
  }

  return value as T;
};

class ContactController {
  createContact: RequestHandler = asyncHandler(async (_req, res) => {
    const input =
      getValidatedData<CreateContactValidatedInput>(res, "body");

    const contact = await contactService.createContact(input);

    res.status(201).json({
      success: true,
      message: "Your contact submission has been received.",
      data: contact,
    });
  });

  getContacts: RequestHandler = asyncHandler(async (_req, res) => {
    const query =
      getValidatedData<ContactListValidatedQuery>(res, "query");

    const {
      page,
      limit,
      sortBy,
      sortOrder,
      reference,
      name,
      email,
      category,
      status,
      customer,
      assignedTo,
      search,
      createdFrom,
      createdTo,
    } = query;

    const result = await contactService.getContacts(
      {
        reference,
        name,
        email,
        category,
        status,
        customer,
        assignedTo,
        search,
        createdFrom,
        createdTo,
      },
      {
        page,
        limit,
        sortBy,
        sortOrder,
      },
    );

    res.status(200).json({
      success: true,
      message: "Contact submissions retrieved successfully.",
      data: result.items,
      pagination: result.pagination,
    });
  });

  getContactById: RequestHandler = asyncHandler(async (_req, res) => {
    const { contactId } =
      getValidatedData<ContactIdParams>(res, "params");

    const contact = await contactService.getContactById(contactId);

    res.status(200).json({
      success: true,
      message: "Contact submission retrieved successfully.",
      data: contact,
    });
  });

  getContactByReference: RequestHandler = asyncHandler(
    async (_req, res) => {
      const { reference } =
        getValidatedData<ContactReferenceParams>(res, "params");

      const contact =
        await contactService.getContactByReference(reference);

      res.status(200).json({
        success: true,
        message: "Contact submission retrieved successfully.",
        data: {
          reference: contact.reference,
          status: contact.status,
          category: contact.category,
          createdAt: contact.createdAt,
          updatedAt: contact.updatedAt,
        },
      });
    },
  );

  getContactsByEmail: RequestHandler = asyncHandler(
    async (_req, res) => {
      const query = getValidatedData<{ email: string }>(res, "query");

      const contacts =
        await contactService.getContactsByEmail(query.email);

      res.status(200).json({
        success: true,
        message: "Contact submissions retrieved successfully.",
        data: contacts,
      });
    },
  );

  updateContact: RequestHandler = asyncHandler(async (_req, res) => {
    const { contactId } =
      getValidatedData<ContactIdParams>(res, "params");

    const updates =
      getValidatedData<UpdateContactValidatedInput>(res, "body");

    const contact = await contactService.updateContact(
      contactId,
      updates,
    );

    res.status(200).json({
      success: true,
      message: "Contact submission updated successfully.",
      data: contact,
    });
  });

  changeContactStatus: RequestHandler = asyncHandler(
    async (_req, res) => {
      const { contactId } =
        getValidatedData<ContactIdParams>(res, "params");

      const { status } = getValidatedData<{ status: ContactStatus }>(
        res,
        "body",
      );

      const contact = await contactService.changeContactStatus(
        contactId,
        status,
      );

      res.status(200).json({
        success: true,
        message: "Contact status updated successfully.",
        data: contact,
      });
    },
  );

  assignContact: RequestHandler = asyncHandler(async (_req, res) => {
    const { contactId } =
      getValidatedData<ContactIdParams>(res, "params");

    const { staffUserId } = getValidatedData<{
      staffUserId: string;
    }>(res, "body");

    const contact = await contactService.assignContact(
      contactId,
      staffUserId,
    );

    res.status(200).json({
      success: true,
      message: "Contact submission assigned successfully.",
      data: contact,
    });
  });

  unassignContact: RequestHandler = asyncHandler(async (_req, res) => {
    const { contactId } =
      getValidatedData<ContactIdParams>(res, "params");

    const contact = await contactService.unassignContact(contactId);

    res.status(200).json({
      success: true,
      message: "Contact submission unassigned successfully.",
      data: contact,
    });
  });

  deleteContact: RequestHandler = asyncHandler(async (_req, res) => {
    const { contactId } =
      getValidatedData<ContactIdParams>(res, "params");

    await contactService.deleteContact(contactId);

    res.status(200).json({
      success: true,
      message: "Contact submission deleted successfully.",
    });
  });

  getContactCounts: RequestHandler = asyncHandler(
    async (_req, res) => {
      const filters =
        getValidatedData<ContactCountValidatedQuery>(res, "query");

      const counts = await contactService.getContactCounts(filters);

      res.status(200).json({
        success: true,
        message: "Contact statistics retrieved successfully.",
        data: counts,
      });
    },
  );

  getContactCount: RequestHandler = asyncHandler(
    async (_req, res) => {
      const filters =
        getValidatedData<ContactCountValidatedQuery>(res, "query");

      const total = await contactService.getContactCount(filters);

      res.status(200).json({
        success: true,
        message: "Contact count retrieved successfully.",
        data: { total },
      });
    },
  );

  getCountByStatus: RequestHandler = asyncHandler(
    async (_req, res) => {
      const query = getValidatedData<{
        status: ContactStatus;
        customer?: string;
        assignedTo?: string;
        createdFrom?: Date;
        createdTo?: Date;
      }>(res, "query");

      const { status, ...filters } = query;
      const total = await contactService.getCountByStatus(
        status,
        filters,
      );

      res.status(200).json({
        success: true,
        message: "Contact status count retrieved successfully.",
        data: { status, total },
      });
    },
  );

  getCountByCategory: RequestHandler = asyncHandler(
    async (_req, res) => {
      const query = getValidatedData<{
        category: ContactCategory;
        customer?: string;
        assignedTo?: string;
        createdFrom?: Date;
        createdTo?: Date;
      }>(res, "query");

      const { category, ...filters } = query;
      const total = await contactService.getCountByCategory(
        category,
        filters,
      );

      res.status(200).json({
        success: true,
        message: "Contact category count retrieved successfully.",
        data: { category, total },
      });
    },
  );
}

export const contactController = new ContactController();
