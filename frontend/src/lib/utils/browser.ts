export function isBrowser(): boolean {
  return typeof window !== "undefined";
}

export function isServer(): boolean {
  return typeof window === "undefined";
}

export function getWindow(): Window | null {
  if (!isBrowser()) {
    return null;
  }

  return window;
}

export function getDocument(): Document | null {
  if (!isBrowser()) {
    return null;
  }

  return document;
}

export function getNavigator(): Navigator | null {
  if (!isBrowser()) {
    return null;
  }

  return navigator;
}

export function getCurrentUrl(): string {
  if (!isBrowser()) {
    return "";
  }

  return window.location.href;
}

export function getCurrentPathname(): string {
  if (!isBrowser()) {
    return "";
  }

  return window.location.pathname;
}

export function getCurrentSearch(): string {
  if (!isBrowser()) {
    return "";
  }

  return window.location.search;
}

export function getCurrentHash(): string {
  if (!isBrowser()) {
    return "";
  }

  return window.location.hash;
}

export function getUserAgent(): string {
  if (!isBrowser()) {
    return "";
  }

  return navigator.userAgent;
}

export function isOnline(): boolean {
  if (!isBrowser()) {
    return true;
  }

  return navigator.onLine;
}

export function openUrl(
  url: string,
  target: "_self" | "_blank" = "_self",
): void {
  if (!isBrowser()) {
    return;
  }

  window.open(
    url,
    target,
    target === "_blank"
      ? "noopener,noreferrer"
      : undefined,
  );
}

export function scrollToTop(
  behavior: ScrollBehavior = "smooth",
): void {
  if (!isBrowser()) {
    return;
  }

  window.scrollTo({
    top: 0,
    behavior,
  });
}

export function scrollToElement(
  elementId: string,
  behavior: ScrollBehavior = "smooth",
): void {
  if (!isBrowser()) {
    return;
  }

  const element =
    document.getElementById(elementId);

  if (!element) {
    return;
  }

  element.scrollIntoView({
    behavior,
    block: "start",
  });
}

export function copyToClipboard(
  value: string,
): Promise<boolean> {
  if (!isBrowser()) {
    return Promise.resolve(false);
  }

  if (!navigator.clipboard) {
    return Promise.resolve(false);
  }

  return navigator.clipboard
    .writeText(value)
    .then(() => true)
    .catch(() => false);
}