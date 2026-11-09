export function isValidId(
  value: unknown,
): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0
  );
}

export function normalizeId(
  value: unknown,
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

export function getId(
  value: unknown,
): string | undefined {
  const normalized = normalizeId(value);

  return normalized || undefined;
}

export function createTemporaryId(
  prefix = "temp",
): string {
  const normalizedPrefix =
    prefix
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-_]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "") || "temp";

  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return `${normalizedPrefix}-${crypto.randomUUID()}`;
  }

  return `${normalizedPrefix}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 10)}`;
}

export function isSameId(
  firstId: unknown,
  secondId: unknown,
): boolean {
  const first = normalizeId(firstId);
  const second = normalizeId(secondId);

  if (!first || !second) {
    return false;
  }

  return first === second;
}

export function hasId(
  items: Array<{ id?: string }>,
  id: unknown,
): boolean {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    return false;
  }

  return items.some(
    (item) => item.id === normalizedId,
  );
}

export function findById<T extends { id?: string }>(
  items: T[],
  id: unknown,
): T | undefined {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    return undefined;
  }

  return items.find(
    (item) => item.id === normalizedId,
  );
}

export function removeById<T extends { id?: string }>(
  items: T[],
  id: unknown,
): T[] {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    return [...items];
  }

  return items.filter(
    (item) => item.id !== normalizedId,
  );
}

export function updateById<T extends { id?: string }>(
  items: T[],
  id: unknown,
  update: Partial<T>,
): T[] {
  const normalizedId = normalizeId(id);

  if (!normalizedId) {
    return [...items];
  }

  return items.map((item) =>
    item.id === normalizedId
      ? { ...item, ...update }
      : item,
  );
}