export function isObject(
  value: unknown,
): value is Record<string, unknown> {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  );
}

export function isEmptyObject(
  value: unknown,
): boolean {
  return (
    isObject(value) &&
    Object.keys(value).length === 0
  );
}

export function pick<
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  object: T,
  keys: K[],
): Pick<T, K> {
  const result = {} as Pick<T, K>;

  for (const key of keys) {
    if (key in object) {
      result[key] = object[key];
    }
  }

  return result;
}

export function omit<
  T extends Record<string, unknown>,
  K extends keyof T,
>(
  object: T,
  keys: K[],
): Omit<T, K> {
  const keysToRemove = new Set<PropertyKey>(
    keys,
  );

  const result = {} as Omit<T, K>;

  for (const key of Object.keys(object)) {
    if (!keysToRemove.has(key)) {
      (
        result as Record<string, unknown>
      )[key] = object[key];
    }
  }

  return result;
}

export function hasOwnProperty(
  object: object,
  key: PropertyKey,
): boolean {
  return Object.prototype.hasOwnProperty.call(
    object,
    key,
  );
}

export function getObjectValue<T = unknown>(
  object: unknown,
  key: string,
  fallback?: T,
): T | undefined {
  if (!isObject(object)) {
    return fallback;
  }

  const value = object[key];

  return value === undefined
    ? fallback
    : (value as T);
}

export function setObjectValue<
  T extends object,
>(
  object: T,
  key: string,
  value: unknown,
): T {
  return {
    ...object,
    [key]: value,
  };
}

export function removeUndefined<
  T extends Record<string, unknown>,
>(
  object: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== undefined,
    ),
  ) as Partial<T>;
}

export function removeNullish<
  T extends Record<string, unknown>,
>(
  object: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined,
    ),
  ) as Partial<T>;
}

export function compactObject<
  T extends Record<string, unknown>,
>(
  object: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => Boolean(value),
    ),
  ) as Partial<T>;
}

export function mergeObjects<
  T extends Record<string, unknown>,
  U extends Record<string, unknown>,
>(
  first: T,
  second: U,
): T & U {
  return {
    ...first,
    ...second,
  };
}

export function shallowEqual(
  first: Record<string, unknown>,
  second: Record<string, unknown>,
): boolean {
  const firstKeys =
    Object.keys(first);

  const secondKeys =
    Object.keys(second);

  if (
    firstKeys.length !==
    secondKeys.length
  ) {
    return false;
  }

  return firstKeys.every(
    (key) =>
      first[key] === second[key],
  );
}

export function cloneObject<
  T extends Record<string, unknown>,
>(
  object: T,
): T {
  return {
    ...object,
  };
}