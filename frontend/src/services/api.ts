const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/+$/, "") ?? "";

const ACCESS_TOKEN_STORAGE_KEY = "sog-airways-access-token";
let accessToken: string | null = null;

export function setAccessToken(token: string): void {
  accessToken = token;
  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, token);
  }
}

export function clearAccessToken(): void {
  accessToken = null;
  if (typeof window !== "undefined") {
    window.sessionStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
  }
}

function getAccessToken(): string | null {
  if (!accessToken && typeof window !== "undefined") {
    accessToken = window.sessionStorage.getItem(ACCESS_TOKEN_STORAGE_KEY);
  }
  return accessToken;
}

export type ApiMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "DELETE";

export interface ApiRequestOptions {
  method?: ApiMethod;
  headers?: Record<string, string>;
  body?: unknown;
  signal?: AbortSignal;
}

export class ApiError extends Error {
  status: number;
  data?: unknown;

  constructor(
    message: string,
    status: number,
    data?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

async function request<T>(
  endpoint: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = "GET",
    headers = {},
    body,
    signal,
  } = options;

  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...headers,
  };

  const token = getAccessToken();
  if (token && !requestHeaders.Authorization && !requestHeaders.authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    requestHeaders["Content-Type"] = "application/json";
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    {
      method,
      headers: requestHeaders,
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
      signal,
    },
  );

  const contentType =
    response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      clearAccessToken();
    }

    const responseObject =
      typeof data === "object" && data !== null
        ? data as Record<string, unknown>
        : null;
    const errorObject =
      responseObject?.error &&
      typeof responseObject.error === "object"
        ? responseObject.error as Record<string, unknown>
        : null;
    const message =
      (typeof errorObject?.message === "string" && errorObject.message) ||
      (typeof responseObject?.message === "string" && responseObject.message) ||
      `Request failed with status ${response.status}.`;

    throw new ApiError(
      message,
      response.status,
      data,
    );
  }

  if (
    typeof data === "object" &&
    data !== null &&
    "success" in data &&
    data.success === true &&
    "data" in data
  ) {
    return data.data as T;
  }

  return data as T;
}

async function requestBlob(
  endpoint: string,
  options: Omit<ApiRequestOptions, "body"> = {},
): Promise<Blob> {
  const {
    method = "GET",
    headers = {},
    signal,
  } = options;
  const requestHeaders: Record<string, string> = {
    Accept: "application/pdf",
    ...headers,
  };
  const token = getAccessToken();

  if (token && !requestHeaders.Authorization && !requestHeaders.authorization) {
    requestHeaders.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`,
    { method, headers: requestHeaders, signal },
  );

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    const data = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (response.status === 401) {
      clearAccessToken();
    }

    const responseObject =
      typeof data === "object" && data !== null
        ? data as Record<string, unknown>
        : null;
    const errorObject =
      responseObject?.error &&
      typeof responseObject.error === "object"
        ? responseObject.error as Record<string, unknown>
        : null;
    const message =
      (typeof errorObject?.message === "string" && errorObject.message) ||
      (typeof responseObject?.message === "string" && responseObject.message) ||
      `Request failed with status ${response.status}.`;

    throw new ApiError(message, response.status, data);
  }

  return response.blob();
}

export const apiService = {
  getBlob(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<Blob> {
    return requestBlob(endpoint, {
      ...options,
      method: "GET",
    });
  },

  get<T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  patch<T>(
    endpoint: string,
    body?: unknown,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body,
    });
  },

  delete<T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, "method" | "body">,
  ): Promise<T> {
    return request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};