/**
 * SOG Airways demo payment balance configuration.
 *
 * Frontend-only configuration:
 * - No real funds are held or transferred.
 * - No browser storage is used.
 * - Runtime balance changes will reset on a full page reload.
 * - Replenishments must be recorded in the demo funding ledger.
 */

export interface DemoPaymentBalanceConfig {
  currency: string;
  initialBalance: number;
  replenishmentAmount: number;
  minimumBalance: number;
  automaticReplenishmentEnabled: boolean;
}

export const MOCK_PAYMENT_BALANCE: DemoPaymentBalanceConfig = {
  currency: "NGN",
  initialBalance: 1000000,
  replenishmentAmount: 500000,
  minimumBalance: 200000,
  automaticReplenishmentEnabled: true,
};

/**
 * Return a copy of the default configuration.
 */
export function getMockPaymentBalanceConfig(): DemoPaymentBalanceConfig {
  return { ...MOCK_PAYMENT_BALANCE };
}