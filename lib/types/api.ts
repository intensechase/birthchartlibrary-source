// Typed request/response shapes for API routes.
// Import these in route handlers to document the contract.

export interface ApiError {
  error: string
}

export interface ApiSuccess {
  success: true
  message?: string
}

// Auth
export interface LoginRequest {
  email: string
  password: string
  turnstileToken?: string
}

export interface LoginResponse {
  user: { id: string; email: string }
}

export interface SignupRequest {
  email: string
  password: string
  turnstileToken?: string
  signup_source?: string
  signup_ref?: string
}

export interface SignupResponse {
  user: { id: string; email: string }
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  password: string
}

export interface ChangePasswordRequest {
  password: string
}

export interface ChangeEmailRequest {
  email: string
}

// Birth chart
export interface CalculateRequest {
  birthDate: string
  birthTime?: string | null
  lat: number
  lng: number
  birthCity: string
  label?: string
  subjectName?: string | null
  isPrimary?: boolean
  turnstileToken?: string
}

// Shared
export type ApiResponse<T> = T | ApiError
