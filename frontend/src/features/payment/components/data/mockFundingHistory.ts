
/**
 * SOG Airways demo funding ledger.
 *
 * This is in-memory frontend seed data only.
 * No real bank transfers or money movement occur.
 * Do not use localStorage to persist these records.
 */

import { FundingRecord } from "../admin";



export const MOCK_FUNDING_HISTORY: FundingRecord[] = [
  {
    id: "fund_demo_001",
    reference: "SOG-FUND-DEMO-10001",
    type: "replenishment",
    amount: 1000000,
    currency: "NGN",
    description: "Initial demo funding balance",
    createdAt: "2026-10-10T08:00:00.000Z",
    status: "successful",
  },
  {
    id: "fund_demo_002",
    reference: "SOG-FUND-DEMO-10002",
    type: "booking-charge",
    amount: 285000,
    currency: "NGN",
    description: "Demo charge for booking SOG-BK-10001",
    createdAt: "2026-10-12T09:30:00.000Z",
    status: "successful",
  },
  {
    id: "fund_demo_003",
    reference: "SOG-FUND-DEMO-10003",
    type: "booking-charge",
    amount: 410000,
    currency: "NGN",
    description: "Demo charge for booking SOG-BK-10002",
    createdAt: "2026-10-12T11:15:00.000Z",
    status: "successful",
  },
  {
    id: "fund_demo_004",
    reference: "SOG-FUND-DEMO-10004",
    type: "replenishment",
    amount: 500000,
    currency: "NGN",
    description: "Automatic demo balance replenishment",
    createdAt: "2026-10-12T11:16:00.000Z",
    status: "successful",
  },
  {
    id: "fund_demo_005",
    reference: "SOG-FUND-DEMO-10005",
    type: "booking-charge",
    amount: 175000,
    currency: "NGN",
    description: "Demo charge for booking SOG-BK-10003",
    createdAt: "2026-10-13T08:20:00.000Z",
    status: "pending",
  },
  {
    id: "fund_demo_006",
    reference: "SOG-FUND-DEMO-10006",
    type: "refund",
    amount: 100000,
    currency: "NGN",
    description: "Partial demo refund for booking SOG-BK-10005",
    createdAt: "2026-10-13T14:30:00.000Z",
    status: "successful",
  },
  {
    id: "fund_demo_007",
    reference: "SOG-FUND-DEMO-10007",
    type: "reversal",
    amount: 50000,
    currency: "NGN",
    description: "Demo reversal for a previously recorded booking charge",
    createdAt: "2026-10-14T07:10:00.000Z",
    status: "pending",
  },
];

export function getMockFundingHistory(): FundingRecord[] {
  return MOCK_FUNDING_HISTORY.map((record) => ({ ...record }));
}