"use client";

import {
  createContext,
  useContext,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import {
  createPaymentStore,
  type PaymentStore,
  type PaymentStoreSnapshot,
} from "@/features/payment/paymentStore";

const PaymentStoreContext = createContext<PaymentStore | null>(null);

interface PaymentStoreProviderProps {
  children: ReactNode;
}

export function PaymentStoreProvider({
  children,
}: PaymentStoreProviderProps) {
  const [store] = useState(() => createPaymentStore());

  return (
    <PaymentStoreContext.Provider value={store}>
      {children}
    </PaymentStoreContext.Provider>
  );
}

export function usePaymentStore(): PaymentStore {
  const store = useContext(PaymentStoreContext);

  if (!store) {
    throw new Error(
      "usePaymentStore must be used inside PaymentStoreProvider.",
    );
  }

  return store;
}

export function usePaymentStoreSnapshot(): PaymentStoreSnapshot {
  const store = usePaymentStore();

  return useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getSnapshot,
  );
}