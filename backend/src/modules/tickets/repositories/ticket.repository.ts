
import type { ClientSession, SortOrder } from "mongoose";

import { Ticket, type TicketRecord } from "../models/ticket.model.js";

import type {
  CreateTicketInput,
  TicketFilters,
  TicketPaginationOptions,
  TicketRepositoryUpdateData,
} from "../types/ticket.types.js";

type TicketDocument = TicketRecord;
type TicketSort = Record<string, SortOrder>;

type RangeFilter<T> = {
  $gte?: T;
  $lte?: T;
};

type TicketQuery = Record<string, unknown> & {
  $or?: Array<Record<string, unknown>>;
  fareAmount?: RangeFilter<number>;
  issuedAt?: RangeFilter<Date>;
};

export class TicketRepository {
  async create(
    input: CreateTicketInput,
    session?: ClientSession,
  ): Promise<TicketDocument> {
    const ticket = new Ticket(input);
    return ticket.save(session ? { session } : undefined);
  }

  async findById(id: string): Promise<TicketDocument | null> {
    return Ticket.findById(id).exec();
  }

  async findByTicketNumber(
    ticketNumber: string,
  ): Promise<TicketDocument | null> {
    return Ticket.findOne({
      ticketNumber: ticketNumber.trim().toUpperCase(),
    }).exec();
  }

  async findByBookingPassengerAndFlight(
    booking: string,
    passenger: string,
    flight: string,
    session?: ClientSession,
  ): Promise<TicketDocument | null> {
    let query = Ticket.findOne({ booking, passenger, flight });
    if (session) query = query.session(session);
    return query.exec();
  }

  async findMany(
    filters: TicketFilters,
    pagination: TicketPaginationOptions,
  ): Promise<TicketDocument[]> {
    const query = this.buildFilterQuery(filters);
    const sortBy = pagination.sortBy ?? "issuedAt";
    const sortOrder: SortOrder =
      pagination.sortOrder === "asc" ? 1 : -1;

    const sort: TicketSort = {
      [sortBy]: sortOrder,
      _id: sortOrder,
    };

    const skip = (pagination.page - 1) * pagination.limit;

    return Ticket.find(query)
      .sort(sort)
      .skip(skip)
      .limit(pagination.limit)
      .exec();
  }

  async count(filters: TicketFilters = {}): Promise<number> {
    return Ticket.countDocuments(this.buildFilterQuery(filters)).exec();
  }

  async countByStatus(
    filters: TicketFilters = {},
  ): Promise<Record<string, number>> {
    const query = this.buildFilterQuery(filters);

    const results = await Ticket.aggregate<{
      _id: string;
      count: number;
    }>([
      { $match: query },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]).exec();

    return results.reduce<Record<string, number>>((counts, item) => {
      counts[item._id] = item.count;
      return counts;
    }, {});
  }

  async update(
    id: string,
    updates: TicketRepositoryUpdateData,
  ): Promise<TicketDocument | null> {
    return Ticket.findByIdAndUpdate(
      id,
      { $set: updates },
      {
        new: true,
        runValidators: true,
      },
    ).exec();
  }

  async delete(id: string): Promise<TicketDocument | null> {
    return Ticket.findByIdAndDelete(id).exec();
  }

  async existsByTicketNumber(
    ticketNumber: string,
    excludeId?: string,
  ): Promise<boolean> {
    const query: Record<string, unknown> = {
      ticketNumber: ticketNumber.trim().toUpperCase(),
    };

    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    return (await Ticket.exists(query)) !== null;
  }

  async findByCustomer(
    customerId: string,
    pagination: TicketPaginationOptions,
  ): Promise<TicketDocument[]> {
    return this.findMany({ customer: customerId }, pagination);
  }

  async findByFlight(
    flightId: string,
    pagination: TicketPaginationOptions,
  ): Promise<TicketDocument[]> {
    return this.findMany({ flight: flightId }, pagination);
  }

  async findByPayment(paymentId: string): Promise<TicketDocument[]> {
    return Ticket.find({ payment: paymentId })
      .sort({ issuedAt: -1 })
      .exec();
  }

  async findByBooking(bookingId: string): Promise<TicketDocument[]> {
    return Ticket.find({ booking: bookingId })
      .sort({ issuedAt: -1 })
      .exec();
  }

  private buildFilterQuery(filters: TicketFilters): TicketQuery {
    const query: TicketQuery = {};

    if (filters.ticketNumber) {
      query.ticketNumber = {
        $regex: this.escapeRegex(filters.ticketNumber),
        $options: "i",
      };
    }

    if (filters.booking) query.booking = filters.booking;
    if (filters.payment) query.payment = filters.payment;
    if (filters.customer) query.customer = filters.customer;
    if (filters.passenger) query.passenger = filters.passenger;
    if (filters.flight) query.flight = filters.flight;
    if (filters.ticketClass) query.ticketClass = filters.ticketClass;
    if (filters.status) query.status = filters.status;

    if (filters.currency) {
      query.currency = filters.currency.toUpperCase();
    }

    if (
      filters.minFare !== undefined ||
      filters.maxFare !== undefined
    ) {
      const fareRange: RangeFilter<number> = {};

      if (filters.minFare !== undefined) {
        fareRange.$gte = filters.minFare;
      }

      if (filters.maxFare !== undefined) {
        fareRange.$lte = filters.maxFare;
      }

      query.fareAmount = fareRange;
    }

    if (filters.issuedFrom || filters.issuedTo) {
      const dateRange: RangeFilter<Date> = {};

      if (filters.issuedFrom) {
        dateRange.$gte = filters.issuedFrom;
      }

      if (filters.issuedTo) {
        dateRange.$lte = filters.issuedTo;
      }

      query.issuedAt = dateRange;
    }

    if (filters.search) {
      const searchRegex = {
        $regex: this.escapeRegex(filters.search),
        $options: "i",
      };

      query.$or = [
        { ticketNumber: searchRegex },
        { seatNumber: searchRegex },
        { currency: searchRegex },
      ];
    }

    return query;
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }
}

export const ticketRepository = new TicketRepository();
