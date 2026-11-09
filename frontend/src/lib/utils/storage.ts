import { isBrowser } from "./browser";

export type StorageType =
  | "local"
  | "session";

function getStorage(
  type: StorageType,
): Storage | null {
  if (!isBrowser()) {
    return null;
  }

  try {
    return type === "local"
      ? window.localStorage
      : window.sessionStorage;
  } catch {
    return null;
  }
}

export function isStorageAvailable(
  type: StorageType = "local",
): boolean {
  const storage = getStorage(type);

  if (!storage) {
    return false;
  }

  const testKey =
    "__sog_storage_test__";

  try {
    storage.setItem(testKey, "1");
    storage.removeItem(testKey);

    return true;
  } catch {
    return false;
  }
}

export function getStorageItem(
  key: string,
  type: StorageType = "local",
): string | null {
  if (!key.trim()) {
    return null;
  }

  const storage = getStorage(type);

  if (!storage) {
    return null;
  }

  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
}

export function setStorageItem(
  key: string,
  value: string,
  type: StorageType = "local",
): boolean {
  if (!key.trim()) {
    return false;
  }

  const storage = getStorage(type);

  if (!storage) {
    return false;
  }

  try {
    storage.setItem(key, value);

    return true;
  } catch {
    return false;
  }
}

export function removeStorageItem(
  key: string,
  type: StorageType = "local",
): boolean {
  if (!key.trim()) {
    return false;
  }

  const storage = getStorage(type);

  if (!storage) {
    return false;
  }

  try {
    storage.removeItem(key);

    return true;
  } catch {
    return false;
  }
}

export function clearStorage(
  type: StorageType = "local",
): boolean {
  const storage = getStorage(type);

  if (!storage) {
    return false;
  }

  try {
    storage.clear();

    return true;
  } catch {
    return false;
  }
}

export function getStorageJSON<T>(
  key: string,
  type: StorageType = "local",
): T | null {
  const value = getStorageItem(
    key,
    type,
  );

  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export function setStorageJSON<T>(
  key: string,
  value: T,
  type: StorageType = "local",
): boolean {
  try {
    return setStorageItem(
      key,
      JSON.stringify(value),
      type,
    );
  } catch {
    return false;
  }
}

export function hasStorageItem(
  key: string,
  type: StorageType = "local",
): boolean {
  return (
    getStorageItem(key, type) !== null
  );
}