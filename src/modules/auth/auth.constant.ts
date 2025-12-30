export const AUTH_TOKENS = {
  ITokenService: Symbol("ITokenService"),
} as const;

export const TOKEN_TYPE = {
  ACCESS: "access",
  REFRESH: "refresh",
} as const;
