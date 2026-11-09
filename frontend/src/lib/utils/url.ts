export function isValidUrl(
  value: unknown,
): value is string {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return false;
  }

  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
}

export function isAbsoluteUrl(
  value: string,
): boolean {
  if (!value.trim()) {
    return false;
  }

  try {
    const url = new URL(value);

    return Boolean(
      url.protocol &&
        url.host,
    );
  } catch {
    return false;
  }
}

export function isExternalUrl(
  value: string,
): boolean {
  if (!isAbsoluteUrl(value)) {
    return false;
  }

  if (
    typeof window ===
    "undefined"
  ) {
    return false;
  }

  try {
    const url = new URL(value);

    return (
      url.origin !==
      window.location.origin
    );
  } catch {
    return false;
  }
}

export function normalizeUrl(
  value: string,
): string {
  return value.trim();
}

export function addQueryParams(
  url: string,
  params: Record<
    string,
    unknown
  >,
): string {
  try {
    const parsedUrl = new URL(
      url,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    Object.entries(params).forEach(
      ([key, value]) => {
        if (
          value === undefined ||
          value === null
        ) {
          return;
        }

        if (
          Array.isArray(value)
        ) {
          parsedUrl.searchParams.delete(
            key,
          );

          value.forEach(
            (item) => {
              parsedUrl.searchParams.append(
                key,
                String(item),
              );
            },
          );

          return;
        }

        parsedUrl.searchParams.set(
          key,
          String(value),
        );
      },
    );

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

export function getQueryParam(
  url: string,
  key: string,
): string | null {
  try {
    const parsedUrl = new URL(
      url,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    return parsedUrl.searchParams.get(
      key,
    );
  } catch {
    return null;
  }
}

export function getQueryParams(
  url: string,
): Record<string, string> {
  try {
    const parsedUrl = new URL(
      url,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    return Object.fromEntries(
      parsedUrl.searchParams.entries(),
    );
  } catch {
    return {};
  }
}

export function removeQueryParam(
  url: string,
  key: string,
): string {
  try {
    const parsedUrl = new URL(
      url,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    parsedUrl.searchParams.delete(
      key,
    );

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

export function removeQueryParams(
  url: string,
  keys: string[],
): string {
  try {
    const parsedUrl = new URL(
      url,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    keys.forEach((key) => {
      parsedUrl.searchParams.delete(
        key,
      );
    });

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

export function getPathname(
  url: string,
): string {
  try {
    const parsedUrl = new URL(
      url,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    return parsedUrl.pathname;
  } catch {
    return "";
  }
}

export function getOrigin(
  url: string,
): string {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

export function joinUrl(
  ...parts: string[]
): string {
  return parts
    .filter(
      (part) =>
        part !== undefined &&
        part !== null &&
        part !== "",
    )
    .map((part, index) => {
      if (index === 0) {
        return part.replace(
          /\/+$/,
          "",
        );
      }

      return part.replace(
        /^\/+|\/+$/g,
        "",
      );
    })
    .join("/");
}

export function buildApiUrl(
  baseUrl: string,
  endpoint: string,
): string {
  return joinUrl(
    baseUrl,
    endpoint,
  );
}

export function isSameOrigin(
  firstUrl: string,
  secondUrl: string,
): boolean {
  try {
    const first = new URL(
      firstUrl,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    const second = new URL(
      secondUrl,
      typeof window !==
        "undefined"
        ? window.location.origin
        : "http://localhost",
    );

    return (
      first.origin ===
      second.origin
    );
  } catch {
    return false;
  }
}

export function encodeUrlPart(
  value: string,
): string {
  return encodeURIComponent(value);
}

export function decodeUrlPart(
  value: string,
): string {
  try {
    return decodeURIComponent(
      value,
    );
  } catch {
    return value;
  }
}