export const AUTH_TOKENS = {
  ITokenService: Symbol("ITokenService"),
} as const;

export const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;

export const COOKIE_NAME = {
  REFRESH_TOKEN: "refresh_token",
  GOOGLE_STATE: "google_state",
  GOOGLE_NONCE: "google_nonce",
} as const;

export const COOKIE_MAX_AGE = {
  REFRESH_TOKEN: 7 * 24 * 60 * 60 * 1000, // 7일
  GOOGLE_OAUTH: 5 * 60 * 1000, // 5분
} as const;
