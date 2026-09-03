import {
  ApiError,
} from "@/lib/api-error";

import type {
  ApiErrorResponse,
} from "@/lib/api-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ??
  "http://localhost:8000";

const AUTH_TOKEN_STORAGE_KEY =
  "revrecover_access_token";
const REFRESH_TOKEN_STORAGE_KEY =
  "revrecover_refresh_token";

interface RequestOptions
  extends RequestInit {
  params?: Record<
    string,
    string | number | boolean | undefined
  >;
}

export function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    window.localStorage.getItem(
      AUTH_TOKEN_STORAGE_KEY
    ) ?? null
  );
}

export function setAuthToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AUTH_TOKEN_STORAGE_KEY,
    token
  );
}

export function getRefreshToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(
    REFRESH_TOKEN_STORAGE_KEY
  );
}

export function setRefreshToken(token: string) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    REFRESH_TOKEN_STORAGE_KEY,
    token
  );
}

export function clearAuthToken() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(
    AUTH_TOKEN_STORAGE_KEY
  );
  window.localStorage.removeItem(
    REFRESH_TOKEN_STORAGE_KEY
  );
}

function buildUrl(
  path: string,
  params?: RequestOptions["params"]
) {
  const baseUrl = API_BASE_URL.replace(
    /\/$/,
    ""
  );

  const normalizedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  const url = new URL(
    `${baseUrl}${normalizedPath}`,
    typeof window !== "undefined"
      ? window.location.origin
      : "http://localhost"
  );

  if (params) {
    Object.entries(params).forEach(
      ([key, value]) => {
        if (value !== undefined) {
          url.searchParams.set(
            key,
            String(value)
          );
        }
      }
    );
  }

  return url.toString();
}

async function parseResponse(
  response: Response
) {
  const contentType =
    response.headers.get("content-type");

  if (
    contentType?.includes(
      "application/json"
    )
  ) {
    return response.json();
  }

  return null;
}

async function request<T>(
  path: string,
  options: RequestOptions = {},
  retryOnUnauthorized = true
): Promise<T> {
  const {
    params,
    headers,
    ...fetchOptions
  } = options;

  const url = buildUrl(path, params);
  const authToken = getAuthToken();

  let response: Response;

  try {
    response = await fetch(url, {
      ...fetchOptions,

      headers: {
        "Content-Type":
          "application/json",
        ...(authToken
          ? {
              Authorization: `Bearer ${authToken}`,
            }
          : {}),
        ...headers,
      },
    });
  } catch {
    throw new ApiError(
      "Unable to connect to the API.",
      0,
      "NETWORK_ERROR"
    );
  }

  const body = await parseResponse(response);

  if (
    response.status === 401 &&
    retryOnUnauthorized &&
    getRefreshToken() &&
    !path.endsWith("/auth/refresh") &&
    !path.endsWith("/auth/login")
  ) {
    const refreshResponse = await fetch(
      buildUrl("/auth/refresh"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refresh_token: getRefreshToken(),
        }),
      }
    );

    if (refreshResponse.ok) {
      const refreshBody = (await refreshResponse.json()) as {
        access_token: string;
        refresh_token: string;
      };

      setAuthToken(refreshBody.access_token);
      setRefreshToken(refreshBody.refresh_token);

      return request(path, options, false);
    }

    clearAuthToken();
  }

  if (!response.ok) {
    const errorBody =
      body as ApiErrorResponse | null;

    const nestedError = errorBody?.error;

    throw new ApiError(
      nestedError?.message ??
        errorBody?.message ??
        "An unexpected API error occurred.",
      response.status,
      nestedError?.code ?? errorBody?.code,
      nestedError?.details ?? errorBody?.details
    );
  }

  return body as T;
}

export const api = {
  get<T>(
    path: string,
    options?: Omit<
      RequestOptions,
      "method" | "body"
    >
  ) {
    return request<T>(path, {
      ...options,
      method: "GET",
    });
  },

  post<T>(
    path: string,
    body?: unknown,
    options?: Omit<
      RequestOptions,
      "method" | "body"
    >
  ) {
    return request<T>(path, {
      ...options,
      method: "POST",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  },

  put<T>(
    path: string,
    body?: unknown,
    options?: Omit<
      RequestOptions,
      "method" | "body"
    >
  ) {
    return request<T>(path, {
      ...options,
      method: "PUT",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  },

  patch<T>(
    path: string,
    body?: unknown,
    options?: Omit<
      RequestOptions,
      "method" | "body"
    >
  ) {
    return request<T>(path, {
      ...options,
      method: "PATCH",
      body:
        body !== undefined
          ? JSON.stringify(body)
          : undefined,
    });
  },

  delete<T>(
    path: string,
    options?: Omit<
      RequestOptions,
      "method" | "body"
    >
  ) {
    return request<T>(path, {
      ...options,
      method: "DELETE",
    });
  },
};
