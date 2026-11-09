export function isString(
  value: unknown,
): value is string {
  return typeof value === "string";
}

export function isEmptyString(
  value: unknown,
): boolean {
  return (
    typeof value === "string" &&
    value.trim().length === 0
  );
}

export function toString(
  value: unknown,
  fallback = "",
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return fallback;
  }

  return String(value);
}

export function normalizeString(
  value: unknown,
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  return String(value)
    .trim()
    .replace(/\s+/g, " ");
}

export function capitalize(
  value: string,
): string {
  const normalized =
    normalizeString(value);

  if (!normalized) {
    return "";
  }

  return (
    normalized.charAt(0).toUpperCase() +
    normalized.slice(1)
  );
}

export function capitalizeWords(
  value: string,
): string {
  return normalizeString(value)
    .toLowerCase()
    .replace(
      /\b\w/g,
      (character) =>
        character.toUpperCase(),
    );
}

export function toLowerCase(
  value: string,
): string {
  return value.trim().toLowerCase();
}

export function toUpperCase(
  value: string,
): string {
  return value.trim().toUpperCase();
}

export function truncate(
  value: string,
  maxLength: number,
  suffix = "...",
): string {
  const normalized =
    normalizeString(value);

  if (
    maxLength <= 0 ||
    normalized.length <= maxLength
  ) {
    return normalized;
  }

  if (
    suffix.length >= maxLength
  ) {
    return suffix.slice(
      0,
      maxLength,
    );
  }

  return (
    normalized.slice(
      0,
      maxLength - suffix.length,
    ) + suffix
  );
}

export function slugify(
  value: string,
): string {
  return normalizeString(value)
    .toLowerCase()
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function camelToKebab(
  value: string,
): string {
  return value
    .replace(
      /([a-z])([A-Z])/g,
      "$1-$2",
    )
    .replace(
      /[\s_]+/g,
      "-",
    )
    .toLowerCase();
}

export function kebabToCamel(
  value: string,
): string {
  return normalizeString(value)
    .toLowerCase()
    .replace(
      /[-_\s]+(.)?/g,
      (_, character: string) =>
        character
          ? character.toUpperCase()
          : "",
    );
}

export function removeWhitespace(
  value: string,
): string {
  return value.replace(/\s+/g, "");
}

export function containsText(
  value: string,
  search: string,
): boolean {
  return value
    .toLowerCase()
    .includes(search.toLowerCase());
}

export function startsWithText(
  value: string,
  search: string,
): boolean {
  return value
    .toLowerCase()
    .startsWith(search.toLowerCase());
}

export function endsWithText(
  value: string,
  search: string,
): boolean {
  return value
    .toLowerCase()
    .endsWith(search.toLowerCase());
}

export function maskString(
  value: string,
  visibleCharacters = 4,
  maskCharacter = "•",
): string {
  const normalized =
    value.trim();

  if (!normalized) {
    return "";
  }

  if (
    visibleCharacters <= 0
  ) {
    return maskCharacter.repeat(
      normalized.length,
    );
  }

  if (
    normalized.length <=
    visibleCharacters
  ) {
    return normalized;
  }

  return (
    maskCharacter.repeat(
      normalized.length -
        visibleCharacters,
    ) +
    normalized.slice(
      -visibleCharacters,
    )
  );
}

export function getInitials(
  value: string,
  maximumInitials = 2,
): string {
  const words =
    normalizeString(value)
      .split(" ")
      .filter(Boolean);

  if (words.length === 0) {
    return "";
  }

  return words
    .slice(0, maximumInitials)
    .map(
      (word) =>
        word.charAt(0),
    )
    .join("")
    .toUpperCase();
}

export function countCharacters(
  value: string,
): number {
  return Array.from(value).length;
}

export function countWords(
  value: string,
): number {
  const normalized =
    normalizeString(value);

  if (!normalized) {
    return 0;
  }

  return normalized.split(" ").length;
}

export function randomString(
  length = 8,
): string {
  if (length <= 0) {
    return "";
  }

  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  let result = "";

  for (let index = 0; index < length; index += 1) {
    result +=
      characters.charAt(
        Math.floor(
          Math.random() *
            characters.length,
        ),
      );
  }

  return result;
}