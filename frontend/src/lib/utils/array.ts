export function isArray<T>(
  value: unknown,
): value is T[] {
  return Array.isArray(value);
}

export function isEmptyArray(
  value: unknown,
): boolean {
  return Array.isArray(value) && value.length === 0;
}

export function uniqueArray<T>(
  items: T[],
): T[] {
  return Array.from(new Set(items));
}

export function uniqueArrayBy<T, K>(
  items: T[],
  getKey: (item: T) => K,
): T[] {
  const seen = new Set<K>();

  return items.filter((item) => {
    const key = getKey(item);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

export function compactArray<T>(
  items: (T | null | undefined | false | "" | 0)[],
): T[] {
  return items.filter(Boolean) as T[];
}

export function chunkArray<T>(
  items: T[],
  size: number,
): T[][] {
  if (size <= 0 || !Number.isFinite(size)) {
    return [];
  }

  const chunks: T[][] = [];

  for (
    let index = 0;
    index < items.length;
    index += size
  ) {
    chunks.push(
      items.slice(index, index + size),
    );
  }

  return chunks;
}

export function firstItem<T>(
  items?: T[],
): T | undefined {
  return items?.[0];
}

export function lastItem<T>(
  items?: T[],
): T | undefined {
  return items?.[items.length - 1];
}

export function removeItem<T>(
  items: T[],
  item: T,
): T[] {
  return items.filter(
    (currentItem) => currentItem !== item,
  );
}

export function removeItemBy<T>(
  items: T[],
  predicate: (item: T) => boolean,
): T[] {
  return items.filter(
    (item) => !predicate(item),
  );
}

export function findItemBy<T>(
  items: T[],
  predicate: (item: T) => boolean,
): T | undefined {
  return items.find(predicate);
}

export function sortArrayBy<T>(
  items: T[],
  getValue: (item: T) => string | number | Date,
  direction: "asc" | "desc" = "asc",
): T[] {
  return [...items].sort((a, b) => {
    const valueA = getValue(a);
    const valueB = getValue(b);

    const normalizedA =
      valueA instanceof Date
        ? valueA.getTime()
        : valueA;

    const normalizedB =
      valueB instanceof Date
        ? valueB.getTime()
        : valueB;

    if (normalizedA < normalizedB) {
      return direction === "asc" ? -1 : 1;
    }

    if (normalizedA > normalizedB) {
      return direction === "asc" ? 1 : -1;
    }

    return 0;
  });
}

export function groupArrayBy<T, K extends string | number>(
  items: T[],
  getKey: (item: T) => K,
): Record<string, T[]> {
  return items.reduce<Record<string, T[]>>(
    (groups, item) => {
      const key = String(getKey(item));

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(item);

      return groups;
    },
    {},
  );
}