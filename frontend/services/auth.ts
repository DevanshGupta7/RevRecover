import {
  api,
  clearAuthToken,
  setAuthToken,
  setRefreshToken,
} from "@/lib/api";

import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from "@/types/auth";

export async function login(
  request: LoginRequest
): Promise<LoginResponse> {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    request
  );

  setAuthToken(response.access_token);
  setRefreshToken(response.refresh_token);

  return response;
}

export async function register(
  request: RegisterRequest
): Promise<RegisterResponse> {
  return api.post<RegisterResponse>("/auth/register", request);
}

export async function getCurrentUser(): Promise<AuthUser> {
  return api.get<AuthUser>("/auth/me");
}

export async function logout(): Promise<void> {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAuthToken();
  }
}

export function clearSession(): void {
  clearAuthToken();
}
