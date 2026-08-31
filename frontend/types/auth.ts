export interface AuthUser {
  id: string;
  email: string;
  full_name: string;
  organisation_id: string;
  role: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  organisation_name: string;
}

export interface RegisterResponse {
  id: string;
  email: string;
  full_name: string;
  organisation_id: string;
  role: string;
}
