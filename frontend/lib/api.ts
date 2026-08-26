import {
  ApiError,
} from "@/lib/api-error";

import type {
  ApiErrorResponse,
} from "@/lib/api-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

interface RequestOptions
  extends RequestInit {
  params?: Record<
    string,
    string | number | boolean | undefined
  >;
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
  options: RequestOptions = {}
): Promise<T> {
  const {
    params,
    headers,
    ...fetchOptions
  } = options;

  const url = buildUrl(path, params);

  let response: Response;

  try {
    response = await fetch(url, {
      ...fetchOptions,

      headers: {
        "Content-Type":
          "application/json",

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

  if (!response.ok) {
    const errorBody =
      body as ApiErrorResponse | null;

    throw new ApiError(
      errorBody?.message ??
        "An unexpected API error occurred.",
      response.status,
      errorBody?.code,
      errorBody?.details
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
